import React, { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import styles from "@/styles/Three.module.scss";
import { Brad } from "./Brad";
import { Ground } from "./Ground";
import { Screen } from "./Screen";
import { Pillars } from "./Pillars";
import { PointAtCamera } from "./PointAtCamera";
import type { SceneMedia, SceneProps } from "@/utils/types";
import { Environment } from "@react-three/drei";
import { BackgroundScreen } from "./BackgroundScreen";
import { LowerThird } from "./LowerThird";
import { SITE_NAME, SITE_ROLE } from "@/utils/site";
import * as THREE from "three";
import type { ProceduralScreenVariant } from "./ProceduralScreenMaterial";

const DEFAULT_STATIC_VIDEO_SRC = "/branding/videos/tv-static.mp4";

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

const BradVisibilityTransition = ({
    shouldShowBrad,
    transitionRef,
    speed = 6,
}: {
    shouldShowBrad: boolean;
    transitionRef: React.MutableRefObject<number>;
    speed?: number;
}) => {
    useFrame((_, delta) => {
        const target = shouldShowBrad ? 1 : 0;
        transitionRef.current = THREE.MathUtils.damp(
            transitionRef.current,
            target,
            speed,
            delta,
        );
    });
    return null;
};

/**
 * Compiles every material in the scene once it has mounted, including hidden
 * ones (the inactive procedural/media screens), so later route changes only
 * toggle visibility and never wait on a shader compile.
 */
const ShaderWarmup = () => {
    const { gl, scene, camera } = useThree();
    const didCompileRef = React.useRef(false);

    React.useEffect(() => {
        // rAF ensures the scene's meshes have been committed before compiling.
        const id = window.requestAnimationFrame(() => {
            if (didCompileRef.current) return;
            didCompileRef.current = true;
            // Async compile avoids blocking the main thread where the browser
            // supports parallel shader compilation.
            gl.compileAsync(scene, camera).catch(() => {
                // Compiling lazily on first render is the fallback.
            });
        });

        return () => {
            window.cancelAnimationFrame(id);
        };
    }, [gl, scene, camera]);

    return null;
};

const BackdropRig = ({
    transitionRef,
    media,
    onVideoReady,
    sourceVideo,
    proceduralVariant,
}: {
    transitionRef: React.MutableRefObject<number>;
    media: SceneMedia;
    onVideoReady: (video: HTMLVideoElement) => void;
    sourceVideo: HTMLVideoElement | null;
    proceduralVariant?: ProceduralScreenVariant;
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
                    media={media}
                    onVideoReady={onVideoReady}
                    proceduralVariant={proceduralVariant}
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
    media,
    backgroundVariant,
    shouldUseFreeCamera,
    shouldRender,
    isIndexRoute,
    shouldShowBrad,
}: SceneProps) => {
    const [videoEl, setVideoEl] = React.useState<HTMLVideoElement | null>(null);
    const routeTransitionRef = React.useRef(isIndexRoute ? 1 : 0);
    const bradVisibilityRef = React.useRef(
        isIndexRoute || shouldShowBrad ? 1 : 0,
    );
    const [eventSource, setEventSource] = React.useState<
        HTMLElement | undefined
    >(undefined);

    React.useEffect(() => {
        // Ensure pointer tracking keeps working even if the canvas is layered
        // behind other DOM elements (e.g., after route transitions).
        setEventSource(document.body);
    }, []);

    const resolvedMedia = React.useMemo<SceneMedia>(() => {
        const type = media?.sourceType;
        const src =
            typeof media?.source === "string" ? media.source.trim() : "";

        if ((type === "video" || type === "image") && src.length > 0) {
            return {
                sourceType: type,
                source: src,
                audio:
                    type === "video" && media?.audio?.enabled
                        ? {
                              enabled: true,
                              volume: media.audio.volume,
                          }
                        : { enabled: false },
            };
        }

        return {
            sourceType: "video",
            source: DEFAULT_STATIC_VIDEO_SRC,
            audio: { enabled: false },
        };
    }, [media]);

    const proceduralVariant = React.useMemo<
        ProceduralScreenVariant | undefined
    >(() => {
        if (backgroundVariant === "about") return "about";
        if (backgroundVariant === "connect") return "connect";
        return undefined;
    }, [backgroundVariant]);

    const screenProceduralVariant = React.useMemo<
        ProceduralScreenVariant | undefined
    >(() => {
        if (backgroundVariant === "about") return "about";
        if (backgroundVariant === "connect") return "connect";
        if (backgroundVariant === "music") return "music";
        return undefined;
    }, [backgroundVariant]);

    React.useEffect(() => {
        // Clear previously created video element when switching to image.
        if (resolvedMedia.sourceType === "image") setVideoEl(null);
    }, [resolvedMedia.sourceType]);

    return shouldRender ? (
        <div className={styles.canvasContainer}>
            <Canvas
                gl={{ alpha: false }}
                eventSource={eventSource}
                eventPrefix="client"
                camera={{ position: [0, 3, 100], fov: 15 }}
            >
                <color attach="background" args={["#05060b"]} />
                <fog attach="fog" args={["#05060b", 18, 36]} />
                <Suspense fallback={null}>
                    <ShaderWarmup />
                    <RouteTransition
                        isIndexRoute={isIndexRoute}
                        transitionRef={routeTransitionRef}
                        speed={2}
                    />
                    <BradVisibilityTransition
                        shouldShowBrad={isIndexRoute || shouldShowBrad}
                        transitionRef={bradVisibilityRef}
                        speed={6}
                    />
                    <group position={[0, -1, 0]}>
                        <Brad fadeRef={bradVisibilityRef} />
                        <Screen
                            video={videoEl ?? undefined}
                            media={resolvedMedia}
                            proceduralVariant={screenProceduralVariant}
                        />
                        {isIndexRoute ? (
                            // Bottom-left of the screen (a 4 x 2.25 plane centered
                            // at [0, 1.1, -0.5]), just in front of it and behind
                            // Brad (z = 1.5), who covers it where they overlap.
                            <LowerThird
                                title={SITE_NAME}
                                logoSrc="/branding/img/me/logo.png"
                                subtitle={SITE_ROLE}
                                position={[-1.85, 0.15, -0.45]}
                                width={1.6}
                            />
                        ) : null}
                        <BackdropRig
                            transitionRef={routeTransitionRef}
                            media={resolvedMedia}
                            onVideoReady={setVideoEl}
                            sourceVideo={videoEl}
                            proceduralVariant={proceduralVariant}
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
                    <PointAtCamera
                        mode={
                            isIndexRoute && shouldUseFreeCamera
                                ? "free"
                                : "locked"
                        }
                    />
                </Suspense>
                <Environment preset="city" />
            </Canvas>
        </div>
    ) : null;
};
