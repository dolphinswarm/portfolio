import React from "react";

const ignorePlayError = (err: unknown) => {
    const name = (err as { name?: string } | null)?.name;
    // AbortError: the source changed or the element was torn down mid-play
    // (common in StrictMode and on route changes). NotAllowedError: the
    // browser blocked autoplay. Neither needs handling.
    if (name === "AbortError" || name === "NotAllowedError") return;
};

/**
 * Plays `video`, or when `paused`, shows a still of its first frame instead.
 *
 * A paused video still has to start playing briefly: iOS Safari ignores
 * `preload`, so nothing is decoded until playback starts, and three.js only
 * uploads a video frame to its texture once the browser presents one. So it
 * plays until the first frame is presented, then stops.
 */
export const useVideoPlayback = (
    video: HTMLVideoElement | null,
    paused: boolean,
) => {
    React.useEffect(() => {
        if (!video) return;

        let cancelled = false;
        let frameCallbackId = 0;

        const playPromise = video.play();

        if (paused) {
            const stop = () => {
                if (!cancelled) video.pause();
            };
            if ("requestVideoFrameCallback" in video) {
                frameCallbackId = video.requestVideoFrameCallback(stop);
            } else {
                // Without frame callbacks, three.js uploads whatever frame is
                // current each render, so stopping once playback starts is enough.
                void playPromise?.then(stop, () => undefined);
            }
        }

        void playPromise?.catch(ignorePlayError);

        return () => {
            cancelled = true;
            if (frameCallbackId) video.cancelVideoFrameCallback(frameCallbackId);
        };
    }, [video, paused]);
};
