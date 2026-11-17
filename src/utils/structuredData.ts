import {
    CONTACT_EMAIL,
    DEFAULT_OG_IMAGE,
    SITE_NAME,
    SITE_URL,
    SOCIAL_PROFILES,
} from "@/utils/site";

/** One-sentence bio shared by the homepage meta description and the Person schema. */
export const PERSON_DESCRIPTION =
    "Brad Schmitz is a Denver-based creative technologist, software engineer, and musician building projection-mapped installations, XR experiences, and audio-reactive visuals.";

/** Stable node IDs so every page's JSON-LD resolves to the same entities. */
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * schema.org Person for Brad. Search engines and AI answer engines use this
 * (especially `sameAs`) to tie the site and every profile to one identity.
 */
export const PERSON_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    alternateName: ["Bradley Schmitz", "dolphinswarm"],
    url: `${SITE_URL}/`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    email: `mailto:${CONTACT_EMAIL}`,
    jobTitle: ["Creative Technologist", "Software Engineer", "Musician"],
    description: PERSON_DESCRIPTION,
    address: {
        "@type": "PostalAddress",
        addressLocality: "Denver",
        addressRegion: "CO",
        addressCountry: "US",
    },
    alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Miami University",
        sameAs: "https://miamioh.edu/",
    },
    knowsAbout: [
        "Creative technology",
        "Projection mapping",
        "Immersive installations",
        "Interactive installations",
        "Virtual reality",
        "Augmented reality",
        "Creative coding",
        "Generative art",
        "Generative music",
        "Sound design",
        "Music composition",
        "Software engineering",
        "TouchDesigner",
        "Unreal Engine",
        "Unity",
        "Three.js",
        "React Three Fiber",
        "GLSL",
        "TypeScript",
        "React",
        "Next.js",
        "C#",
        "Ableton Live",
        "Max/MSP",
        "Saxophone",
    ],
    sameAs: SOCIAL_PROFILES,
};

export const WEBSITE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
};

/** schema.org ProfilePage for /about, with Brad as its main entity. */
export const PROFILE_PAGE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE_URL}/about`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: PERSON_JSON_LD,
};
