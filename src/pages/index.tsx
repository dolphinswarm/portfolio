import Link from "next/link";
import { SEO } from "@/components/SEO";
import {
    DEFAULT_OG_IMAGE,
    SITE_NAME,
    SITE_URL,
    SOCIAL_PROFILES,
} from "@/utils/site";
import styles from "@/styles/Home.module.scss";

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
            <section className={styles.hero} aria-labelledby="home-heading">
                <h1 id="home-heading" className={styles.heading}>
                    Creative technologist &amp; immersive experience designer
                </h1>
                <p className={styles.pitch}>
                    I build projection-mapped installations, XR, and
                    audio-reactive experiences that make light, sound, and space
                    feel alive. Based in Denver, CO.
                </p>
                <div className={styles.ctas}>
                    <Link href="/visuals" className={styles.primary}>
                        See my work
                    </Link>
                    <Link href="/connect" className={styles.secondary}>
                        Get in touch
                    </Link>
                </div>
            </section>
        </>
    );
};

export default Home;
