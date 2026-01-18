import React from "react";
import * as THREE from "three";
import { useFrame, type ThreeElements } from "@react-three/fiber";

export type PillarEnergyMaterialProps = {
    colorA?: THREE.ColorRepresentation;
    colorB?: THREE.ColorRepresentation;
    intensity?: number;
    speed?: number;
    seed?: number;
} & Omit<ThreeElements["meshStandardMaterial"], "ref">;

/**
 * MeshStandardMaterial with a small injected emissive shader animation.
 * Keeps existing lighting/PBR while adding moving "energy" bands.
 */
export const PillarEnergyMaterial = ({
    colorA = "#4fd1ff",
    colorB = "#b14dff",
    intensity = 1.6,
    speed = 0.55,
    seed = 0,
    ...materialProps
}: PillarEnergyMaterialProps) => {
    const materialRef = React.useRef<THREE.MeshStandardMaterial | null>(null);

    const uniforms = React.useMemo(
        () => ({
            uTime: { value: 0 },
            uColorA: { value: new THREE.Color(colorA) },
            uColorB: { value: new THREE.Color(colorB) },
            uIntensity: { value: intensity },
            uSpeed: { value: speed },
            uSeed: { value: seed },
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    React.useEffect(() => {
        uniforms.uColorA.value.set(colorA);
        uniforms.uColorB.value.set(colorB);
        uniforms.uIntensity.value = intensity;
        uniforms.uSpeed.value = speed;
        uniforms.uSeed.value = seed;

        const mat = materialRef.current;
        if (!mat) return;

        mat.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = uniforms.uTime;
            shader.uniforms.uColorA = uniforms.uColorA;
            shader.uniforms.uColorB = uniforms.uColorB;
            shader.uniforms.uIntensity = uniforms.uIntensity;
            shader.uniforms.uSpeed = uniforms.uSpeed;
            shader.uniforms.uSeed = uniforms.uSeed;

            mat.userData.shader = shader;

            shader.vertexShader = shader.vertexShader
                .replace(
                    "#include <common>",
                    "#include <common>\nvarying vec3 vWorldPos;\nvarying vec3 vNormalW;\n"
                )
                .replace(
                    "#include <begin_vertex>",
                    [
                        "#include <begin_vertex>",
                        "vec4 worldPos = modelMatrix * vec4(position, 1.0);",
                        "vWorldPos = worldPos.xyz;",
                        "vNormalW = normalize(mat3(modelMatrix) * normal);",
                    ].join("\n")
                );

            shader.fragmentShader = shader.fragmentShader
                .replace(
                    "#include <common>",
                    [
                        "#include <common>",
                        "varying vec3 vWorldPos;",
                        "varying vec3 vNormalW;",
                        "uniform float uTime;",
                        "uniform vec3 uColorA;",
                        "uniform vec3 uColorB;",
                        "uniform float uIntensity;",
                        "uniform float uSpeed;",
                        "uniform float uSeed;",
                        "\nfloat hash(vec2 p) {",
                        "  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);",
                        "}",
                        "\nfloat noise(vec2 p) {",
                        "  vec2 i = floor(p);",
                        "  vec2 f = fract(p);",
                        "  float a = hash(i);",
                        "  float b = hash(i + vec2(1.0, 0.0));",
                        "  float c = hash(i + vec2(0.0, 1.0));",
                        "  float d = hash(i + vec2(1.0, 1.0));",
                        "  vec2 u = f * f * (3.0 - 2.0 * f);",
                        "  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;",
                        "}",
                        "\nfloat fbm(vec2 p) {",
                        "  float f = 0.0;",
                        "  float a = 0.5;",
                        "  mat2 m = mat2(1.6, -1.2, 1.2, 1.6);",
                        "  f += a * noise(p); p = m * p; a *= 0.55;",
                        "  f += a * noise(p); p = m * p; a *= 0.55;",
                        "  f += a * noise(p); p = m * p; a *= 0.55;",
                        "  f += a * noise(p);",
                        "  return f;",
                        "}",
                        "\nfloat ridged(vec2 p) {",
                        "  float n = fbm(p);",
                        "  n = 1.0 - abs(n * 2.0 - 1.0);",
                        "  return n * n;",
                        "}",
                        "\nmat2 rot(float a) {",
                        "  float s = sin(a);",
                        "  float c = cos(a);",
                        "  return mat2(c, -s, s, c);",
                        "}",
                    ].join("\n")
                )
                .replace(
                    "vec3 totalEmissiveRadiance = emissive;",
                    [
                        "vec3 totalEmissiveRadiance = emissive;",
                        "// Holographic aurora / filament energy",
                        "float y = vWorldPos.y;",
                        "float t = uTime * uSpeed;",
                        "vec3 V = normalize(cameraPosition - vWorldPos);",
                        "float fres = pow(1.0 - clamp(dot(normalize(vNormalW), V), 0.0, 1.0), 2.2);",

                        "// Base coordinates (slightly rotated so it doesn't read like stripes)",
                        "vec2 p = (rot(0.35 + uSeed) * vWorldPos.xz) * 0.55 + vec2(uSeed * 9.0, uSeed * 4.0);",
                        "p += vec2(t * 0.06, -t * 0.04);",

                        "// Domain warp for more organic motion",
                        "vec2 w = vec2(",
                        "  fbm(p * 0.9 + vec2(0.0, t * 0.08)),",
                        "  fbm(p * 0.9 + vec2(3.7, -t * 0.07))",
                        ");",
                        "vec2 pw = p + w * 1.25;",

                        "// Filaments (ridged noise) + soft clouds",
                        "float fil = ridged(pw * 1.9 + vec2(0.0, y * 0.18));",
                        "float cloud = fbm(pw * 0.75 + vec2(y * 0.07, 0.0));",
                        "float detail = fbm(pw * 2.8 + vec2(-t * 0.15, t * 0.1));",

                        "// Height variation that isn't just top/bottom",
                        "float yNoise = fbm(vec2(y * 0.45 + uSeed * 2.0, t * 0.09));",
                        "float vShape = 0.55 + 0.45 * sin(y * 0.9 + yNoise * 2.5 + uSeed * 5.0);",
                        "vShape = clamp(vShape, 0.25, 1.0);",

                        "// Color mixing: slow spatial + a bit of time, but smooth",
                        "float mRaw = fbm(pw * 0.22 + vec2(0.0, t * 0.03) + uSeed);",
                        "float mixT = smoothstep(0.25, 0.85, mRaw);",
                        "float hueWobble = 0.08 * sin(t * 0.9 + y * 0.7 + uSeed * 3.0);",
                        "mixT = clamp(mixT + hueWobble, 0.0, 1.0);",
                        "vec3 energyColor = mix(uColorA, uColorB, mixT);",

                        "// Pulsing without obvious bands (phase is warped)",
                        "float phase = (y * 0.55 + fbm(pw * 0.5) * 1.2 + uSeed * 1.7);",
                        "float pulse = 0.55 + 0.45 * sin(6.2831 * (phase * 0.25 - t * 0.35));",
                        "pulse = pow(pulse, 2.2);",

                        "// Energy field",
                        "float core = (0.35 + 0.65 * cloud) * (0.35 + 0.65 * fil);",
                        "core *= (0.8 + 0.2 * detail);",
                        "float energy = core * vShape * (0.75 + 0.25 * pulse);",

                        "// Soft sparkles (not jittery)",
                        "float sp = smoothstep(0.86, 1.0, fbm(pw * 4.5 + vec2(t * 0.12, -t * 0.08) + uSeed));",
                        "energy += sp * 0.18;",

                        "// Edge glow",
                        "energy += fres * 0.35;",

                        "totalEmissiveRadiance += energyColor * energy * uIntensity;",
                    ].join("\n")
                );
        };

        mat.needsUpdate = true;
    }, [colorA, colorB, intensity, speed, seed, uniforms]);

    useFrame((state) => {
        const mat = materialRef.current;
        const shader = mat?.userData?.shader as
            | { uniforms: Record<string, { value: unknown }> }
            | undefined;

        if (!shader) return;
        const uTime = shader.uniforms.uTime as { value: number } | undefined;
        if (!uTime) return;
        uTime.value = state.clock.getElapsedTime();
    });

    return (
        <meshStandardMaterial
            ref={materialRef}
            color="#0f0f10"
            metalness={0.2}
            roughness={0.75}
            emissive="#000000"
            {...materialProps}
        />
    );
};
