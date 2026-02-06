import React from "react";
import * as THREE from "three";
import { useFrame, type ThreeElements } from "@react-three/fiber";

export type ProceduralScreenVariant = "about" | "connect" | "music";

export type ProceduralScreenMaterialProps = {
    variant: ProceduralScreenVariant;
    intensity?: number;
    speed?: number;
    seed?: number;
    /** Optional per-instance color overrides (hex or any CSS color THREE.Color supports). */
    overrideColors?: { colorA?: string; colorB?: string; base?: string };
    /** Optional 1D (width=bins, height=1) texture containing FFT magnitudes. */
    spectrumTexture?: THREE.DataTexture | null;
    /** FFT bin count (texture width). If omitted, inferred when possible. */
    spectrumSize?: number;
    /** Strength multiplier for the spectrum visualization. */
    spectrumStrength?: number;
} & Omit<ThreeElements["shaderMaterial"], "ref" | "args" | "attach">;

export const getProceduralVariantColors = (
    variant: ProceduralScreenVariant,
) => {
    if (variant === "connect") {
        return {
            // CRT-ish phosphor palette (keeps the screen dark; energy provides color)
            colorA: "#63ff7c", // green phosphor
            colorB: "#ffd166", // warm amber
            base: new THREE.Color("#040405"),
        };
    }

    if (variant === "music") {
        return {
            // Neon spectrum palette on a dark base
            colorA: "#3fe5ff", // cyan
            colorB: "#ff2bd6", // magenta
            base: new THREE.Color("#0b0c14"),
        };
    }

    // about
    return {
        colorA: "#3fe5ff", // cyan
        colorB: "#b84dff", // violet
        base: new THREE.Color("#05060b"),
    };
};

