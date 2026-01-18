import React from "react";
import { MeshReflectorMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";

/** The reflective ground for the various pages. */
export const Ground = () => {
    const geometryRef = React.useRef<THREE.PlaneGeometry | null>(null);

    const {
        map,
        aoMap,
        normalMap,
        roughnessMap,
        metalnessMap,
        // NOTE: The provided Poliigon displacement is a .tiff; most browsers won't load TIFF as an image.
        // Convert it to .png/.jpg and add it to /public/threejs, then uncomment.
        // displacementMap,
    } = useTexture({
        map: "/threejs/Poliigon_StoneQuartzite_8060_BaseColor.jpg",
        aoMap: "/threejs/Poliigon_StoneQuartzite_8060_AmbientOcclusion.jpg",
        normalMap: "/threejs/Poliigon_StoneQuartzite_8060_Normal.png",
        roughnessMap: "/threejs/Poliigon_StoneQuartzite_8060_Roughness.jpg",
        metalnessMap: "/threejs/Poliigon_StoneQuartzite_8060_Metallic.jpg",
        // displacementMap: "/threejs/Poliigon_StoneQuartzite_8060_Displacement.png",
    });

    React.useEffect(() => {
        map.colorSpace = THREE.SRGBColorSpace;

        const textures = [map, aoMap, normalMap, roughnessMap, metalnessMap];
        for (const tex of textures) {
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.RepeatWrapping;
            tex.repeat.set(6, 6);
            tex.needsUpdate = true;
        }

        // AO maps require uv2.
        const geo = geometryRef.current;
        if (geo && geo.attributes.uv && !geo.attributes.uv2) {
            geo.setAttribute("uv2", new THREE.BufferAttribute(geo.attributes.uv.array, 2));
        }
    }, [map, aoMap, normalMap, roughnessMap, metalnessMap]);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            {/* Increase segments if you later enable displacement */}
            <planeGeometry ref={geometryRef} args={[50, 50, 1, 1]} />
            <MeshReflectorMaterial
                blur={[1024, 1024]}
                resolution={1024}
                mixBlur={1}
                mixStrength={80}
                roughness={1}
                depthScale={2}
                minDepthThreshold={0}
                maxDepthThreshold={1.4}
                color="#ffffff"
                metalness={0.2}
                mirror={0.5}
                map={map}
                aoMap={aoMap}
                normalMap={normalMap}
                roughnessMap={roughnessMap}
                metalnessMap={metalnessMap}
                normalScale={new THREE.Vector2(0.6, 0.6)}
                // displacementMap={displacementMap}
                // displacementScale={0.05}
            />
        </mesh>
    );
};
