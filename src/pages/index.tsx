import { SEO } from "@/components/SEO";
import {
    PERSON_DESCRIPTION,
    PERSON_JSON_LD,
    WEBSITE_JSON_LD,
} from "@/utils/structuredData";

const Home = () => {
    return (
        <>
            <SEO
                title="Brad Schmitz | Creative Technologist & Immersive Experience Designer"
                fullTitle
                description={PERSON_DESCRIPTION}
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
