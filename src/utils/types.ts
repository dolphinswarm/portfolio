export type SceneMedia = {
    sourceType: "video" | "image";
    source: string;
    /** Optional audio controls when the sourceType is "video". */
    audio?: {
        enabled: boolean;
        /** 0..1; defaults to 1 when enabled. */
        volume?: number;
    };
};

export type SceneBackgroundVariant = "default" | "about" | "connect" | "music";

/** The props for the 3D scene. */
export type SceneProps = {
    media?: SceneMedia;
    /** Route-specific look for the 3D background (procedural vs media). */
    backgroundVariant?: SceneBackgroundVariant;
    shouldUseFreeCamera: boolean;
    shouldRender: boolean;
    isIndexRoute: boolean;
    /** Whether Brad should be visible on this route. */
    shouldShowBrad: boolean;
};
