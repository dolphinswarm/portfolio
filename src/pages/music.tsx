import Head from "next/head";
import { Showcase, type ShowcaseItem } from "@/components/Showcase/Showcase";
import { useSceneVideo } from "@/context/SceneVideoContext";

const MUSIC_ITEMS: ShowcaseItem[] = [
	{
		slug: "ep-01",
		title: "EP 01",
		subtitle: "Ambient / texture",
		year: "2026",
		tags: ["Ambient", "Sound Design"],
		previewVideoSrc: "/branding/videos/demo-reel.mp4",
		links: [
			{ label: "Bandcamp", href: "https://example.com" },
			{ label: "Spotify", href: "https://example.com" },
		],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: (
			<>
				<p>
					For music, the “screen” can be cover art / looped visual.
					Details below can hold embeds later.
				</p>
				<p>
					This demo keeps it lightweight for mobile: browse with the
					strip, then read a short blurb.
				</p>
			</>
		),
	},
	{
		slug: "single-01",
		title: "Single 01",
		subtitle: "Percussive",
		year: "2025",
		tags: ["Percussion"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		links: [{ label: "Listen", href: "https://example.com" }],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>A punchy track with lots of transient detail.</p>,
	},
	{
		slug: "single-02",
		title: "Single 02",
		subtitle: "Drone",
		year: "2025",
		tags: ["Drone", "Analog"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		links: [{ label: "Listen", href: "https://example.com" }],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Slow movement, harmonic grit, and space.</p>,
	},
	{
		slug: "score-01",
		title: "Score 01",
		subtitle: "Short film",
		year: "2024",
		tags: ["Score", "Film"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		links: [{ label: "Credits", href: "https://example.com" }],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Minimal cues designed to support the edit.</p>,
	},
	{
		slug: "soundpack-01",
		title: "Sound Pack 01",
		subtitle: "Foley",
		year: "2024",
		tags: ["Foley"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		links: [{ label: "Download", href: "https://example.com" }],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Recorded and cut for quick drop-in use.</p>,
	},
	{
		slug: "live-set",
		title: "Live Set",
		subtitle: "Improvised",
		year: "2023",
		tags: ["Live"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		links: [{ label: "Watch", href: "https://example.com" }],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>A recorded set—highlights later become clips.</p>,
	},
	{
		slug: "collab-01",
		title: "Collab 01",
		subtitle: "Co-write",
		year: "2023",
		tags: ["Collab"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		links: [{ label: "Listen", href: "https://example.com" }],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Shared palette, quick iteration, fun results.</p>,
	},
	{
		slug: "remix-01",
		title: "Remix 01",
		subtitle: "Rework",
		year: "2022",
		tags: ["Remix"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		links: [{ label: "Listen", href: "https://example.com" }],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>A new arrangement built around different textures.</p>,
	},
	{
		slug: "library-cues",
		title: "Library Cues",
		subtitle: "Short cues",
		year: "2022",
		tags: ["Library"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		links: [{ label: "Playlist", href: "https://example.com" }],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Short cues optimized for cutting.</p>,
	},
	{
		slug: "older",
		title: "Older Work",
		subtitle: "Archive",
		year: "2021",
		tags: ["Archive"],
		previewVideoSrc: "/branding/videos/tv-static.mp4",
		links: [{ label: "More", href: "https://example.com" }],
		media: { kind: "video", src: "/branding/videos/tv-static.mp4" },
		body: <p>Early experiments and sketches.</p>,
	},
];

const Music = () => {
	const { setVideoSrcOverride } = useSceneVideo();

	return (
		<>
			<Head>
				<title>Music</title>
				<meta name="description" content="Music releases, scores, and sound design." />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Showcase
				pageTitle="Music"
				pageSubtitle="Detail-first on mobile: preview on the screen, then links + notes underneath."
				items={MUSIC_ITEMS}
				queryKey="music"
				onPreviewVideoSrcChange={(src) => setVideoSrcOverride(src)}
			/>
		</>
	);
};

export default Music;
