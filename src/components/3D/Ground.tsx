import React from "react";
import { MeshReflectorMaterial, useTexture } from "@react-three/drei";

/** The reflective ground for the various pages. */
export const Ground = () => {
    const [floor, normal] = useTexture([
        "threejs/SurfaceImperfections003_1K_var1.jpg",
        "threejs/SurfaceImperfections003_1K_Normal.jpg",
    ]);
    return (
        <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
                blur={[512, 512]}
                resolution={512}
                args={[10, 10]}
                mirror={0.5}
                mixBlur={6}
                mixStrength={1.5}
                rotation={[-Math.PI / 2, 0, Math.PI / 2]}
                color="#a0a0a0"
                metalness={0.4}
                roughnessMap={floor}
                normalMap={normal}
                normalScale={[2, 2]}
            />
        </mesh>
    );
};
