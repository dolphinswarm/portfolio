import React from "react";
import type { SceneMedia } from "@/utils/types";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export type MusicScreenStyle = {
    /** Primary bar color (hex or any CSS color supported by THREE.Color). */
    colorA?: string;
    /** Secondary/gradient bar color; if omitted, defaults to colorA or variant default. */
    colorB?: string;
    /** Base/background screen color for the music shader. */
    base?: string;
};

export type ScreenStyleOverride = {
    music?: MusicScreenStyle;
};

type SceneVideoContextValue = {
    mediaOverride: SceneMedia | null;
    setMediaOverride: (media: SceneMedia | null) => void;
    clearMediaOverride: () => void;
    screenStyleOverride: ScreenStyleOverride | null;
    setScreenStyleOverride: (style: ScreenStyleOverride | null) => void;
    clearScreenStyleOverride: () => void;
    /**
     * Whether scene videos should be paused on a still frame. Unless the
     * visitor has pressed play or pause, that's when they prefer reduced
     * motion, except for a video with its sound on (sound is something they
     * chose to hear, and a still frame can't carry it).
     */
    isVideoPaused: (audioEnabled: boolean) => boolean;
    /** Records the visitor's own play/pause choice for the rest of the visit. */
    setVideoPaused: (paused: boolean) => void;
};

const SceneVideoContext = React.createContext<SceneVideoContextValue | null>(
    null,
);

export const SceneVideoProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [mediaOverride, setMediaOverride] = React.useState<SceneMedia | null>(
        null,
    );
    const [screenStyleOverride, setScreenStyleOverride] =
        React.useState<ScreenStyleOverride | null>(null);
    const [videoPausedChoice, setVideoPausedChoice] = React.useState<
        boolean | null
    >(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    const clearMediaOverride = React.useCallback(() => {
        setMediaOverride(null);
    }, []);

    const clearScreenStyleOverride = React.useCallback(() => {
        setScreenStyleOverride(null);
    }, []);

    const isVideoPaused = React.useCallback(
        (audioEnabled: boolean) =>
            videoPausedChoice ?? (prefersReducedMotion && !audioEnabled),
        [videoPausedChoice, prefersReducedMotion],
    );

    const value = React.useMemo<SceneVideoContextValue>(
        () => ({
            mediaOverride,
            setMediaOverride,
            clearMediaOverride,
            screenStyleOverride,
            setScreenStyleOverride,
            clearScreenStyleOverride,
            isVideoPaused,
            setVideoPaused: setVideoPausedChoice,
        }),
        [
            mediaOverride,
            clearMediaOverride,
            screenStyleOverride,
            setScreenStyleOverride,
            clearScreenStyleOverride,
            isVideoPaused,
        ],
    );

    return (
        <SceneVideoContext.Provider value={value}>
            {children}
        </SceneVideoContext.Provider>
    );
};

export const useSceneVideo = () => {
    const ctx = React.useContext(SceneVideoContext);
    if (!ctx) {
        throw new Error("useSceneVideo must be used within SceneVideoProvider");
    }
    return ctx;
};
