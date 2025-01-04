import React from "react";
import { MeshReflectorMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";

/** The reflective ground for the various pages. */
export const Ground = () => {
    const [floor, normal] = useTexture([
        "threejs/SurfaceImperfections003_1K_var1.jpg",
        "threejs/SurfaceImperfections003_1K_Normal.jpg",
    ]);
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
                blur={512}
                resolution={2048}
                mixBlur={1}
                mixStrength={80}
                roughness={1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#050505"
                metalness={0.5}
                mirror={0.5}
                roughnessMap={floor}
                normalMap={normal}
            />
        </mesh>
    );
};
