import Head from "next/head";
import { Showcase, type ShowcaseItem } from "@/components/Showcase/Showcase";
import { useSceneVideo } from "@/context/SceneVideoContext";

const CODE_ITEMS: ShowcaseItem[] = [
  {
    slug: "r3f-portfolio",
    title: "3D Portfolio",
    subtitle: "Next.js + R3F",
    year: "2026",
    tags: ["Next.js", "TypeScript", "Three.js"],
    previewVideoSrc: "/branding/videos/demo-reel.mp4",
    links: [
      { label: "GitHub", href: "https://github.com/" },
      { label: "Live", href: "https://example.com" },
    ],
    media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
    body: (
      <>
        <p>
          A responsive “screen-first” layout: big preview up top on
          mobile, split view on desktop.
        </p>
        <p>
          This card list is meant to be short (≈10 items) and fun to
          browse with your thumb.
        </p>
      </>
    ),
  },
  {
    slug: "api-tooling",
    title: "API Tooling",
    subtitle: "Fast DX utilities",
    year: "2025",
    tags: ["Node", "CLI", "Automation"],
    previewVideoSrc: "/branding/videos/tv-static.mp4",
    links: [{ label: "Docs", href: "https://example.com" }],
    media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
    body: (
      <>
        <p>
          Example detail text. Keep it short, then link out to the
          long-form writeup.
        </p>
      </>
    ),
  },
  {
    slug: "ui-system",
    title: "UI System",
    subtitle: "Components + tokens",
    year: "2025",
    tags: ["Design", "React"],
    previewVideoSrc: "/branding/videos/tv-static.mp4",
    links: [{ label: "Storybook", href: "https://example.com" }],
    media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
    body: <p>Reusable patterns, consistent spacing, and accessible UI.</p>,
  },
  {
    slug: "gameplay-prototype",
    title: "Gameplay Prototype",
    subtitle: "Web experiments",
    year: "2024",
    tags: ["Three.js", "Shaders"],
    previewVideoSrc: "/branding/videos/demo-reel.mp4",
    links: [{ label: "Demo", href: "https://example.com" }],
    media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
    body: <p>Small prototypes that explore interaction and motion.</p>,
  },
  {
    slug: "data-viz",
    title: "Data Viz",
    subtitle: "Readable, fast charts",
    year: "2024",
    tags: ["Visualization", "Performance"],
    previewVideoSrc: "/branding/videos/tv-static.mp4",
    links: [{ label: "Case Study", href: "https://example.com" }],
    media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
    body: <p>Focus on clarity first, animation second.</p>,
  },
  {
    slug: "audio-tools",
    title: "Audio Tools",
    subtitle: "Workflow helpers",
    year: "2024",
    tags: ["DSP", "Tooling"],
    previewVideoSrc: "/branding/videos/tv-static.mp4",
    links: [{ label: "Repo", href: "https://github.com/" }],
    media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
    body: <p>Utilities that make making things faster.</p>,
  },
  {
    slug: "cms-site",
    title: "CMS Site",
    subtitle: "Content-driven pages",
    year: "2023",
    tags: ["CMS", "SEO"],
    previewVideoSrc: "/branding/videos/tv-static.mp4",
    links: [{ label: "Live", href: "https://example.com" }],
    media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
    body: <p>A simple content model and tidy templates.</p>,
  },
  {
    slug: "perf-pass",
    title: "Performance Pass",
    subtitle: "Ship faster pages",
    year: "2023",
    tags: ["Perf", "Profiling"],
    previewVideoSrc: "/branding/videos/tv-static.mp4",
    links: [{ label: "Notes", href: "https://example.com" }],
    media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
    body: <p>Profiling, bundle trimming, and responsive images.</p>,
  },
  {
    slug: "auth-flows",
    title: "Auth Flows",
    subtitle: "Secure sign-in UX",
    year: "2023",
    tags: ["Security", "UX"],
    previewVideoSrc: "/branding/videos/tv-static.mp4",
    links: [{ label: "Overview", href: "https://example.com" }],
    media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
    body: <p>Clean login, password reset, and safe session handling.</p>,
  },
  {
    slug: "misc",
    title: "Small Experiments",
    subtitle: "One-off ideas",
    year: "2022",
    tags: ["Prototypes"],
    previewVideoSrc: "/branding/videos/tv-static.mp4",
    links: [{ label: "Links", href: "https://example.com" }],
    media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
    body: <p>Sometimes a weekend build is the best teacher.</p>,
  },
];

const Code = () => {
  const { setVideoSrcOverride } = useSceneVideo();

  return (
    <>
      <Head>
        <title>Code</title>
        <meta name="description" content="Code projects and experiments." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Showcase
        pageTitle="Code"
        pageSubtitle="Browse projects with the screen as the focus. On mobile, swipe the strip; on desktop, use the list."
        items={CODE_ITEMS}
        queryKey="code"
        onPreviewVideoSrcChange={(src) => setVideoSrcOverride(src)}
      />
    </>
  );
};

export default Code;
