import { Page } from "@/utils/consts";
import { SceneProps } from "@/utils/types";
import { useRouter } from "next/router";

/** The props for each page in the router. */
const routerPageProps: Record<Page, Omit<SceneProps, "isIndexRoute">> = {
    home: {
        videoSrc: "/branding/videos/demo-reel.mp4",
        shouldUseFreeCamera: true,
        shouldRender: true,
    },
    about: {
        videoSrc: "",
        shouldUseFreeCamera: false,
        shouldRender: false,
    },
    code: {
        videoSrc: "/branding/videos/tv-static.mp4",
        shouldUseFreeCamera: false,
        shouldRender: true,
    },
    visuals: {
        videoSrc: "/branding/videos/tv-static.mp4",
        shouldUseFreeCamera: false,
        shouldRender: true,
    },
    music: {
        videoSrc: "/branding/videos/tv-static.mp4",
        shouldUseFreeCamera: false,
        shouldRender: true,
    },
    connect: {
        videoSrc: "",
        shouldUseFreeCamera: false,
        shouldRender: true,
    },
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
            videoSrc: "",
            shouldUseFreeCamera: false,
            shouldRender: true,
        };

    return {
        ...base,
        isIndexRoute,
    } satisfies SceneProps;
};
