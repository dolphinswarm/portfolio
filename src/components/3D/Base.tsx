import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import styles from "@/styles/Three.module.scss";
import { Brad } from "./Brad";
import { Ground } from "./Ground";
import { Screen } from "./Screen";
import { Pillars } from "./Pillars";
import { PointAtCamera } from "./PointAtCamera";
import { SceneProps } from "@/utils/types";
import { Environment } from "@react-three/drei";
import { BackgroundScreen } from "./BackgroundScreen";

/** The Base 3D scene. */
export const Base3DScene = ({
    videoSrc,
    shouldUseFreeCamera,
    shouldRender,
}: SceneProps) => {
    const [videoEl, setVideoEl] = React.useState<HTMLVideoElement | null>(null);

    console.log("videoSrc", videoSrc);
    console.log("shouldUseFreeCamera", shouldUseFreeCamera);
    console.log("shouldRender", shouldRender);
    return shouldRender ? (
        <div className={styles.canvasContainer}>
            <Canvas
                gl={{ alpha: false }}
                camera={{ position: [0, 3, 100], fov: 15 }}
            >
                <color attach="background" args={["black"]} />
                <fog attach="fog" args={["black", 18, 36]} />
                <Suspense fallback={null}>
                    <group position={[0, -1, 0]}>
                        <Brad />
                        {videoEl ? <Screen video={videoEl} /> : null}
                            <BackgroundScreen
                                videoSrc={videoSrc}
                                onVideoReady={setVideoEl}
                                scale={3}
                            />
                        <Pillars sourceVideo={videoEl} />
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
                    <PointAtCamera isActive={shouldUseFreeCamera} />
                </Suspense>
                <Environment preset="city" />
            </Canvas>
        </div>
    ) : null;
};
