import * as React from "react";
import { SEO } from "@/components/SEO";
import {
    Showcase,
    type ShowcaseScreenMedia,
} from "@/components/Showcase/Showcase";
import { useSceneVideo } from "@/context/SceneVideoContext";
import { VISUAL_ITEMS } from "@/data/visuals";

const Visuals = () => {
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
                title="Projection Mapping & Immersive Installations"
                description="Projection mapping, immersive installations, and TouchDesigner and Unreal Engine visuals by Brad Schmitz, including FuTerra at BLINK 2024 and Night Lights Denver."
                path="/visuals"
            />
            <h1 className="visually-hidden">
                Projection mapping and immersive installations
            </h1>

            <Showcase
                pageTitle="Visuals"
                items={VISUAL_ITEMS}
                queryKey="project"
                onScreenMediaChange={onScreenMediaChange}
            />
        </>
    );
};

export default Visuals;
