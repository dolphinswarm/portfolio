import React from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

/** The 2D Brad image in front of the intro video screen. */
export const Brad = ({
    fadeRef,
}: {
    fadeRef?: React.MutableRefObject<number>;
}) => {
    const props = useTexture({
        map: "/threejs/brad-pose.png",
    });

    const matRef = React.useRef<THREE.MeshStandardMaterial | null>(null);

    useFrame(() => {
        if (!matRef.current) return;
        const t = fadeRef?.current ?? 1;
        matRef.current.opacity = THREE.MathUtils.clamp(t, 0, 1);
        // Avoid the plane writing depth when nearly invisible.
        matRef.current.depthWrite = t > 0.02;
    });

    return (
        <mesh rotation={[0, 0, 0]} position={[0, 0.73, 1.5]}>
            <planeGeometry args={[0.4, 1.5]} />
            <meshStandardMaterial
                ref={matRef}
                transparent={true}
                opacity={1}
                {...props}
            />
        </mesh>
    );
};
