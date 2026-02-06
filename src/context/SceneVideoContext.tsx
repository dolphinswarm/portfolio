import React from "react";
import type { SceneMedia } from "@/utils/types";

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

    const clearMediaOverride = React.useCallback(() => {
        setMediaOverride(null);
    }, []);

    const clearScreenStyleOverride = React.useCallback(() => {
        setScreenStyleOverride(null);
    }, []);

    const value = React.useMemo<SceneVideoContextValue>(
        () => ({
            mediaOverride,
            setMediaOverride,
            clearMediaOverride,
            screenStyleOverride,
            setScreenStyleOverride,
            clearScreenStyleOverride,
        }),
        [
            mediaOverride,
            clearMediaOverride,
            screenStyleOverride,
            setScreenStyleOverride,
            clearScreenStyleOverride,
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
