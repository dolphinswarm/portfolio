/** The props for the 3D scene. */
export type SceneProps = {
    media?: {
        sourceType: "video" | "image";
        source: string;
    };
    shouldUseFreeCamera: boolean;
    shouldRender: boolean;
    isIndexRoute: boolean;
};
