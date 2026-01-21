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

/** The props for the 3D scene. */
export type SceneProps = {
    media?: SceneMedia;
    shouldUseFreeCamera: boolean;
    shouldRender: boolean;
    isIndexRoute: boolean;
};
