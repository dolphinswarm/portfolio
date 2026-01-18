import React from "react";
import { useGLTF, Clone } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

const MODEL_PATH = "/threejs/portfolio_backdrop.glb";

export const Backdrop = (props: ThreeElements["group"]) => {
    const gltf = useGLTF(MODEL_PATH);

    return (
        <group {...props}>
            <Clone object={gltf.scene} />
        </group>
    );
};

useGLTF.preload(MODEL_PATH);
