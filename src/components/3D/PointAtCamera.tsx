import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** How quickly the camera eases toward its target; higher is snappier. */
const DAMPING = 6;
/** With reduced motion: effectively a cut instead of a glide. */
const DAMPING_REDUCED_MOTION = 1000;

/**
 * A script to make the camera point at the area the mouse pointer is in.
 * - free: pointer-driven camera (home)
 * - locked: fixed camera position / lookAt (non-index routes)
 *
 * With prefers-reduced-motion, the camera ignores the pointer and cuts to
 * each route's view instead of gliding.
 */
export const PointAtCamera = ({
    mode,
}: {
    mode: "free" | "locked";
}) => {
    const [posVec] = React.useState(() => new THREE.Vector3());
    const [lookVec] = React.useState(() => new THREE.Vector3());
    const prefersReducedMotion = React.useMemo(
        () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches,
        [],
    );
    const damping = prefersReducedMotion ? DAMPING_REDUCED_MOTION : DAMPING;

    return useFrame((state, delta) => {
        const isFree = mode === "free";
        const followsPointer = isFree && !prefersReducedMotion;

        const xPos = followsPointer ? state.pointer.x : 0;
        const yPos = followsPointer ? state.pointer.y : 0;

        const targetPos = isFree
            ? posVec.set(xPos * 5, 3 + yPos * 2, 14)
            : posVec.set(0, 0.75, 9.75);

        // Smoothly move the camera.
        state.camera.position.x = THREE.MathUtils.damp(
            state.camera.position.x,
            targetPos.x,
            damping,
            delta,
        );
        state.camera.position.y = THREE.MathUtils.damp(
            state.camera.position.y,
            targetPos.y,
            damping,
            delta,
        );
        state.camera.position.z = THREE.MathUtils.damp(
            state.camera.position.z,
            targetPos.z,
            damping,
            delta,
        );

        // Zoom a bit when locked (smaller fov => tighter view).
        const camera = state.camera as THREE.PerspectiveCamera;
        camera.fov = THREE.MathUtils.damp(camera.fov, 15, damping, delta);
        camera.updateProjectionMatrix();

        // Look at the screen area when locked; otherwise center-ish.
        const targetLook = isFree
            ? lookVec.set(0, 0, 0)
            : lookVec.set(0, 0.1, -0.5);
        state.camera.lookAt(targetLook);
    });
};
