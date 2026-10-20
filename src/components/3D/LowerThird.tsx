import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * Layout is authored in "design px" at 200px per scene unit (the 4-unit-wide
 * screen is 800 x 450), then rasterized at a higher density so it stays crisp.
 */
const DESIGN_PX_PER_UNIT = 200;
const TEXTURE_PX_PER_UNIT = 512;
const RASTER_SCALE = TEXTURE_PX_PER_UNIT / DESIGN_PX_PER_UNIT;

const LAYOUT = {
    padTop: 10,
    padBottom: 12,
    padLeft: 18,
    edgeWidth: 4,
    titleSize: 30,
    subtitleSize: 15,
    gap: 6,
    /** Logo is drawn after the title, sitting on its baseline like in the header. */
    logoSize: 34,
    logoGap: 2,
};

const REVEAL_DELAY_S = 0.6;
const REVEAL_DURATION_S = 0.7;

type LowerThirdProps = {
    /** Whether the strap is shown; it wipes in again each time this turns on. */
    visible?: boolean;
    /** While true, the strap stays hidden (e.g. the screen is on static). */
    holdRef?: React.MutableRefObject<boolean>;
    /** Top line, e.g. a person's or project's name. Shown uppercase. */
    title: string;
    /** Optional square image drawn right after the title (e.g. a logo). */
    logoSrc?: string;
    /** Second line, e.g. a role or a date. */
    subtitle?: string;
    /** Bottom-left corner of the strap, in scene units. */
    position: [number, number, number];
    /** Strap width in scene units. */
    width?: number;
};

const readCssVar = (name: string, fallback: string) => {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    return value || fallback;
};

const getDesignHeight = (hasSubtitle: boolean) =>
    LAYOUT.padTop +
    LAYOUT.titleSize +
    (hasSubtitle ? LAYOUT.gap + LAYOUT.subtitleSize : 0) +
    LAYOUT.padBottom;

/** Paints the strap (gradient, accent edge, text) into the canvas. */
const paintStrap = (
    canvas: HTMLCanvasElement,
    title: string,
    subtitle: string | undefined,
    fonts: { title: string; subtitle: string },
    accent: string,
    logo?: HTMLImageElement,
) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width / RASTER_SCALE;
    const h = canvas.height / RASTER_SCALE;

    ctx.setTransform(RASTER_SCALE, 0, 0, RASTER_SCALE, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const bg = ctx.createLinearGradient(0, 0, w, 0);
    bg.addColorStop(0, "rgba(5, 6, 11, 0.86)");
    bg.addColorStop(0.7, "rgba(5, 6, 11, 0.7)");
    bg.addColorStop(1, "rgba(5, 6, 11, 0)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, LAYOUT.edgeWidth, h);

    ctx.textBaseline = "top";

    ctx.font = `400 ${LAYOUT.titleSize}px ${fonts.title}`;
    ctx.letterSpacing = "0.08em";
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    const titleText = title.toUpperCase();
    ctx.fillText(titleText, LAYOUT.padLeft, LAYOUT.padTop);

    if (logo) {
        const metrics = ctx.measureText(titleText);
        // With a "top" baseline, the descent of uppercase text lands on the baseline.
        const baselineY = LAYOUT.padTop + metrics.actualBoundingBoxDescent;
        ctx.drawImage(
            logo,
            LAYOUT.padLeft + metrics.width + LAYOUT.logoGap,
            Math.max(2, baselineY - LAYOUT.logoSize),
            LAYOUT.logoSize,
            LAYOUT.logoSize,
        );
    }

    if (subtitle) {
        ctx.font = `600 ${LAYOUT.subtitleSize}px ${fonts.subtitle}`;
        ctx.letterSpacing = "0.06em";
        ctx.fillStyle = accent;
        ctx.fillText(
            subtitle,
            LAYOUT.padLeft,
            LAYOUT.padTop + LAYOUT.titleSize + LAYOUT.gap,
        );
    }
};

/**
 * A broadcast-style name strap that lives in the 3D scene, so nearer objects
 * (like Brad) correctly cover it. Wipes in from the left when mounted.
 */
export const LowerThird = ({
    visible = true,
    holdRef,
    title,
    logoSrc,
    subtitle,
    position,
    width = 1.6,
}: LowerThirdProps) => {
    const gl = useThree((state) => state.gl);
    const height = getDesignHeight(Boolean(subtitle)) / DESIGN_PX_PER_UNIT;

    const texture = React.useMemo(() => {
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(width * TEXTURE_PX_PER_UNIT);
        canvas.height = Math.round(height * TEXTURE_PX_PER_UNIT);
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = gl.capabilities.getMaxAnisotropy();
        return tex;
    }, [width, height, gl]);

    // Anchor the plane at its bottom-left corner so `position` places that corner.
    const geometry = React.useMemo(() => {
        const geo = new THREE.PlaneGeometry(width, height);
        geo.translate(width / 2, height / 2, 0);
        return geo;
    }, [width, height]);

    React.useEffect(() => {
        let cancelled = false;
        const fonts = {
            title: readCssVar("--font-handwritten", "cursive"),
            subtitle: readCssVar("--font-body", "sans-serif"),
        };
        const accent = readCssVar("--accent", "#f7941e");

        let logo: HTMLImageElement | undefined;

        const paint = () => {
            if (cancelled) return;
            paintStrap(
                texture.image as HTMLCanvasElement,
                title,
                subtitle,
                fonts,
                accent,
                logo,
            );
            texture.needsUpdate = true;
        };

        const loadLogo = async () => {
            if (!logoSrc) return;
            const img = new Image();
            img.src = logoSrc;
            await img.decode();
            logo = img;
        };

        // Paint right away, then again once the web fonts and logo are ready.
        paint();
        void Promise.allSettled([
            document.fonts.load(`${LAYOUT.titleSize}px ${fonts.title}`),
            document.fonts.load(`600 ${LAYOUT.subtitleSize}px ${fonts.subtitle}`),
            loadLogo(),
        ]).then(paint);

        return () => {
            cancelled = true;
        };
    }, [texture, title, subtitle, logoSrc]);

    React.useEffect(
        () => () => {
            texture.dispose();
            geometry.dispose();
        },
        [texture, geometry],
    );

    const meshRef = React.useRef<THREE.Mesh>(null);
    const elapsedRef = React.useRef(0);
    const prefersReducedMotion = React.useMemo(
        () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
        [],
    );

    // Wipe in: grow the plane from its left edge while revealing the same
    // fraction of the texture, so nothing stretches.
    useFrame((_, delta) => {
        const mesh = meshRef.current;
        if (!mesh) return;
        if (!visible || holdRef?.current) {
            // Hidden: reset so the wipe replays next time it's shown.
            elapsedRef.current = 0;
            mesh.visible = false;
            return;
        }
        elapsedRef.current += delta;
        const t = prefersReducedMotion
            ? 1
            : THREE.MathUtils.clamp(
                  (elapsedRef.current - REVEAL_DELAY_S) / REVEAL_DURATION_S,
                  0,
                  1,
              );
        const eased = 1 - Math.pow(1 - t, 3);
        const reveal = Math.max(eased, 0.0001);
        mesh.scale.x = reveal;
        texture.repeat.x = reveal;
        mesh.visible = t > 0;
    });

    return (
        <mesh ref={meshRef} position={position} geometry={geometry}>
            <meshBasicMaterial
                map={texture}
                transparent
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    );
};
