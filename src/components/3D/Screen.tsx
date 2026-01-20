import React from "react";
import * as THREE from "three";

const applyAspectCover = (
    texture: THREE.Texture,
    opts: { videoAspect: number; targetAspect: number },
) => {
    const { videoAspect, targetAspect } = opts;
    if (!Number.isFinite(videoAspect) || !Number.isFinite(targetAspect)) return;
    if (videoAspect <= 0 || targetAspect <= 0) return;

    // “Cover” without stretching: crop the longer dimension.
    if (targetAspect > videoAspect) {
        // Target is wider -> crop top/bottom.
        const ry = videoAspect / targetAspect;
        texture.repeat.set(1, ry);
        texture.offset.set(0, (1 - ry) / 2);
    } else {
        // Target is taller -> crop left/right.
        const rx = targetAspect / videoAspect;
        texture.repeat.set(rx, 1);
        texture.offset.set((1 - rx) / 2, 0);
    }
    texture.needsUpdate = true;
};

const useImageTexture = (src?: string, opts?: { flipY?: boolean }) => {
    const [texture, setTexture] = React.useState<THREE.Texture | null>(null);

    React.useEffect(() => {
        if (!src) {
            setTexture(null);
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
                tex.flipY = opts?.flipY ?? true;
                tex.minFilter = THREE.LinearFilter;
                tex.magFilter = THREE.LinearFilter;
                tex.generateMipmaps = false;
                tex.wrapS = THREE.ClampToEdgeWrapping;
                tex.wrapT = THREE.ClampToEdgeWrapping;
                setTexture(tex);
            },
            undefined,
            () => {
                if (cancelled) return;
                setTexture(null);
            },
        );

        return () => {
            cancelled = true;
            setTexture((prev) => {
                prev?.dispose();
                return null;
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [src]);

    return texture;
};

/** The video screen for the various pages. */
export const Screen = ({
    video,
    onVideoReady,
    media,
}: {
    video?: HTMLVideoElement;
    onVideoReady?: (video: HTMLVideoElement) => void;
    media: { sourceType: "video" | "image"; source: string };
}) => {
    const [internalVideo, setInternalVideo] = React.useState<HTMLVideoElement | null>(null);
    const activeVideo = video ?? internalVideo;

    const cleanupVideo = React.useCallback((vid: HTMLVideoElement | null) => {
        if (!vid) return;
        try {
            vid.pause();
            vid.removeAttribute("src");
            vid.load();
        } catch {
            // no-op
        }
    }, []);

    const videoTexture = React.useMemo(() => {
        if (!activeVideo) return null;
        const tex = new THREE.VideoTexture(activeVideo);
        tex.colorSpace = THREE.SRGBColorSpace;
        // Regular plane geometry expects the default orientation.
        tex.flipY = true;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        return tex;
    }, [activeVideo]);

    const imageTexture = useImageTexture(media.sourceType === "image" ? media.source : undefined, { flipY: true });

    React.useEffect(() => {
        if (!activeVideo || !videoTexture) return;

        const targetAspect = 4 / 2.25;
        const update = () => {
            const w = activeVideo.videoWidth;
            const h = activeVideo.videoHeight;
            if (!w || !h) return;
            applyAspectCover(videoTexture, { videoAspect: w / h, targetAspect });
        };

        if (activeVideo.readyState >= 1) update();

        activeVideo.addEventListener("loadedmetadata", update);
        return () => {
            activeVideo.removeEventListener("loadedmetadata", update);
        };
    }, [activeVideo, videoTexture]);

    React.useEffect(() => {
        if (!imageTexture) return;
        const img = imageTexture.image as { width?: number; height?: number } | undefined;
        const w = img?.width ?? 0;
        const h = img?.height ?? 0;
        if (!w || !h) return;

        const targetAspect = 4 / 2.25;
        applyAspectCover(imageTexture, { videoAspect: w / h, targetAspect });
    }, [imageTexture]);

    React.useEffect(() => {
        if (video) {
            onVideoReady?.(video);
            return;
        }

        if (media.sourceType !== "video") {
            // Ensure we don't keep rendering a stale VideoTexture when switching to images.
            setInternalVideo((prev) => {
                cleanupVideo(prev);
                return null;
            });
            return;
        }
        const videoSrc = media.source;
        if (!videoSrc) return;
        const vid = document.createElement("video");
        vid.src = videoSrc;
        vid.crossOrigin = "Anonymous";
        vid.preload = "auto";
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;

        const playPromise = vid.play();
        if (playPromise && typeof (playPromise as Promise<void>).catch === "function") {
            (playPromise as Promise<void>).catch((err: unknown) => {
                const name = (err as { name?: string } | null)?.name;
                if (name === "AbortError" || name === "NotAllowedError") return;
            });
        }

        setInternalVideo(vid);
        onVideoReady?.(vid);

        return () => {
            cleanupVideo(vid);

            // Only clear if we're still pointing at this video element.
            setInternalVideo((prev) => (prev === vid ? null : prev));
        };
    }, [video, media.sourceType, media.source, onVideoReady, cleanupVideo]);

    return (
        <>
            <mesh rotation={[0, 0, 0]} position={[0, 1.025, -0.63]}>
                <boxGeometry args={[4, 2.4, 0.25]} />
                <meshPhongMaterial color={[0.2, 0.2, 0.2]} />
            </mesh>
            <mesh rotation={[0, 0, 0]} position={[0, 1.1, -0.5]}>
                <planeGeometry args={[4, 2.25]} />
                {videoTexture != null ? (
                    <meshBasicMaterial toneMapped={false} map={videoTexture} />
                ) : imageTexture != null ? (
                    <meshBasicMaterial toneMapped={false} map={imageTexture} />
                ) : null}
            </mesh>
        </>
    );
};
