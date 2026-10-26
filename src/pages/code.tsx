import * as React from "react";
import { SEO } from "@/components/SEO";
import {
    Showcase,
    type ShowcaseScreenMedia,
} from "@/components/Showcase/Showcase";
import { useSceneVideo } from "@/context/SceneVideoContext";
import { CODE_ITEMS } from "@/data/code";

const Code = () => {
    const { setMediaOverride, clearMediaOverride } = useSceneVideo();

    const onScreenMediaChange = React.useCallback(
        (media: ShowcaseScreenMedia | null) => {
            setMediaOverride(media);
        },
        [setMediaOverride],
    );

    React.useEffect(() => {
        return () => {
            clearMediaOverride();
        };
    }, [clearMediaOverride]);

    return (
        <>
            <SEO
                title="Code & XR Projects"
                description="VR, AR, game, and web audio projects by Brad Schmitz, built with Unity, C#, React, TypeScript, Three.js, and Tone.js."
                path="/code"
            />
            <h1 className="visually-hidden">Code and XR projects</h1>
            <Showcase
                pageTitle="Code"
                items={CODE_ITEMS}
                queryKey="project"
                onScreenMediaChange={onScreenMediaChange}
            />
        </>
    );
};

export default Code;
