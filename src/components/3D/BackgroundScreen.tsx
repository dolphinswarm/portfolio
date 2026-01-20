import React from "react";
import * as THREE from "three";
import { useGLTF, useTexture } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import { PillarEnergyMaterial } from "./PillarEnergyMaterial";
import { useVideoPalette } from "@/hooks/useVideoPalette";

const BACKDROP_MODEL_PATH = "/threejs/portfolio_backdrop.glb";
const SCREEN_1_PATH = "/threejs/portfolio_backdrop_screen_1.glb";
const SCREEN_2_PATH = "/threejs/portfolio_backdrop_screen_2.glb";

const STONE_TEXTURES = {
    map: "/threejs/Poliigon_StoneQuartzite_8060_BaseColor.jpg",
    normalMap: "/threejs/Poliigon_StoneQuartzite_8060_Normal.png",
    roughnessMap: "/threejs/Poliigon_StoneQuartzite_8060_Roughness.jpg",
    metalnessMap: "/threejs/Poliigon_StoneQuartzite_8060_Metallic.jpg",
    aoMap: "/threejs/Poliigon_StoneQuartzite_8060_AmbientOcclusion.jpg",
    displacementMap: "/threejs/Poliigon_StoneQuartzite_8060_Displacement.png",
} as const;

type GLTFBackdropResult = {
    scene: THREE.Group;
};

type GLTFScreenResult = {
    nodes: {
        Cylinder: THREE.Mesh;
    };
};

export type BackgroundScreenProps = {
    media: { sourceType: "video" | "image"; source: string };
    onVideoReady?: (video: HTMLVideoElement) => void;

    screenPosition?: THREE.Vector3Tuple;
    backdropPosition?: THREE.Vector3Tuple;
} & ThreeElements["group"];

const getUvBounds = (geometry: THREE.BufferGeometry) => {
    const uvAttr = geometry.getAttribute("uv") as THREE.BufferAttribute | undefined;
    if (!uvAttr || !uvAttr.array) return null;

    const a = uvAttr.array as unknown as ArrayLike<number>;
    let minU = Number.POSITIVE_INFINITY;
    let maxU = Number.NEGATIVE_INFINITY;
    let minV = Number.POSITIVE_INFINITY;
    let maxV = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < a.length; i += 2) {
        const u = a[i];
        const v = a[i + 1];
        if (u < minU) minU = u;
        if (u > maxU) maxU = u;
        if (v < minV) minV = v;
        if (v > maxV) maxV = v;
    }

    const rangeU = maxU - minU;
    const rangeV = maxV - minV;
    if (!Number.isFinite(rangeU) || !Number.isFinite(rangeV)) return null;
    if (rangeU <= 0 || rangeV <= 0) return null;

    return { minU, maxU, minV, maxV, rangeU, rangeV };
};

const getAspectCoverTransform = (opts: {
    videoAspect: number;
    targetAspect: number;
}) => {
    const { videoAspect, targetAspect } = opts;
    if (!Number.isFinite(videoAspect) || !Number.isFinite(targetAspect)) {
        return { repeatX: 1, repeatY: 1, offsetX: 0, offsetY: 0 };
    }
    if (videoAspect <= 0 || targetAspect <= 0) {
        return { repeatX: 1, repeatY: 1, offsetX: 0, offsetY: 0 };
    }

    // “Cover” without stretching: crop the longer dimension.
    if (targetAspect > videoAspect) {
        // Target is wider -> crop top/bottom.
        const ry = videoAspect / targetAspect;
        return { repeatX: 1, repeatY: ry, offsetX: 0, offsetY: (1 - ry) / 2 };
    }

    // Target is taller -> crop left/right.
    const rx = targetAspect / videoAspect;
    return { repeatX: rx, repeatY: 1, offsetX: (1 - rx) / 2, offsetY: 0 };
};

/**
 * Combines the environment backdrop mesh and the two "portfolio screen" meshes.
 *
 * Defaults match the previous positions in `Base3DScene`:
 * - screenPosition: [0, 0, -14.7]
 * - backdropPosition: [0, -0.05, -15]
 */
