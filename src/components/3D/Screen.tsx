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

/** The video screen for the various pages. */
export const Screen = ({
    videoSrc,
    video,
    onVideoReady,
}: {
    videoSrc?: string;
    video?: HTMLVideoElement;
    onVideoReady?: (video: HTMLVideoElement) => void;
}) => {
    const [internalVideo, setInternalVideo] = React.useState<HTMLVideoElement | null>(null);
    const activeVideo = video ?? internalVideo;

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
        if (video) {
            onVideoReady?.(video);
            return;
        }

        if (!videoSrc) return;
        const vid = document.createElement("video");
        vid.src = videoSrc;
        vid.crossOrigin = "Anonymous";
        vid.loop = true;
        vid.muted = true;
        vid.playsInline = true;
        void vid.play();

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
    }, [video, videoSrc, onVideoReady]);

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
                ) : null}
            </mesh>
        </>
    );
};
