import { SEO } from "@/components/SEO";
import {
    DEFAULT_OG_IMAGE,
    SITE_NAME,
    SITE_URL,
    SOCIAL_PROFILES,
} from "@/utils/site";

const DESCRIPTION =
    "Brad Schmitz is a Denver-based creative technologist building projection-mapped installations, XR experiences, and audio-reactive visuals.";

const PERSON_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_NAME,
    alternateName: "Bradley Schmitz",
    url: `${SITE_URL}/`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    jobTitle: "Creative Technologist",
    description: DESCRIPTION,
    address: {
        "@type": "PostalAddress",
        addressLocality: "Denver",
        addressRegion: "CO",
        addressCountry: "US",
    },
    alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Miami University",
    },
    knowsAbout: [
        "Creative technology",
        "Projection mapping",
        "Immersive installations",
        "Virtual reality",
        "Augmented reality",
        "Generative music",
        "TouchDesigner",
        "Unreal Engine",
        "Unity",
        "Three.js",
    ],
    sameAs: SOCIAL_PROFILES,
};

const WEBSITE_JSON_LD = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
};

const Home = () => {
    return (
        <>
            <SEO
                title="Brad Schmitz | Creative Technologist & Immersive Experience Designer"
                fullTitle
                description={DESCRIPTION}
                path="/"
                jsonLd={[PERSON_JSON_LD, WEBSITE_JSON_LD]}
            />
            <h1 className="visually-hidden">
                Brad Schmitz, creative technologist and immersive experience
                designer
            </h1>
        </>
    );
};

export default Home;