const vertexShader = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPos;

    void main() {
        vUv = uv;
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = /* glsl */ `
    varying vec2 vUv;
    varying vec3 vPos;

    uniform float uTime;
    uniform float uIntensity;
    uniform float uSpeed;
    uniform float uSeed;
    uniform float uMode;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    uniform vec3 uBase;
    uniform sampler2D uSpectrumTex;
    uniform float uSpectrumSize;
    uniform float uSpectrumStrength;

    float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    vec2 hash2(vec2 p) {
        return vec2(hash(p), hash(p + vec2(5.2, 1.3)));
    }

    mat2 rot(float a) {
        float s = sin(a);
        float c = cos(a);
        return mat2(c, -s, s, c);
    }

    float fbm(vec2 p) {
        float f = 0.0;
        float a = 0.55;
        mat2 m = mat2(1.6, -1.2, 1.2, 1.6);
        f += a * noise(p); p = m * p; a *= 0.55;
        f += a * noise(p); p = m * p; a *= 0.55;
        f += a * noise(p); p = m * p; a *= 0.55;
        f += a * noise(p);
        return f;
    }

    float ridged(vec2 p) {
        float n = fbm(p);
        n = 1.0 - abs(n * 2.0 - 1.0);
        return n * n;
    }

    // Voronoi: returns (minDist, edgeMetric)
    vec2 voronoi(vec2 x) {
        vec2 n = floor(x);
        vec2 f = fract(x);

        float md = 8.0;
        float md2 = 8.0;

        for (int j = -1; j <= 1; j++) {
            for (int i = -1; i <= 1; i++) {
                vec2 g = vec2(float(i), float(j));
                vec2 o = hash2(n + g);
                vec2 r = g + o - f;
                float d = dot(r, r);
                if (d < md) {
                    md2 = md;
                    md = d;
                } else if (d < md2) {
                    md2 = d;
                }
            }
        }

        float d1 = sqrt(md);
        float d2 = sqrt(md2);
        // Larger value near borders.
        float edge = clamp((d2 - d1) * 6.0, 0.0, 1.0);
        return vec2(d1, edge);
    }

    void main() {
        float t = uTime * uSpeed;

        vec2 uv = vUv;

        // Gentle vignette only (no center-darkening)
        float d = distance(uv, vec2(0.5));
        float vignette = 1.0 - smoothstep(0.62, 1.02, d);

        // About: cycle palette. Connect: keep stable.
        vec3 cA = uColorA;
        vec3 cB = uColorB;
        if (uMode < 0.5) {
            // Faster palette cycling for About
            float cycle = 0.5 + 0.5 * sin(t * 1.35 + uSeed * 0.7);
            cA = mix(uColorA, uColorB, cycle);
            cB = mix(uColorB, uColorA, cycle);
        }

        vec3 col = uBase;

        if (uMode < 0.5) {
            // ABOUT: soft filament energy (aurora-like)
            vec2 p = (uv - 0.5);
            p.x *= 1.6;
            p = rot(0.25 + uSeed * 0.07) * p;

            vec2 w = vec2(
                fbm(p * 1.4 + vec2(0.0, t * 0.08) + uSeed),
                fbm(p * 1.4 + vec2(3.2, -t * 0.07) - uSeed)
            );

            vec2 pw = p + w * 0.9;
            pw += vec2(t * 0.03, -t * 0.02);

            float fil = ridged(pw * 2.2 + vec2(0.0, vPos.y * 0.35));
            float cloud = fbm(pw * 1.05 + vec2(vPos.y * 0.12, 0.0));
            float m = fbm(pw * 0.55 + vec2(0.0, t * 0.03));

            vec3 energy = mix(cA, cB, smoothstep(0.2, 0.85, m));

            float glow = fil;
            glow *= 0.55 + 0.45 * cloud;
            glow = pow(glow, 2.1);

            float strength = uIntensity * 0.085;
            col += energy * glow * strength;
            col += 0.02 * energy * (0.5 + 0.5 * sin((p.y + w.y) * 3.0 + t * 0.8));
        } else if (uMode < 1.5) {
            // CONNECT: CRT/retro (no grid)
            // Barrel distortion + mild scanline jitter
            vec2 q = uv * 2.0 - 1.0;
            float r2 = dot(q, q);
            q *= 1.0 + 0.10 * r2;
            vec2 cuv = q * 0.5 + 0.5;

            // Horizontal “wiggle” (per-scanline) + occasional stronger wobble
            float lineHash = noise(vec2(cuv.y * 220.0, t * 0.8 + uSeed));
            float wiggle = (lineHash - 0.5) * 0.006;
            float wobble = 0.002 * sin(t * 1.6 + cuv.y * 18.0);
            cuv.x += wiggle + wobble;

            // Avoid “UV extend” smear: don't just clamp and stretch.
            // Instead, compute a soft mask for in-bounds UVs and blend to base near the edges.
            vec2 cuvUnclamped = cuv;
            float feather = 0.03;
            float inX = smoothstep(0.0, feather, cuvUnclamped.x) * smoothstep(0.0, feather, 1.0 - cuvUnclamped.x);
            float inY = smoothstep(0.0, feather, cuvUnclamped.y) * smoothstep(0.0, feather, 1.0 - cuvUnclamped.y);
            float inBounds = clamp(inX * inY, 0.0, 1.0);

            // Clamp for the rest of the math so it doesn't explode, but keep the mask.
            cuv = clamp(cuvUnclamped, vec2(0.0), vec2(1.0));

            vec2 p = (cuv - 0.5);
            p.x *= 1.6;
            p = rot(0.04 + uSeed * 0.03) * p;

            // Cell-ish structure, but softened into an analog “signal”
            vec2 vp = p * 5.2 + vec2(t * 0.10, -t * 0.07) + vec2(uSeed * 1.7, uSeed * 0.9);
            vec2 v = voronoi(vp);
            float cellDist = v.x;
            float border = 1.0 - v.y;

            float nodes = exp(-13.0 * cellDist * cellDist);
            float wires = smoothstep(0.25, 0.92, border);

            float field = fbm(vp * 0.32 + vec2(0.0, t * 0.07));
            float tone = smoothstep(0.18, 0.92, field);

            // CRT scanlines + subtle rolling band
            float scan = 0.5 + 0.5 * sin((cuv.y * 260.0) + t * 2.6);
            scan = 0.90 + 0.10 * scan;
            float roll = 0.5 + 0.5 * sin((cuv.y * 6.0) - t * 1.4);
            roll = 0.92 + 0.08 * roll;

            // Phosphor mask (triad-ish) along x
            float triad = fract(cuv.x * 360.0);
            float maskR = smoothstep(0.0, 0.15, triad) * (1.0 - smoothstep(0.33, 0.48, triad));
            float maskG = smoothstep(0.33, 0.48, triad) * (1.0 - smoothstep(0.66, 0.81, triad));
            float maskB = smoothstep(0.66, 0.81, triad);
            vec3 phosphor = vec3(0.92 + 0.08 * maskR, 0.92 + 0.08 * maskG, 0.92 + 0.08 * maskB);

            // Chromatic aberration: tiny channel offsets
            vec2 ca = vec2(0.0018, 0.0) * (0.4 + 0.6 * r2);
            float toneR = smoothstep(0.18, 0.92, fbm((vp + ca * 420.0) * 0.32 + vec2(0.0, t * 0.07)));
            float toneB = smoothstep(0.18, 0.92, fbm((vp - ca * 420.0) * 0.32 + vec2(0.0, t * 0.07)));
            vec3 energy = mix(cA, cB, vec3(toneR, tone, toneB));

            // Film noise (very subtle) + static
            float n = noise(cuv * 420.0 + vec2(t * 1.2, -t * 0.9) + uSeed);
            float grain = (n - 0.5) * 0.03;

            float signal = (0.55 * wires + 0.65 * nodes);
            signal *= (0.75 + 0.25 * tone);

            float strength = uIntensity * 0.09;
            col += energy * (signal * strength) * scan * roll;
            col += grain;
            col *= phosphor;

            // Fade effect out at warped borders (prevents edge smear)
            col = mix(uBase, col, inBounds);
        } else {
            // MUSIC: audio-reactive spectrum bars
            // Map x to a slightly log-ish curve so lows get more resolution.
            float x = clamp(uv.x, 0.0, 1.0);
            float fx = pow(x, 2.2);

            float bins = max(1.0, uSpectrumSize);
            float idx = floor(fx * (bins - 1.0));
            float u = (idx + 0.5) / bins;
            float amp = texture2D(uSpectrumTex, vec2(u, 0.5)).r; // 0..1

            // Shape the amplitude for nicer movement.
            float h = pow(clamp(amp, 0.0, 1.0), 1.10);
            h = clamp(h * 1.05, 0.0, 1.0);

            // Anti-aliased bar edge.
            float aa = 0.008;
            float bar = 1.0 - smoothstep(h - aa, h + aa, uv.y);
            // A thin outline at the top edge helps readability on both light and dark bases.
            float topLine = smoothstep(h - aa * 2.5, h - aa * 0.7, uv.y)
                - smoothstep(h + aa * 0.7, h + aa * 2.5, uv.y);

            // Subtle scanlines to keep it feeling like the in-world screen.
            float scan = 0.5 + 0.5 * sin((uv.y * 280.0) + t * 2.2);
            scan = 0.92 + 0.08 * scan;

            vec3 energy = mix(cA, cB, fx);

            // If the base is bright (including white), additive bars wash out.
            // Switch to a contrast-aware mix (dark bars on bright bases, bright bars on dark bases).
            float baseLum = dot(uBase, vec3(0.2126, 0.7152, 0.0722));
            float brightBase = smoothstep(0.55, 0.90, baseLum);

            // Preserve the chosen bar colors even on bright bases (including white).
            // We *darken* the energy for contrast instead of forcing it to black.
            float barDarken = mix(1.0, 0.22, brightBase);
            vec3 barColor = energy * barDarken;

            // Compose bars via mix so they remain visible even on white bases.
            float barAlpha = clamp(bar * (0.30 + 0.70 * h) * uSpectrumStrength, 0.0, 1.0);
            col = mix(uBase, barColor, barAlpha);

            // Add a little emissive glow (reduced on bright bases to avoid whitening).
            float glow = bar * (0.20 + 1.35 * h);
            col += energy * glow * (0.10 * uSpectrumStrength) * scan * (1.0 - 0.75 * brightBase);

            // Outline: keep it energy-tinted (not white) to avoid “white-capped” bars.
            vec3 outlineColor = mix(energy * 1.15, vec3(0.06), brightBase);
            col = mix(col, outlineColor, clamp(topLine * 0.55, 0.0, 1.0));

            // Add a little "floor" energy so silence isn't dead.
            col += 0.015 * energy * (0.5 + 0.5 * sin(t * 0.8 + fx * 12.0));
        }

        // Vignette (keeps corners from blowing out)
        col *= 0.76 + 0.24 * vignette;

        // Slight exposure lift so the visuals don't blend into the page background.
        // About/Connect can be brighter; Music stays slightly dimmer to keep its bars readable.
        float exposure = (uMode < 1.5) ? 2.4 : 1.5;
        col *= exposure;

        // Hard clamp so white text stays readable.
        // About/Connect: allow a bit more headroom.
        // Music previously clamped very low, which crushed bar contrast unless colors were near-white.
        float clampMax = (uMode < 1.5) ? 0.56 : 0.85;
        col = min(col, vec3(clampMax));

        gl_FragColor = vec4(col, 1.0);
    }
`;

export const ProceduralScreenMaterial = ({
    variant,
    intensity = 1,
    speed = 0.7,
    seed = 0,
    overrideColors,
    spectrumTexture,
    spectrumSize,
    spectrumStrength = 1,
    ...materialProps
}: ProceduralScreenMaterialProps) => {
    const defaults = React.useMemo(
        () => getProceduralVariantColors(variant),
        [variant],
    );

    const resolvedColors = React.useMemo(() => {
        const colorA = overrideColors?.colorA ?? defaults.colorA;
        const colorB = overrideColors?.colorB ?? defaults.colorB;
        const base = overrideColors?.base
            ? new THREE.Color(overrideColors.base)
            : defaults.base;
        return { colorA, colorB, base };
    }, [
        defaults,
        overrideColors?.colorA,
        overrideColors?.colorB,
        overrideColors?.base,
    ]);

    const fallbackSpectrumTex = React.useMemo(() => {
        const tex = new THREE.DataTexture(
            new Uint8Array([0]),
            1,
            1,
            THREE.RedFormat,
            THREE.UnsignedByteType,
        );
        tex.flipY = false;
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.unpackAlignment = 1;
        tex.colorSpace = THREE.NoColorSpace;
        tex.needsUpdate = true;
        return tex;
    }, []);

    const uniforms = React.useMemo(
        () => ({
            uTime: { value: 0 },
            uIntensity: { value: intensity },
            uSpeed: { value: speed },
            uSeed: { value: seed },
            uMode: {
                value: variant === "connect" ? 1 : variant === "music" ? 2 : 0,
            },
            uColorA: { value: new THREE.Color(resolvedColors.colorA) },
            uColorB: { value: new THREE.Color(resolvedColors.colorB) },
            uBase: { value: resolvedColors.base.clone() },
            uSpectrumTex: { value: fallbackSpectrumTex },
            uSpectrumSize: { value: 1 },
            uSpectrumStrength: { value: spectrumStrength },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    React.useEffect(() => {
        uniforms.uIntensity.value = intensity;
        uniforms.uSpeed.value = speed;
        uniforms.uSeed.value = seed;
        uniforms.uMode.value =
            variant === "connect" ? 1 : variant === "music" ? 2 : 0;
        uniforms.uColorA.value.set(resolvedColors.colorA);
        uniforms.uColorB.value.set(resolvedColors.colorB);
        uniforms.uBase.value.copy(resolvedColors.base);
        uniforms.uSpectrumTex.value = spectrumTexture ?? fallbackSpectrumTex;
        uniforms.uSpectrumSize.value =
            typeof spectrumSize === "number"
                ? spectrumSize
                : spectrumTexture?.image?.width
                  ? (spectrumTexture.image.width as number)
                  : 1;
        uniforms.uSpectrumStrength.value = spectrumStrength;
    }, [
        intensity,
        speed,
        seed,
        variant,
        resolvedColors,
        spectrumTexture,
        spectrumSize,
        spectrumStrength,
        fallbackSpectrumTex,
        uniforms,
    ]);

    React.useEffect(() => {
        // Keep spectrum uniforms in sync without forcing material re-creation.
        uniforms.uSpectrumTex.value = spectrumTexture ?? fallbackSpectrumTex;
        uniforms.uSpectrumSize.value =
            typeof spectrumSize === "number"
                ? spectrumSize
                : spectrumTexture?.image?.width
                  ? (spectrumTexture.image.width as number)
                  : 1;
        uniforms.uSpectrumStrength.value = spectrumStrength;
    }, [
        spectrumTexture,
        spectrumSize,
        spectrumStrength,
        uniforms,
        fallbackSpectrumTex,
    ]);

    useFrame((state) => {
        uniforms.uTime.value = state.clock.getElapsedTime();
    });

    const material = React.useMemo(() => {
        const m = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
        });
        m.toneMapped = false;
        return m;
    }, [uniforms]);

    React.useEffect(() => {
        return () => {
            material.dispose();
        };
    }, [material]);

    React.useEffect(() => {
        return () => {
            fallbackSpectrumTex.dispose();
        };
    }, [fallbackSpectrumTex]);

    return <primitive object={material} attach="material" {...materialProps} />;
};
