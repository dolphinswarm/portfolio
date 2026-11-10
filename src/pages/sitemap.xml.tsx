import type { GetServerSideProps } from "next";
import type { ShowcaseItem } from "@/components/Showcase/Showcase";
import { APPS_ITEMS } from "@/data/apps";
import { INSTALLATION_ITEMS } from "@/data/installations";
import { MUSIC_ITEMS } from "@/data/music";
import { SECTIONS, SECTION_ORDER, type SectionId } from "@/data/sections";
import { XR_GAMES_ITEMS } from "@/data/xr-games";
import { SITE_URL } from "@/utils/site";

const SECTION_ITEMS: Record<SectionId, ShowcaseItem[]> = {
    installations: INSTALLATION_ITEMS,
    "xr-games": XR_GAMES_ITEMS,
    apps: APPS_ITEMS,
    music: MUSIC_ITEMS,
};

/** Generated from the project data so every project page is listed. */
const buildSitemap = () => {
    const paths = [
        "/",
        "/about",
        ...SECTION_ORDER.flatMap((id) => {
            const { path } = SECTIONS[id];
            return [
                path,
                ...SECTION_ITEMS[id].map((item) => `${path}/${item.slug}`),
            ];
        }),
    ];

    const urls = paths
        .map((path) => `    <url>\n        <loc>${SITE_URL}${path}</loc>\n    </url>`)
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
    res.setHeader("Content-Type", "application/xml");
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=86400, stale-while-revalidate=604800",
    );
    res.write(buildSitemap());
    res.end();
    return { props: {} };
};

const Sitemap = () => null;

export default Sitemap;
