import { Page } from "@/utils/consts";
import { SceneProps } from "@/utils/types";
import { useRouter } from "next/router";

/** The props for each page in the router. */
const routerPageProps: Record<Page, Omit<SceneProps, "isIndexRoute">> = {
    home: {
        media: { sourceType: "video", source: "/branding/videos/demo-reel.mp4" },
        shouldUseFreeCamera: true,
        shouldRender: true,
    },
    about: {
        media: undefined,
        shouldUseFreeCamera: false,
        shouldRender: true,
    },
    code: {
        media: undefined,
        shouldUseFreeCamera: false,
        shouldRender: true,
    },
    visuals: {
        media: undefined,
        shouldUseFreeCamera: false,
        shouldRender: true,
    },
    music: {
        media: undefined,
        shouldUseFreeCamera: false,
        shouldRender: true,
    },
    connect: {
        media: undefined,
        shouldUseFreeCamera: false,
        shouldRender: true,
    },
    bork: {
        media: {
            sourceType: "video",
            source: "/branding/videos/visuals/2001-a-doge-odyssey.mp4",
            audio: { enabled: true, volume: 1 },
        },
        shouldUseFreeCamera: false,
        shouldRender: true,
    }
};

/** Get the props for the current router scene. */
export const useGetRouterSceneProps = () => {
    const { pathname } = useRouter();
    const isIndexRoute = pathname === "/";
    const pageName = (pathname === "/" ? "/home" : pathname).replace(
        "/",
        ""
    ) as Page;

    const base =
        routerPageProps[pageName] ??
        {
            media: undefined,
            shouldUseFreeCamera: false,
            shouldRender: true,
        };

    return {
        ...base,
        isIndexRoute,
    } satisfies SceneProps;
};
