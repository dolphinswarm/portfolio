// Projects from the old /code page, which split into XR & Games and Apps.
const LEGACY_CODE_SECTIONS = {
  "parkinsons-vr": "xr-games",
  vrchery: "xr-games",
  "ar-looper": "xr-games",
  "ninjas-vs-knights": "xr-games",
  "poets-shack-web-app": "apps",
  "the-ultimate-drum-machine": "apps",
  "r3f-portfolio": "apps",
};

// Projects cut from the old /visuals page.
const LEGACY_CUT_VISUALS = ["steampunk-mobile-fortress", "tri-delta-sundial"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // Old deep links were ?project=<slug>. Next passes the query through, so
    // these land on e.g. /installations/futerra?project=futerra; the page
    // ignores it and its canonical URL drops it.
    const projectQuery = (value) => [{ type: "query", key: "project", value }];

    return [
      // Contact info moved onto the About page.
      { source: "/connect", destination: "/about", permanent: true },
      // Legacy static-site URL still known to Google.
      { source: "/index.html", destination: "/", permanent: true },

      // Code and Visuals were reorganized into Installations, XR & Games, and Apps.
      ...Object.entries(LEGACY_CODE_SECTIONS).map(([slug, section]) => ({
        source: "/code",
        has: projectQuery(slug),
        destination: `/${section}/${slug}`,
        permanent: true,
      })),
      { source: "/code", destination: "/xr-games", permanent: true },
      ...LEGACY_CUT_VISUALS.map((slug) => ({
        source: "/visuals",
        has: projectQuery(slug),
        destination: "/installations",
        permanent: true,
      })),
      {
        source: "/visuals",
        has: projectQuery("(?<slug>.+)"),
        destination: "/installations/:slug",
        permanent: true,
      },
      { source: "/visuals", destination: "/installations", permanent: true },
      {
        source: "/music",
        has: projectQuery("(?<slug>.+)"),
        destination: "/music/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
