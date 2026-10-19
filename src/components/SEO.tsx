import Head from "next/head";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/utils/site";

type SeoProps = {
    /** Page title. Suffixed with the site name unless `fullTitle` is set. */
    title: string;
    description: string;
    /** Route path for the canonical URL, e.g. "/about". */
    path: string;
    /** Use `title` as-is instead of appending the site name. */
    fullTitle?: boolean;
    /** Share image path relative to the site root. */
    image?: string;
    noindex?: boolean;
    /** JSON-LD object(s) to embed on the page. */
    jsonLd?: object | object[];
};

/** Per-page title, description, canonical URL, and social share tags. */
export const SEO = ({
    title,
    description,
    path,
    fullTitle = false,
    image = DEFAULT_OG_IMAGE,
    noindex = false,
    jsonLd,
}: SeoProps) => {
    const pageTitle = fullTitle ? title : `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path === "/" ? "/" : path}`;
    const imageUrl = `${SITE_URL}${image}`;

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />
            {noindex ? <meta name="robots" content="noindex" /> : null}

            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={pageTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={pageTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />

            {jsonLd ? (
                <script
                    type="application/ld+json"
                    // JSON.stringify output is safe here: the data is static and authored in-repo.
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            ) : null}
        </Head>
    );
};
