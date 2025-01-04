import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import styles from "@/styles/Three.module.scss";
import { Brad } from "./Brad";
import { Ground } from "./Ground";
import { Screen } from "./Screen";
import { PointAtCamera } from "./PointAtCamera";
import { SceneProps } from "@/utils/types";

/** The Base 3D scene. */
export const Base3DScene = ({
    videoSrc,
    shouldUseFreeCamera,
    shouldRender,
}: SceneProps) => {
    return shouldRender ? (
        <div className={styles.canvasContainer}>
            <Canvas
                gl={{ alpha: false }}
                camera={{ position: [0, 3, 100], fov: 15 }}
            >
                <color attach="background" args={["black"]} />
                <fog attach="fog" args={["black", 15, 20]} />
                <Suspense fallback={null}>
                    <group position={[0, -1, 0]}>
                        <Brad />
                        <Screen videoSrc={videoSrc} />
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
                    {shouldUseFreeCamera ? <PointAtCamera /> : null}
                </Suspense>
            </Canvas>
        </div>
    ) : null;
};
