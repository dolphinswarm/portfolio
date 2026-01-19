import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import styles from "@/styles/Three.module.scss";
import { Brad } from "./Brad";
import { Ground } from "./Ground";
import { Screen } from "./Screen";
import { Pillars } from "./Pillars";
import { PointAtCamera } from "./PointAtCamera";
import { SceneProps } from "@/utils/types";
import { Environment } from "@react-three/drei";
import { BackgroundScreen } from "./BackgroundScreen";
import * as THREE from "three";

const RouteTransition = ({
    isIndexRoute,
    transitionRef,
    speed = 2,
}: {
    isIndexRoute: boolean;
    transitionRef: React.MutableRefObject<number>;
    speed?: number;
}) => {
    useFrame((_, delta) => {
        const target = isIndexRoute ? 1 : 0;
        transitionRef.current = THREE.MathUtils.damp(
            transitionRef.current,
            target,
            speed,
            delta,
        );
    });
    return null;
};

const BackdropRig = ({
    transitionRef,
    videoSrc,
    onVideoReady,
    sourceVideo,
}: {
    transitionRef: React.MutableRefObject<number>;
    videoSrc: string;
    onVideoReady: (video: HTMLVideoElement) => void;
    sourceVideo: HTMLVideoElement | null;
}) => {
    const backgroundRef = React.useRef<THREE.Group>(null);
    const pillarsRef = React.useRef<THREE.Group>(null);

    useFrame(() => {
        const t = transitionRef.current;

        if (pillarsRef.current) {
            // Sink into the ground when routing away.
            pillarsRef.current.position.y = THREE.MathUtils.lerp(-4, 0, t);
        }

        if (backgroundRef.current) {
            // Push deeper into fog when routing away.
            backgroundRef.current.position.z = THREE.MathUtils.lerp(-26, 0, t);
        }
    });

    return (
        <>
            <group ref={backgroundRef}>
                <BackgroundScreen
                    videoSrc={videoSrc}
                    onVideoReady={onVideoReady}
                    scale={3}
                />
            </group>
            <group ref={pillarsRef}>
                <Pillars sourceVideo={sourceVideo} />
            </group>
        </>
    );
};

/** The Base 3D scene. */
export const Base3DScene = ({
    videoSrc,
    shouldUseFreeCamera,
    shouldRender,
    isIndexRoute,
}: SceneProps) => {
    const [videoEl, setVideoEl] = React.useState<HTMLVideoElement | null>(null);
    const routeTransitionRef = React.useRef(isIndexRoute ? 1 : 0);

    return shouldRender ? (
        <div className={styles.canvasContainer}>
            <Canvas
                gl={{ alpha: false }}
                camera={{ position: [0, 3, 100], fov: 15 }}
            >
                <color attach="background" args={["black"]} />
                <fog attach="fog" args={["black", 18, 36]} />
                <Suspense fallback={null}>
                    <RouteTransition
                        isIndexRoute={isIndexRoute}
                        transitionRef={routeTransitionRef}
                        speed={2}
                    />
                    <group position={[0, -1, 0]}>
                        <Brad fadeRef={routeTransitionRef} />
                        {videoEl ? <Screen video={videoEl} /> : null}
                        <BackdropRig
                            transitionRef={routeTransitionRef}
                            videoSrc={videoSrc}
                            onVideoReady={setVideoEl}
                            sourceVideo={videoEl}
                        />
                        <Ground />
                    </group>
                    <group>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[0, 10, 0]} intensity={0.3} />
                        <directionalLight
                            position={[-50, 0, -40]}
                            intensity={0.7}
                        />
                    </group>
                    <PointAtCamera mode={isIndexRoute && shouldUseFreeCamera ? "free" : "locked"} />
                </Suspense>
                <Environment preset="city" />
            </Canvas>
        </div>
    ) : null;
};
