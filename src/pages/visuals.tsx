import * as React from "react";
import Head from "next/head";
import { Showcase, type ShowcaseItem } from "@/components/Showcase/Showcase";
import { useSceneVideo } from "@/context/SceneVideoContext";
import Link from "next/link";

const VISUAL_ITEMS: ShowcaseItem[] = [
	{
		slug: "futerra",
		title: "FuTerra | I Was The Earth",
		subtitle: "Installation at BLINK 2024",
		year: "2026",
		tags: ["Edit", "Motion"],
		links: [{ label: "Download", href: "/branding/videos/futerra.mp4" }],
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
