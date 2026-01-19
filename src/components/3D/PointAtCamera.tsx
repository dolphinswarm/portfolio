import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A script to make the camera point at the area the mouse pointer is in.
 * - free: pointer-driven camera (home)
 * - locked: fixed camera position / lookAt (non-index routes)
 */
export const PointAtCamera = ({
    mode,
}: {
    mode: "free" | "locked";
}) => {
    const [posVec] = React.useState(() => new THREE.Vector3());
    const [lookVec] = React.useState(() => new THREE.Vector3());

    return useFrame((state, delta) => {
        const isFree = mode === "free";

        const xPos = isFree ? state.pointer.x : 0;
        const yPos = isFree ? state.pointer.y : 0;

        const targetPos = isFree
            ? posVec.set(xPos * 5, 3 + yPos * 2, 14)
            : posVec.set(0, 0.75, 9.75);

        // Smoothly move the camera.
        state.camera.position.x = THREE.MathUtils.damp(
            state.camera.position.x,
            targetPos.x,
            6,
            delta,
        );
        state.camera.position.y = THREE.MathUtils.damp(
            state.camera.position.y,
            targetPos.y,
            6,
            delta,
        );
        state.camera.position.z = THREE.MathUtils.damp(
            state.camera.position.z,
            targetPos.z,
            6,
            delta,
        );

        // Zoom a bit when locked (smaller fov => tighter view).
        const camera = state.camera as THREE.PerspectiveCamera;
        camera.fov = THREE.MathUtils.damp(camera.fov, 15, 6, delta);
        camera.updateProjectionMatrix();

        // Look at the screen area when locked; otherwise center-ish.
        const targetLook = isFree
            ? lookVec.set(0, 0, 0)
            : lookVec.set(0, 0.1, -0.5);
        state.camera.lookAt(targetLook);
    });
};