export const BackgroundScreen = ({
    media,
    onVideoReady,
    screenPosition = [0, 0, -14.7],
    backdropPosition = [0, -0.05, -15],
    scale,
    ...groupProps
}: BackgroundScreenProps) => {
    // Backdrop
    const backdropGltf = useGLTF(BACKDROP_MODEL_PATH) as unknown as GLTFBackdropResult;
    const stoneTextures = useTexture(STONE_TEXTURES);

    const backdropMaterial = React.useMemo(() => {
        const {
            map,
            normalMap,
            roughnessMap,
            metalnessMap,
            aoMap,
            displacementMap,
        } = stoneTextures;

        // Textures applied to glTF meshes should not be flipped vertically.
        const all = [
            map,
            normalMap,
            roughnessMap,
            metalnessMap,
            aoMap,
            displacementMap,
        ];
        for (const t of all) {
            t.flipY = false;
            t.wrapS = THREE.RepeatWrapping;
            t.wrapT = THREE.RepeatWrapping;
            t.repeat.set(2, 2);
            t.anisotropy = 8;
        }

        // Color textures should be treated as sRGB.
        map.colorSpace = THREE.SRGBColorSpace;

        return new THREE.MeshStandardMaterial({
            map,
            normalMap,
            roughnessMap,
            metalnessMap,
            aoMap,
            displacementMap,
            roughness: 1,
            metalness: 0,
            displacementScale: 0.025,
        });
    }, [stoneTextures]);

    const backdropScene = React.useMemo(
        () => backdropGltf.scene.clone(true),
        [backdropGltf.scene],
    );

    React.useLayoutEffect(() => {
        backdropScene.traverse((obj) => {
            if (!(obj instanceof THREE.Mesh)) return;
            if (!obj.geometry) return;

            // AO maps require uv2; if the model doesn't have it, mirror uv.
            const geom = obj.geometry;
            if (!geom.attributes.uv2 && geom.attributes.uv) {
                geom.setAttribute("uv2", geom.attributes.uv);
            }

            obj.material = backdropMaterial;
            obj.castShadow = true;
            obj.receiveShadow = true;
        });

        return () => {
            backdropMaterial.dispose();
        };
    }, [backdropScene, backdropMaterial]);

    // Screen meshes + video
    const screen1 = useGLTF(SCREEN_1_PATH) as unknown as GLTFScreenResult;
    const screen2 = useGLTF(SCREEN_2_PATH) as unknown as GLTFScreenResult;

    const [internalVideo, setInternalVideo] = React.useState<HTMLVideoElement | null>(
        null,
    );

    const [imageTexture, setImageTexture] = React.useState<THREE.Texture | null>(null);

    const videoTexture = React.useMemo(() => {
        if (!internalVideo) return null;
        const tex = new THREE.VideoTexture(internalVideo);
        tex.colorSpace = THREE.SRGBColorSpace;
        // GLTF UVs typically expect flipY=false (vs plane geometry).
        // This corrects the “upside down” look on the backdrop screen.
        tex.flipY = false;

        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        return tex;
    }, [internalVideo]);

    React.useEffect(() => {
        return () => {
            setImageTexture((prev) => {
                prev?.dispose();
                return null;
            });
        };
    }, []);

    const screen1UvBounds = React.useMemo(() => {
        try {
            const s1 = screen1.nodes.Cylinder;
            return getUvBounds(s1.geometry);
        } catch {
            return null;
        }
    }, [screen1]);

    React.useEffect(() => {
        if (!videoTexture) return;
        return () => {
            videoTexture.dispose();
        };
    }, [videoTexture]);

    React.useEffect(() => {
        // Video takes priority; only load an image if no videoSrc.
        const src =
            media.sourceType === "image" && typeof media.source === "string" && media.source.trim().length > 0
                ? media.source.trim()
                : "";

        if (!src) {
            setImageTexture((prev) => {
                prev?.dispose();
                return null;
            });
            return;
        }

        let cancelled = false;
        const loader = new THREE.TextureLoader();
        loader.load(
            src,
            (tex) => {
                if (cancelled) {
                    tex.dispose();
                    return;
                }

                tex.colorSpace = THREE.SRGBColorSpace;
                // GLTF UVs typically expect flipY=false.
                tex.flipY = false;
                tex.minFilter = THREE.LinearFilter;
                tex.magFilter = THREE.LinearFilter;
                tex.generateMipmaps = false;
                tex.wrapS = THREE.ClampToEdgeWrapping;
                tex.wrapT = THREE.ClampToEdgeWrapping;

                setImageTexture((prev) => {
                    prev?.dispose();
                    return tex;
                });
            },
            undefined,
            () => {
                if (cancelled) return;
                setImageTexture(null);
            },
        );

        return () => {
            cancelled = true;
        };
    }, [media.sourceType, media.source]);

    React.useEffect(() => {
        if (!internalVideo || !videoTexture) return;

        // Match the front screen plane's perceived aspect.
        const targetAspect = 4 / 2.25;

        const update = () => {
            const w = internalVideo.videoWidth;
            const h = internalVideo.videoHeight;
            if (!w || !h) return;

            const cover = getAspectCoverTransform({
                videoAspect: w / h,
                targetAspect,
            });

            // Normalize the GLB's UVs to 0..1 first (fixes Y “zoom/stretch”),
            // then apply aspect-cover cropping.
            if (screen1UvBounds) {
                const baseRepeatX = 1 / screen1UvBounds.rangeU;
                const baseRepeatY = 1 / screen1UvBounds.rangeV;
                const baseOffsetX = -screen1UvBounds.minU / screen1UvBounds.rangeU;
                const baseOffsetY = -screen1UvBounds.minV / screen1UvBounds.rangeV;

                videoTexture.repeat.set(
                    baseRepeatX * cover.repeatX,
                    baseRepeatY * cover.repeatY,
                );
                videoTexture.offset.set(
                    baseOffsetX * cover.repeatX + cover.offsetX,
                    baseOffsetY * cover.repeatY + cover.offsetY,
                );
            } else {
                // Fallback: at least apply cover crop.
                videoTexture.repeat.set(cover.repeatX, cover.repeatY);
                videoTexture.offset.set(cover.offsetX, cover.offsetY);
            }

            videoTexture.needsUpdate = true;
        };

        if (internalVideo.readyState >= 1) update();
        internalVideo.addEventListener("loadedmetadata", update);
        return () => {
            internalVideo.removeEventListener("loadedmetadata", update);
        };
    }, [internalVideo, videoTexture, screen1UvBounds]);

    React.useEffect(() => {
        if (!imageTexture) return;

        // Match the front screen plane's perceived aspect.
        const targetAspect = 4 / 2.25;

        const img = imageTexture.image as { width?: number; height?: number } | undefined;
        const w = img?.width ?? 0;
        const h = img?.height ?? 0;
        if (!w || !h) return;

        const cover = getAspectCoverTransform({ videoAspect: w / h, targetAspect });

        if (screen1UvBounds) {
            const baseRepeatX = 1 / screen1UvBounds.rangeU;
            const baseRepeatY = 1 / screen1UvBounds.rangeV;
            const baseOffsetX = -screen1UvBounds.minU / screen1UvBounds.rangeU;
            const baseOffsetY = -screen1UvBounds.minV / screen1UvBounds.rangeV;

            imageTexture.repeat.set(
                baseRepeatX * cover.repeatX,
                baseRepeatY * cover.repeatY,
            );
            imageTexture.offset.set(
                baseOffsetX * cover.repeatX + cover.offsetX,
                baseOffsetY * cover.repeatY + cover.offsetY,
            );
        } else {
            imageTexture.repeat.set(cover.repeatX, cover.repeatY);
            imageTexture.offset.set(cover.offsetX, cover.offsetY);
        }

        imageTexture.needsUpdate = true;
    }, [imageTexture, screen1UvBounds]);

    React.useEffect(() => {
        const src = media.sourceType === "video" && typeof media.source === "string" ? media.source.trim() : "";
        if (!src) {
            setInternalVideo(null);
            return;
        }

        const vid = document.createElement("video");
        vid.src = src;
        vid.crossOrigin = "Anonymous";
        vid.preload = "auto";
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;

        const playPromise = vid.play();
        if (playPromise && typeof (playPromise as Promise<void>).catch === "function") {
            (playPromise as Promise<void>).catch((err: unknown) => {
                const name = (err as { name?: string } | null)?.name;
                // Common during StrictMode double-invocation and route transitions.
                if (name === "AbortError" || name === "NotAllowedError") return;
            });
        }

        setInternalVideo(vid);
        onVideoReady?.(vid);

        return () => {
            try {
                vid.pause();
                vid.removeAttribute("src");
                vid.load();
            } catch {
                // no-op
            }
        };
    }, [media.sourceType, media.source, onVideoReady]);

    const palette = useVideoPalette(internalVideo, {
        sampleSize: 16,
        fps: 12,
        smoothing: 0.22,
    });

    const s1 = screen1.nodes.Cylinder;
    const s2 = screen2.nodes.Cylinder;

    return (
        <group {...groupProps}>
            <group position={screenPosition} scale={scale}>
                <mesh
                    geometry={s1.geometry}
                    position={s1.position}
                    rotation={s1.rotation}
                    scale={s1.scale}
                >
                    {videoTexture ? (
                        <meshBasicMaterial toneMapped={false} map={videoTexture} />
                    ) : imageTexture ? (
                        <meshBasicMaterial toneMapped={false} map={imageTexture} />
                    ) : (
                        <meshBasicMaterial color="#111111" />
                    )}
                </mesh>

                <mesh
                    geometry={s2.geometry}
                    position={s2.position}
                    rotation={s2.rotation}
                    scale={s2.scale}
                >
                    <PillarEnergyMaterial
                        intensity={1.5}
                        speed={0.6}
                        seed={2}
                        colorA={palette.average}
                        colorB={palette.vibrant}
                    />
                </mesh>
            </group>

            <group position={backdropPosition} scale={scale}>
                <primitive object={backdropScene} />
            </group>
        </group>
    );
};

useGLTF.preload(BACKDROP_MODEL_PATH);
useGLTF.preload(SCREEN_1_PATH);
useGLTF.preload(SCREEN_2_PATH);
