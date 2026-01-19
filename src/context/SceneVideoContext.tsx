import React from "react";

type SceneVideoContextValue = {
    videoSrcOverride: string | null;
    setVideoSrcOverride: (src: string | null) => void;
    clearVideoSrcOverride: () => void;
};

const SceneVideoContext = React.createContext<SceneVideoContextValue | null>(null);

export const SceneVideoProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [videoSrcOverride, setVideoSrcOverride] = React.useState<string | null>(
        null,
    );

    const clearVideoSrcOverride = React.useCallback(() => {
        setVideoSrcOverride(null);
    }, []);

    const value = React.useMemo<SceneVideoContextValue>(
        () => ({
            videoSrcOverride,
            setVideoSrcOverride,
            clearVideoSrcOverride,
        }),
        [videoSrcOverride, clearVideoSrcOverride],
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
