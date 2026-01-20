import React from "react";

type SceneVideoContextValue = {
    mediaOverride: { sourceType: "video" | "image"; source: string } | null;
    setMediaOverride: (media: { sourceType: "video" | "image"; source: string } | null) => void;
    clearMediaOverride: () => void;
};

const SceneVideoContext = React.createContext<SceneVideoContextValue | null>(null);

export const SceneVideoProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [mediaOverride, setMediaOverride] = React.useState<
        { sourceType: "video" | "image"; source: string } | null
    >(null);

    const clearMediaOverride = React.useCallback(() => {
        setMediaOverride(null);
    }, []);

    const value = React.useMemo<SceneVideoContextValue>(
        () => ({
            mediaOverride,
            setMediaOverride,
            clearMediaOverride,
        }),
        [mediaOverride, clearMediaOverride],
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
