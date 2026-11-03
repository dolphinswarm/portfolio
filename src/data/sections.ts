/** The project sections in the nav. Each one is a Showcase page at `path`, with a page per project at `path/slug`. */
export type SectionId = "installations" | "xr-games" | "apps" | "music";

export type Section = {
    id: SectionId;
    path: string;
    /** Nav label and Showcase page title. */
    label: string;
    /** Visually hidden <h1> for the section page. */
    heading: string;
    /** SEO title and description for the section page itself. */
    seoTitle: string;
    seoDescription: string;
};

export const SECTIONS: Record<SectionId, Section> = {
    installations: {
        id: "installations",
        path: "/installations",
        label: "Installations",
        heading: "Projection mapping and immersive installations",
        seoTitle: "Projection Mapping & Immersive Installations",
        seoDescription:
            "Projection mapping, immersive installations, and TouchDesigner and Unreal Engine visuals by Brad Schmitz, including FuTerra at BLINK 2024 and Night Lights Denver.",
    },
    "xr-games": {
        id: "xr-games",
        path: "/xr-games",
        label: "XR & Games",
        heading: "XR and game projects",
        seoTitle: "VR, AR & Game Projects",
        seoDescription:
            "Virtual reality, augmented reality, and game projects by Brad Schmitz, built with Godot, Unity, C#, and OpenXR.",
    },
    apps: {
        id: "apps",
        path: "/apps",
        label: "Apps",
        heading: "Apps and web projects",
        seoTitle: "Web & Audio Apps",
        seoDescription:
            "Web apps and creative tools by Brad Schmitz, built with React, TypeScript, Next.js, Three.js, and Tone.js.",
    },
    music: {
        id: "music",
        path: "/music",
        label: "Music",
        heading: "Music and generative sound",
        seoTitle: "Music & Generative Sound",
        seoDescription:
            "Generative installation music, orchestral and chamber compositions, saxophone performance, and indie folk as dolphinswarm, by Brad Schmitz.",
    },
};

/** Section pages in nav order. */
export const SECTION_ORDER: SectionId[] = [
    "installations",
    "xr-games",
    "apps",
    "music",
];
