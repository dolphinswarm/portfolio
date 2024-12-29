import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/** A script to make the camera point at the area the mouse pointer is in. */
export const PointAtCamera = () => {
	const [vec] = React.useState(() => new THREE.Vector3());
	return useFrame((state) => {
		state.camera.position.lerp(
			vec.set(state.pointer.x * 5, 3 + state.pointer.y * 2, 14),
			0.05
		);
		state.camera.lookAt(0, 0, 0);
	});
};
