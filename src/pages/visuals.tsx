import Head from "next/head";
import { Showcase, type ShowcaseItem } from "@/components/Showcase/Showcase";
import { useSceneVideo } from "@/context/SceneVideoContext";

const VISUAL_ITEMS: ShowcaseItem[] = [
	{
		slug: "demo-reel",
		title: "Demo Reel",
		subtitle: "Motion / edits",
		year: "2026",
		tags: ["Edit", "Motion"],
		previewVideoSrc: "/branding/videos/demo-reel.mp4",
		links: [{ label: "Download", href: "/branding/videos/demo-reel.mp4" }],
		media: { kind: "video", src: "/branding/videos/demo-reel.mp4" },
		body: (
			<>
				<p>
					This is a great fit for the “screen-first” presentation:
					visuals want big preview real estate.
				</p>
				<p>
					On mobile, you swipe the strip to switch pieces without
					scrolling a massive list.
				</p>
			</>
		),
	},
	{
		slug: "short-01",
		title: "Short Film 01",
		subtitle: "Lookdev",
		year: "2025",
		tags: ["Lookdev", "Lighting"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		links: [{ label: "Case Study", href: "https://example.com" }],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Replace this with a still/video and a quick note.</p>,
	},
	{
		slug: "short-02",
		title: "Short Film 02",
		subtitle: "Compositing",
		year: "2025",
		tags: ["Comp", "Color"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		links: [{ label: "Credits", href: "https://example.com" }],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Keep details light here; link out to the full breakdown.</p>,
	},
	{
		slug: "poster-series",
		title: "Poster Series",
		subtitle: "Print / typography",
		year: "2024",
		tags: ["Print", "Type"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>A set of posters exploring type and rhythm.</p>,
	},
	{
		slug: "shader-study",
		title: "Shader Study",
		subtitle: "Realtime",
		year: "2024",
		tags: ["GLSL", "Realtime"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Interactive material studies and lighting experiments.</p>,
	},
	{
		slug: "ui-motion",
		title: "UI Motion",
		subtitle: "Micro-interactions",
		year: "2023",
		tags: ["UX", "Animation"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Motion that clarifies state and feels snappy.</p>,
	},
	{
		slug: "title-cards",
		title: "Title Cards",
		subtitle: "Design system",
		year: "2023",
		tags: ["Brand", "System"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>A cohesive set of titles for a series.</p>,
	},
	{
		slug: "photo-set",
		title: "Photo Set",
		subtitle: "Selection",
		year: "2022",
		tags: ["Photo"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>A small photo selection with consistent grading.</p>,
	},
	{
		slug: "brand-studies",
		title: "Brand Studies",
		subtitle: "Explorations",
		year: "2022",
		tags: ["Brand"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Quick brand directions and visual language tests.</p>,
	},
	{
		slug: "misc-vis",
		title: "Misc Visuals",
		subtitle: "Bits and pieces",
		year: "2021",
		tags: ["Sketches"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Small studies that don’t need a full case study.</p>,
	},
];

const Visuals = () => {
	const { setVideoSrcOverride } = useSceneVideo();

	return (
		<>
			<Head>
				<title>Visuals</title>
				<meta
					name="description"
					content="Visual work: motion, lookdev, design studies."
				/>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Showcase
				pageTitle="Visuals"
				pageSubtitle="Big preview first. Swipe through pieces on mobile; use the list on desktop."
				items={VISUAL_ITEMS}
				queryKey="visual"
				onPreviewVideoSrcChange={(src) => setVideoSrcOverride(src)}
			/>
		</>
	);
};

export default Visuals;
