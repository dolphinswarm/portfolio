import React from 'react';
import * as THREE from 'three';

/** The video screen for the various pages. */
export const Screen = ({ videoSrc }: { videoSrc: string }) => {
	const [video] = React.useState(() => {
		const vid = document.createElement('video');
		vid.src = videoSrc;
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
				<meshBasicMaterial toneMapped={false}>
					<videoTexture
						attach='map'
						args={[video]}
						colorSpace={THREE.SRGBColorSpace}
					/>
				</meshBasicMaterial>
			</mesh>
		</>
	);
};
