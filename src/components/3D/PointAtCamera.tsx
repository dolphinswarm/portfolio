import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A script to make the camera point at the area the mouse pointer is in.
 * @param isActive - Whether the camera should point at the mouse pointer. If false, the camera will point at the center of the scene.
 */
export const PointAtCamera = ({ isActive }: { isActive: boolean }) => {
    const [vec] = React.useState(() => new THREE.Vector3());
    return useFrame((state) => {
        const xPos = isActive ? state.pointer.x : 0;
        const yPos = isActive ? state.pointer.y : 0;
        state.camera.position.lerp(vec.set(xPos * 5, 3 + yPos * 2, 14), 0.05);
        state.camera.lookAt(0, 0, 0);
    });
};
