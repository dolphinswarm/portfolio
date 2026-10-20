import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/** Shortest burst on a switch, so it reads as a channel flip (seconds). */
const MIN_HOLD_S = 0.4;
/** How often the snow re-randomizes; lower is calmer. */
const NOISE_FPS = 24;
/** How fast the bright band rolls up the screen (screens per second). */
const ROLL_SPEED = 0.6;

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uAmount;
varying vec2 vUv;

// Sine-free hash (Dave Hoskins): no visible diagonal patterns on GPUs.
float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void main() {
    // Analog snow: fine grains, stretched horizontally, new every frame.
    vec2 cell = floor(vUv * vec2(260.0, 300.0));
    // Wrap the frame counter so hash inputs stay small and precise.
    float frame = mod(floor(uTime * ${NOISE_FPS.toFixed(1)}), 997.0);
    float noise = hash(cell + vec2(frame * 17.0, frame * 31.0));

    // Darken every other row for a scanline feel without moire.
    float scanline = 1.0 - 0.14 * mod(cell.y, 2.0);
    // A brighter band rolling up the screen.
    float roll = smoothstep(0.88, 1.0, fract(vUv.y - uTime * ${ROLL_SPEED.toFixed(2)}));

    // Kept mid-gray (not full white) so the flash stays gentle.
    float value = mix(0.1, 0.62, noise) * scanline + roll * 0.12;
    gl_FragColor = vec4(vec3(value), uAmount);
}
`;

type ChannelStaticProps = {
    /** Changing this value plays the static burst. */
    channelKey: string;
    /** Whether the new picture can be shown; static holds until it is. */
    isReadyRef?: React.MutableRefObject<boolean>;
    /** Set every frame to whether the static is currently showing. */
    activeRef?: React.MutableRefObject<boolean>;
    position: [number, number, number];
    width: number;
    height: number;
};

/**
 * TV static over the screen whenever its content changes, like flipping a
 * channel: it snaps on, holds until the new picture is ready, then cuts away.
 * It also covers the screen on first load until the first picture is ready.
 */
export const ChannelStatic = ({
    channelKey,
    isReadyRef,
    activeRef,
    position,
    width,
    height,
}: ChannelStaticProps) => {
    const meshRef = React.useRef<THREE.Mesh>(null);
    // Start covered: on first load there's no minimum hold (so the start time
    // doesn't matter), it just waits for the picture, and never shows at all
    // if the picture is ready on the first frame.
    const startRef = React.useRef<number | null>(0);
    const minHoldRef = React.useRef(0);
    const previousKeyRef = React.useRef(channelKey);

    const prefersReducedMotion = React.useMemo(
        () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
        [],
    );

    const material = React.useMemo(
        () =>
            new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: { uTime: { value: 0 }, uAmount: { value: 1 } },
                transparent: true,
                depthWrite: false,
                toneMapped: false,
            }),
        [],
    );

    React.useEffect(() => () => material.dispose(), [material]);

    React.useEffect(() => {
        // Only burst when the key actually changes (not on first load, and not
        // when Strict Mode re-runs this effect with the same key).
        if (previousKeyRef.current === channelKey) return;
        previousKeyRef.current = channelKey;
        startRef.current = performance.now();
        // Reduced motion: still cover loading, but skip the extra flip time.
        minHoldRef.current = prefersReducedMotion ? 0 : MIN_HOLD_S;
    }, [channelKey, prefersReducedMotion]);

    useFrame((state) => {
        const mesh = meshRef.current;
        if (!mesh) return;

        if (startRef.current !== null) {
            const t = (performance.now() - startRef.current) / 1000;
            const isReady = isReadyRef?.current ?? true;
            // No time cap: if the picture never loads, it stays on static
            // ("no signal") rather than showing a black screen.
            if (t >= minHoldRef.current && isReady) {
                startRef.current = null;
            }
        }

        // Reduced motion: a still frame of snow instead of animated noise.
        if (!prefersReducedMotion) {
            material.uniforms.uTime.value = state.clock.elapsedTime;
        }
        // No fades: on or off, like a real set. Hidden (not unmounted) when
        // idle so its shader stays compiled.
        mesh.visible = startRef.current !== null;
        if (activeRef) activeRef.current = mesh.visible;
    });

    return (
        // Drawn before other transparent objects, so anything in front of the
        // screen (Brad, the lower third) stays on top regardless of sorting.
        <mesh
            ref={meshRef}
            position={position}
            visible={false}
            renderOrder={-1}
        >
            <planeGeometry args={[width, height]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
};
