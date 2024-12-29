import React from "react";
import { useTexture } from "@react-three/drei";

/** The 2D Brad image in front of the intro video screen. */
export const Brad = () => {
    const props = useTexture({
        map: "/threejs/brad-pose.png",
    });
    return (
        <mesh rotation={[0, 0, 0]} position={[0, 0.73, 1.5]}>
            <planeGeometry args={[0.4, 1.5]} />
            <meshStandardMaterial transparent={true} {...props} />
        </mesh>
    );
};
