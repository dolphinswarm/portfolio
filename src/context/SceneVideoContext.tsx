import React from "react";
import type { SceneMedia } from "@/utils/types";

type SceneVideoContextValue = {
    mediaOverride: SceneMedia | null;
    setMediaOverride: (media: SceneMedia | null) => void;
    clearMediaOverride: () => void;
};

const SceneVideoContext = React.createContext<SceneVideoContextValue | null>(null);

export const SceneVideoProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [mediaOverride, setMediaOverride] = React.useState<
        SceneMedia | null
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
