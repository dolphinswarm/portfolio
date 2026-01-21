import * as React from "react";
import Head from "next/head";
import { Showcase, type ShowcaseItem } from "@/components/Showcase/Showcase";
import { useSceneVideo } from "@/context/SceneVideoContext";
import Link from "next/link";
import { faBook, faClapperboard, faFilm } from "@fortawesome/free-solid-svg-icons";

const VISUAL_ITEMS: ShowcaseItem[] = [
	{
		slug: "futerra",
		title: "FuTerra | I Was The Earth",
		subtitle: "Installation at BLINK 2024 by &FRIENDS Studio",
		year: "2024",
		tags: ["Unreal Engine", "Installation", "Projection Mapping", "Generative Music"],
		links: [{ label: "View Full Video", href: "https://drive.google.com/file/d/1qEKORAOorDiQXzrEezOVH6YbbtHf3Fug/view?usp=sharing", icon: faFilm, openInNewWindow: true }],
		screenSource: { kind: "video", src: "/branding/videos/visuals/futerra-abridged.mp4" },
		thumbnailSource: { kind: "image", src: "/branding/img/visuals/futerra-2.jpg" },
		body: (
			<>
				<p>
					<b>FuTerra | I Was The Earth</b> is an immersive projection experience, which was presented at BLINK 2024 in Cincinnati, Ohio. It explores themes of community, urbanity, nature, humanity, and technology. It offers a glimpse of a future city where these themes harmoniously intertwine, representing the city's strength. Rooted in a vision informed by the past and present, the duality and contrast of synthetic and organic have been retired. People are together as active participants in nature, not champions of its improvement.
				</p>
				<p>
					This installation was made as part of a collaborative effort from the various members of <a href="https://www.and-friends.studio/">&FRIENDS Studio</a>. My role in this project was music director and a technical artist, where I created a generative music system to "infinitely" play with the installation (more details can be found on the  <Link href="music?project=futerra-music-generator">music page</Link>). I also helped with projection mapping, media server programming, Unreal engine scene development, and overall technical direction.
				</p>
			</>
		),
	},
	{
		slug: "shack-video",
		title: "Shack Video",
		subtitle: "Gathering at the Poet's Shack Installation @ Miami University",
		year: "2020",
		tags: ["TouchDesigner", "Projection Mapping"],
		links: [{ label: "Read More", href: "https://miamioh.edu/cca/news/2020/12/poet-shack-2020.html", icon: faBook, openInNewWindow: true }, {
			label: "View Full Video",
			href: "https://www.youtube.com/watch?v=N0Ppc25ImIY",
			icon: faFilm,
			openInNewWindow: true
		}],
		screenSource: {
			primary: {
				kind: "video",
				src: "/branding/videos/visuals/poet-shack-2.mp4",
				label: "Shack Video",
				icon: faFilm,
			},
			secondary: {
				kind: "video",
				src: "/branding/videos/visuals/poet-shack-1.mp4",
				label: "Installation",
				icon: faClapperboard,
			},
		},
		thumbnailSource: { kind: "image", src: "/branding/img/visuals/gathering-at-the-poets-shack-overview.jpg" },
		body: (
			<>
				<p>
					<b>Gathering at the Poet's Shack</b> was an interactive projection installation created for Miami University's annual ArtsFest in 2020. The installation invited participants to explore a virtual environment projected onto the walls of the Shriver Center, responding to their movements and interactions.
				</p>
			</>
		),
	},	{
		slug: "poem-visualizer",
		title: "Poem Visualizer",
		subtitle: "Gathering at the Poet's Shack Installation @ Miami University",
		year: "2020",
		tags: ["TouchDesigner", "Projection Mapping"],
		links: [{ label: "Read More", href: "https://miamioh.edu/cca/news/2020/12/poet-shack-2020.html", icon: faBook, openInNewWindow: true }],
		screenSource: {
			primary: {
				kind: "video",
				src: "/branding/videos/visuals/poem-visualizer.mp4",
			},
		},
		thumbnailSource: { kind: "image", src: "/branding/img/visuals/poem-visualizer.png" },
		body: (
			<>
				<p>
					<b>Poem Visualizer</b> was an interactive projection installation created for Miami University's annual ArtsFest in 2020. The installation invited participants to explore a virtual environment projected onto the walls of the Shriver Center, responding to their movements and interactions.
				</p>
			</>
		),
	},{
		slug: "upham-arch-interactive-projection",
		title: "Upham Arch Interactive Projection",
		subtitle: "Gathering at the Poet's Shack Installation @ Miami University",
		year: "2020",
		tags: ["TouchDesigner", "Projection Mapping"],
		links: [{ label: "Read More", href: "https://miamioh.edu/cca/news/2020/12/poet-shack-2020.html", icon: faBook, openInNewWindow: true }],
		screenSource: {
			primary: {
				kind: "video",
				src: "/branding/videos/visuals/upham-arch.mp4",
			},
		},
		thumbnailSource: { kind: "image", src: "/branding/img/visuals/upham-arch.png" },
		body: (
			<>
				<p>
					<b>Upham Arch Interactive Projection</b> was an interactive projection installation created for Miami University's annual ArtsFest in 2020. The installation invited participants to explore a virtual environment projected onto the walls of the Shriver Center, responding to their movements and interactions.
				</p>
			</>
		),
	},{
		slug: "trojan-horse-projection-music-video",
		title: "Trojan Horse - Projection Music Video",
		subtitle: "Final Project for IMS 431 @ Miami University",
		year: "2020",
		tags: ["TouchDesigner", "Projection Mapping"],
		links: [{ label: "View Full Video", href: "https://drive.google.com/file/d/1OAdW4G2iH4rpxxWUaIxJ7Km5nylGFI3G/view?usp=sharing", icon: faFilm, openInNewWindow: true }],
		screenSource: {
			primary: {
				kind: "video",
				src: "/branding/videos/visuals/trojan-horse-abridged.mp4",
			},
		},
		thumbnailSource: { kind: "image", src: "/branding/img/visuals/trojan-horse.png" },
		body: (
			<>
				<p>
					<b>Trojan Horse - Projection Music Video</b> was an interactive projection installation created for Miami University's annual ArtsFest in 2020. The installation invited participants to explore a virtual environment projected onto the walls of the Shriver Center, responding to their movements and interactions.
				</p>
			</>
		),
	},{
		slug: "fort-knox-touchdesigner-music-video",
		title: "Fort Knox - TouchDesigner Music Video",
		subtitle: "Project for IMS 431 @ Miami University",
		year: "2020",
		tags: ["TouchDesigner", "Projection Mapping"],
		links: [{ label: "View Full Video", href: "https://drive.google.com/file/d/1OAdW4G2iH4rpxxWUaIxJ7Km5nylGFI3G/view?usp=sharing", icon: faFilm, openInNewWindow: true }],
		screenSource: {
			primary: {
				kind: "video",
				src: "/branding/videos/visuals/fort-knox.mp4",
			},
		},
		thumbnailSource: { kind: "image", src: "/branding/img/visuals/fort-knox.png" },
		body: (
			<>
				<p>
					<b>Fort Knox - TouchDesigner Music Video</b> was an interactive projection installation created for Miami University's annual ArtsFest in 2020. The installation invited participants to explore a virtual environment projected onto the walls of the Shriver Center, responding to their movements and interactions.
				</p>
			</>
		),
	},{
		slug: "letters-from-the-ocean",
		title: "Letters from the Ocean",
		subtitle: "Projection for a Production @ Miami University",
		year: "2020",
		tags: ["TouchDesigner", "Projection Mapping"],
		links: [{ label: "Read More", href: "https://sites.miamioh.edu/mother-earths-gallery-of-broken-things/letter-from-the-ocean/", icon: faBook, openInNewWindow: true }],
		screenSource: {
			primary: {
				kind: "video",
				src: "/branding/videos/visuals/letters-from-the-ocean.mp4",
			},
		},
		thumbnailSource: { kind: "image", src: "/branding/img/visuals/letters-from-the-ocean.jpg" },
		body: (
			<>
				<p>
					<b>Fort Knox - TouchDesigner Music Video</b> was an interactive projection installation created for Miami University's annual ArtsFest in 2020. The installation invited participants to explore a virtual environment projected onto the walls of the Shriver Center, responding to their movements and interactions.
				</p>
			</>
		),
	},{
		slug: "steampunk-mobile-fortress",
		title: "Steampunk Mobile Fortress",
		subtitle: "Final Project for IMS 319 @ Miami University",
		year: "2020",
		tags: ["TouchDesigner", "Projection Mapping"],
		links: [{ label: "Read More", href: "https://sites.miamioh.edu/mother-earths-gallery-of-broken-things/letter-from-the-ocean/", icon: faBook, openInNewWindow: true }],
		screenSource: {
			primary: {
				kind: "video",
				src: "/branding/videos/visuals/steampunk-fort.mp4",
			},
		},
		thumbnailSource: { kind: "image", src: "/branding/img/visuals/steampunk-fort.png" },
		body: (
			<>
				<p>
					<b>Fort Knox - TouchDesigner Music Video</b> was an interactive projection installation created for Miami University's annual ArtsFest in 2020. The installation invited participants to explore a virtual environment projected onto the walls of the Shriver Center, responding to their movements and interactions.
				</p>
			</>
		),
	},
];

const Visuals = () => {
	const { setMediaOverride, clearMediaOverride } = useSceneVideo();

	const onScreenMediaChange = React.useCallback(
		(media: { sourceType: "video" | "image"; source: string } | null) => {
			setMediaOverride(media);
		},
		[setMediaOverride],
	);

	React.useEffect(() => {
		return () => {
			clearMediaOverride();
		};
	}, [clearMediaOverride]);

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
				items={VISUAL_ITEMS}
				queryKey="project"
				onScreenMediaChange={onScreenMediaChange}
			/>
		</>
	);
};

export default Visuals;
