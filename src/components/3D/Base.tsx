import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import styles from '@/styles/Three.module.scss';
import { Reflector, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Screen = () => {
	const [video] = React.useState(() => {
		const vid = document.createElement('video');
		vid.src = '/branding/videos/demo-reel.mp4';
		vid.crossOrigin = 'Anonymous';
		vid.loop = true;
		vid.muted = true;
		vid.play();
		return vid;
	});

	return (
		<>
			<mesh rotation={[0, 0, 0]} position={[0, 1.025, -0.63]}>
				<boxGeometry args={[4, 2.4, 0.25]} />
				<meshPhongMaterial color={[0.2, 0.2, 0.2]} />
			</mesh>
			<mesh rotation={[0, 0, 0]} position={[0, 1.1, -0.5]}>
				<planeGeometry args={[4, 2.25]} />
				<meshStandardMaterial emissive={'white'} emissiveIntensity={1}>
					<videoTexture attach='map' args={[video]} />
					<videoTexture attach='emissiveMap' args={[video]} />
				</meshStandardMaterial>
			</mesh>
		</>
	);
};

const Brad = () => {
	const props = useTexture({
		map: '/threejs/brad-pose.png',
	});
	return (
		<mesh rotation={[0, 0, 0]} position={[0, 0.73, 1.5]}>
			<planeGeometry args={[0.4, 1.5]} />
			<meshStandardMaterial transparent={true} {...props} />
		</mesh>
	);
};

const Ground = () => {
	const [floor, normal] = useTexture([
		'threejs/SurfaceImperfections003_1K_var1.jpg',
		'threejs/SurfaceImperfections003_1K_Normal.jpg',
	]);
	return (
		<Reflector
			blur={[512, 512]}
			resolution={512}
			args={[10, 10]}
			mirror={0.5}
			mixBlur={6}
			mixStrength={1.5}
			rotation={[-Math.PI / 2, 0, Math.PI / 2]}
		>
			{(Material, props) => (
				<Material
					color='#a0a0a0'
					metalness={0.4}
					roughnessMap={floor}
					normalMap={normal}
					normalScale={[2, 2]}
					{...props}
				/>
			)}
		</Reflector>
	);
};

const Intro = () => {
	const [vec] = React.useState(() => new THREE.Vector3());
	return useFrame((state) => {
		state.camera.position.lerp(
			vec.set(state.pointer.x * 5, 3 + state.pointer.y * 2, 14),
			0.05
		);
		state.camera.lookAt(0, 0, 0);
	});
};

export const Base = () => {
	return (
		<div className={styles.canvasContainer}>
			<Canvas
				gl={{ alpha: false }}
				camera={{ position: [0, 3, 100], fov: 15 }}
			>
				<color attach='background' args={['black']} />
				<fog attach='fog' args={['black', 15, 20]} />
				<Suspense fallback={null}>
					<group position={[0, -1, 0]}>
						<Brad />
						<Screen />
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
					<Intro />
				</Suspense>
			</Canvas>
		</div>
	);
};
