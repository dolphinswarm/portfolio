import * as React from "react";

export type VideoPalette = {
    average: string;
    vibrant: string;
};

export type UseVideoPaletteOptions = {
    sampleSize?: number;
    fps?: number;
    /** 0..1, higher = snappier changes, lower = smoother. */
    smoothing?: number;
};

const clamp255 = (value: number) => Math.max(0, Math.min(255, value));

const toHex = (value: number) => clamp255(Math.round(value)).toString(16).padStart(2, "0");

const rgbToHex = (r: number, g: number, b: number) => `#${toHex(r)}${toHex(g)}${toHex(b)}`;

const hexToRgb = (hex: string) => {
    const value = hex.replace("#", "");
    if (value.length !== 6) return { r: 255, g: 255, b: 255 };
    const r = Number.parseInt(value.slice(0, 2), 16);
    const g = Number.parseInt(value.slice(2, 4), 16);
    const b = Number.parseInt(value.slice(4, 6), 16);
    return {
        r: Number.isFinite(r) ? r : 255,
        g: Number.isFinite(g) ? g : 255,
        b: Number.isFinite(b) ? b : 255,
    };
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const rgbToHsv = (r: number, g: number, b: number) => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;

    const v = max;
    const s = max === 0 ? 0 : delta / max;
    return { s, v };
};

/**
 * Samples a playing HTMLVideoElement and returns two colors:
 * - average: the overall average frame color
 * - vibrant: the most "colorful" pixel (rough heuristic)
 */
export const useVideoPalette = (
    video: HTMLVideoElement | null,
    { sampleSize = 16, fps = 10, smoothing = 0.12 }: UseVideoPaletteOptions = {}
): VideoPalette => {
    const [palette, setPalette] = React.useState<VideoPalette>({
        average: "#3fe5ff",
        vibrant: "#b84dff",
    });

    const smoothedRef = React.useRef({
        avg: hexToRgb("#3fe5ff"),
        vib: hexToRgb("#b84dff"),
    });

    React.useEffect(() => {
        if (!video) return;
        if (typeof document === "undefined") return;

        const canvas = document.createElement("canvas");
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        let stopped = false;
        const intervalMs = Math.max(33, Math.round(1000 / fps));

        const sample = () => {
            if (stopped) return;

            // HAVE_CURRENT_DATA = 2
            if (video.readyState < 2) return;

            try {
                ctx.drawImage(video, 0, 0, sampleSize, sampleSize);
                const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);

                let rSum = 0;
                let gSum = 0;
                let bSum = 0;
                let count = 0;

                let bestScore = -1;
                let bestR = 0;
                let bestG = 0;
                let bestB = 0;

                let wSum = 0;
                let wR = 0;
                let wG = 0;
                let wB = 0;

                for (let i = 0; i < data.length; i += 4) {
                    const a = data[i + 3];
                    if (a < 16) continue;

                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];

                    rSum += r;
                    gSum += g;
                    bSum += b;
                    count += 1;

                    const { s, v } = rgbToHsv(r, g, b);
                    // Prefer saturated + bright pixels, but avoid near-white
                    const score = s * v * (1 - 0.25 * v);
                    if (score > bestScore) {
                        bestScore = score;
                        bestR = r;
                        bestG = g;
                        bestB = b;
                    }

                    // Weighted "vibrant" average to reduce single-pixel jitter
                    const w = score * score;
                    if (w > 0.001) {
                        wSum += w;
                        wR += r * w;
                        wG += g * w;
                        wB += b * w;
                    }
                }

                if (count === 0) return;

                const avgTarget = { r: rSum / count, g: gSum / count, b: bSum / count };
                const vibTarget =
                    wSum > 0
                        ? { r: wR / wSum, g: wG / wSum, b: wB / wSum }
                        : { r: bestR, g: bestG, b: bestB };

                const t = Math.max(0.01, Math.min(1, smoothing));
                const cur = smoothedRef.current;
                cur.avg = {
                    r: lerp(cur.avg.r, avgTarget.r, t),
                    g: lerp(cur.avg.g, avgTarget.g, t),
                    b: lerp(cur.avg.b, avgTarget.b, t),
                };
                cur.vib = {
                    r: lerp(cur.vib.r, vibTarget.r, t),
                    g: lerp(cur.vib.g, vibTarget.g, t),
                    b: lerp(cur.vib.b, vibTarget.b, t),
                };

                const avg = rgbToHex(cur.avg.r, cur.avg.g, cur.avg.b);
                const vib = rgbToHex(cur.vib.r, cur.vib.g, cur.vib.b);

                setPalette((prev) =>
                    prev.average === avg && prev.vibrant === vib ? prev : { average: avg, vibrant: vib }
                );
            } catch {
                // Cross-origin or transient decode errors: ignore and keep last palette.
            }
        };

        const id = window.setInterval(sample, intervalMs);
        // Sample once quickly after mount
        sample();

        return () => {
            stopped = true;
            window.clearInterval(id);
        };
    }, [video, sampleSize, fps, smoothing]);

    return palette;
};
