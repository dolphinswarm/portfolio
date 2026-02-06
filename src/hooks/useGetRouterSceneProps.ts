import { Page } from "@/utils/consts";
import { SceneProps } from "@/utils/types";
import { useRouter } from "next/router";

/** The props for each page in the router. */
const routerPageProps: Record<Page, Omit<SceneProps, "isIndexRoute">> = {
    home: {
        media: {
            sourceType: "video",
            source: "/branding/videos/demo-reel.mp4",
        },
        backgroundVariant: "default",
        shouldUseFreeCamera: true,
        shouldRender: true,
        shouldShowBrad: true,
    },
    about: {
        media: undefined,
        backgroundVariant: "about",
        shouldUseFreeCamera: false,
        shouldRender: true,
        shouldShowBrad: true,
    },
    code: {
        media: undefined,
        backgroundVariant: "default",
        shouldUseFreeCamera: false,
        shouldRender: true,
        shouldShowBrad: false,
    },
    visuals: {
        media: undefined,
        backgroundVariant: "default",
        shouldUseFreeCamera: false,
        shouldRender: true,
        shouldShowBrad: false,
    },
    music: {
        media: undefined,
        backgroundVariant: "music",
        shouldUseFreeCamera: false,
        shouldRender: true,
        shouldShowBrad: false,
    },
    connect: {
        media: undefined,
        backgroundVariant: "connect",
        shouldUseFreeCamera: false,
        shouldRender: true,
        shouldShowBrad: true,
    },
    bork: {
        media: {
            sourceType: "video",
            source: "/branding/videos/visuals/2001-a-doge-odyssey.mp4",
            audio: { enabled: true, volume: 1 },
        },
        backgroundVariant: "default",
        shouldUseFreeCamera: false,
        shouldRender: true,
        shouldShowBrad: false,
    },
};

/** Get the props for the current router scene. */
export const useGetRouterSceneProps = () => {
    const { pathname } = useRouter();
    const isIndexRoute = pathname === "/";
    const pageName = (pathname === "/" ? "/home" : pathname).replace(
        "/",
        "",
    ) as Page;

    const base = routerPageProps[pageName] ?? {
        media: undefined,
        backgroundVariant: "default",
        shouldUseFreeCamera: false,
        shouldRender: true,
        shouldShowBrad: false,
    };

    return {
        ...base,
        isIndexRoute,
    } satisfies SceneProps;
};
