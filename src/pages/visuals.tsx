import * as React from "react";
import Head from "next/head";
import {
    Showcase,
    type ShowcaseItem,
    type ShowcaseScreenMedia,
} from "@/components/Showcase/Showcase";
import { useSceneVideo } from "@/context/SceneVideoContext";
import Link from "next/link";
import {
    faArrowUpRightFromSquare,
    faBook,
    faClapperboard,
    faFilm,
} from "@fortawesome/free-solid-svg-icons";

const VISUAL_ITEMS: ShowcaseItem[] = [
    {
        slug: "futerra",
        title: "FuTerra | I Was The Earth",
        subtitle: "Installation at BLINK 2024 by &FRIENDS Studio",
        year: "2024",
        tags: [
            "Unreal Engine",
            "Installation",
            "Projection Mapping",
            "Generative Music",
        ],
        links: [
            {
                label: "View Full Video",
                href: "https://drive.google.com/file/d/1qEKORAOorDiQXzrEezOVH6YbbtHf3Fug/view?usp=sharing",
                icon: faFilm,
                openInNewWindow: true,
            },
        ],
        screenSource: {
            kind: "video",
            src: "/branding/videos/visuals/futerra-abridged.mp4",
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/futerra-2.jpg",
        },
        body: (
            <>
                <p>
                    <em>FuTerra | I Was The Earth</em> is an immersive
                    projection experience, which was presented at BLINK 2024 in
                    Cincinnati, Ohio. It explores themes of community, urbanity,
                    nature, humanity, and technology. It offers a glimpse of a
                    future city where these themes harmoniously intertwine,
                    representing the city's strength. Rooted in a vision
                    informed by the past and present, the duality and contrast
                    of synthetic and organic have been retired. People are
                    together as active participants in nature, not champions of
                    its improvement.
                </p>
                <p>
                    This installation was made as part of a collaborative effort
                    from the various members of{" "}
                    <a href="https://www.and-friends.studio/">
                        &FRIENDS Studio
                    </a>
                    . My role in this project was music director and a technical
                    artist, where I created a generative music system to
                    "infinitely" play with the installation (more details can be
                    found on the{" "}
                    <Link href="music?project=futerra">music page</Link>
                    ). I also helped with projection mapping, media server
                    programming, Unreal engine scene development, and overall
                    technical direction.
                </p>
            </>
        ),
    },
    {
        slug: "denver-night-lights",
        title: "Denver Night Lights", // TODO update actual name
        subtitle: "Art for Denver clock tower by &FRIENDS Studio",
        year: "2026",
        tags: ["Installation", "Projection Mapping"],
        screenSource: {
            kind: "video",
            src: "/branding/videos/visuals/denver-night-lights.mp4",
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/denver-night-lights.png",
        },
        body: (
            <>
                <p>
                    <em>Denver Night Lights</em> is an upcoming projection art
                    piece, set to premiere in April 2026 as part of Downtown
                    Denver's clock tower projection series called{" "}
                    <a
                        href="https://www.denvertheatredistrict.com/night-lights-denver"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Night Lights Denver
                    </a>
                    . The piece will be projected onto the iconic Daniels &
                    Fisher Tower, a historic landmark in the heart of Denver.
                    The piece displays various imaginative scenes, each of which
                    convey themes of community, discovery, and connection with
                    self, others, nature, and more.
                </p>
                <p>
                    This artwork was made as part of a collaborative effort from
                    the various members of{" "}
                    <a href="https://www.and-friends.studio/">
                        &FRIENDS Studio
                    </a>
                    . For this project, I served as producer, communicating with
                    the team and client to ensure smooth progress and delivery.
                    I also composed a short musical piece to accompany the
                    visuals.
                </p>
            </>
        ),
    },
    {
        slug: "shack-video",
        title: "Shack Video",
        subtitle:
            "Gathering at the Poet's Shack Installation @ Miami University",
        year: "2020",
        tags: ["TouchDesigner", "Projection Mapping"],
        links: [
            {
                label: "Read More",
                href: "https://miamioh.edu/cca/news/2020/12/poet-shack-2020.html",
                icon: faBook,
                openInNewWindow: true,
            },
            {
                label: "View Full Video",
                href: "https://www.youtube.com/watch?v=N0Ppc25ImIY",
                icon: faFilm,
                openInNewWindow: true,
            },
        ],
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
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/gathering-at-the-poets-shack-overview.jpg",
        },
        body: (
            <>
                <p>
                    The <em>Gathering at the Poet's Shack</em> was an immersive
                    interactive installation held at Miami University's campus
                    in Bishop Woods on November 16th, 2020. The installation was
                    a capstone project for the Interactive Media Studies
                    program, and was created by a team of students in
                    collaboration with faculty and other departments.
                </p>
                <p>
                    The centerpiece was the <em>Shack Video</em>, which was
                    projected onto a 10-foot high screen in the shape of a
                    rustic shack. The video featured a series of narrated poems,
                    accompanied by visuals created by IMS students and a
                    soundtrack composed by me.
                </p>
            </>
        ),
    },
    {
        slug: "poem-visualizer",
        title: "Poem Visualizer",
        subtitle:
            "Gathering at the Poet's Shack Installation @ Miami University",
        year: "2020",
        tags: ["TouchDesigner", "Projection Mapping", "ExpressJS", "AWS"],
        links: [
            {
                label: "Read More",
                href: "https://miamioh.edu/cca/news/2020/12/poet-shack-2020.html",
                icon: faBook,
                openInNewWindow: true,
            },
        ],
        screenSource: {
            primary: {
                kind: "video",
                src: "/branding/videos/visuals/poem-visualizer.mp4",
            },
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/poem-visualizer.png",
        },
        body: (
            <>
                <p>
                    The <em>Gathering at the Poet's Shack</em> was an immersive
                    interactive installation held at Miami University's campus
                    in Bishop Woods on November 16th, 2020. The installation was
                    a capstone project for the Interactive Media Studies
                    program, and was created by a team of students in
                    collaboration with faculty and other departments.
                </p>
                <p>
                    The <em>Poem Visualizer</em> was an accompanying projection
                    piece, which displayed live poetry entered into the Poet's
                    Shack web app by visitors. The visualizer responded to the
                    text input with visuals that complemented the themes and
                    emotions of the poems being shared, utilizing AI to decipher
                    the mood and tone of the text. Additionally, the visualizer
                    also filtered out any inappropriate content to maintain a
                    respectful and inclusive environment for all participants.
                </p>
            </>
        ),
    },
    {
        slug: "upham-arch-interactive-projection",
        title: "Upham Arch Interactive Projection",
        subtitle:
            "Gathering at the Poet's Shack Installation @ Miami University",
        year: "2020",
        tags: ["TouchDesigner", "Projection Mapping", "Kinect Azure"],
        links: [
            {
                label: "Read More",
                href: "https://miamioh.edu/cca/news/2020/12/poet-shack-2020.html",
                icon: faBook,
                openInNewWindow: true,
            },
        ],
        screenSource: {
            primary: {
                kind: "video",
                src: "/branding/videos/visuals/upham-arch.mp4",
            },
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/upham-arch.png",
        },
        body: (
            <>
                <p>
                    The <em>Gathering at the Poet's Shack</em> was an immersive
                    interactive installation held at Miami University's campus
                    in Bishop Woods on November 16th, 2020. The installation was
                    a capstone project for the Interactive Media Studies
                    program, and was created by a team of students in
                    collaboration with faculty and other departments.
                </p>
                <p>
                    The <em>Upham Arch Interactive Projection</em> was an
                    accompanying projection piece, which transformed the
                    historic Upham Arch on Miami University's campus into a
                    starfield that responded to the movement of visitors. Using
                    a Kinect Azure, the projection was able to detect the
                    presence and motion of people near the arch, and adjusted
                    the starfield accordingly to follow their shape and
                    movement.
                </p>
            </>
        ),
    },
    {
        slug: "trojan-horse-projection-music-video",
        title: "Trojan Horse - Projection Music Video",
        subtitle: "Final Project for IMS 431 @ Miami University",
        year: "2020",
        tags: ["TouchDesigner", "Projection Mapping"],
        links: [
            {
                label: "View Full Video",
                href: "https://drive.google.com/file/d/1OAdW4G2iH4rpxxWUaIxJ7Km5nylGFI3G/view?usp=sharing",
                icon: faFilm,
                openInNewWindow: true,
            },
        ],
        screenSource: {
            primary: {
                kind: "video",
                src: "/branding/videos/visuals/trojan-horse-abridged.mp4",
            },
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/trojan-horse.png",
        },
        body: (
            <>
                <p>
                    <em>Trojan Horse - Projection Music Video</em> was a
                    projection installation and music video created for the
                    final project in IMS 431 at Miami University. The piece
                    accompanies the song <em>TROJAN HORSE</em> by Sebastian
                    Paul, and was projected onto the back of Kumler Chapel on
                    Miami University's campus.
                </p>
            </>
        ),
    },
    {
        slug: "fort-knox-touchdesigner-music-video",
        title: "Fort Knox - TouchDesigner Music Video",
        subtitle: "Project for IMS 431 @ Miami University",
        year: "2020",
        tags: ["TouchDesigner"],
        links: [
            {
                label: "View Full Video",
                href: "https://drive.google.com/file/d/1OAdW4G2iH4rpxxWUaIxJ7Km5nylGFI3G/view?usp=sharing",
                icon: faFilm,
                openInNewWindow: true,
            },
        ],
        screenSource: {
            primary: {
                kind: "video",
                src: "/branding/videos/visuals/fort-knox.mp4",
                audio: { toggleable: true, defaultEnabled: false, volume: 1 },
            },
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/fort-knox.png",
        },
        body: (
            <>
                <p>
                    <em>Fort Knox - TouchDesigner Music Video</em> is a
                    TouchDesigner project and lyric video made by me as part of
                    IMS 431 at Miami University. The entire project is set up
                    within TouchDesigner, using various camera positions within
                    a 3D scene to move around a scene with neon-esque text and
                    images. <em>Fort Knox</em> is a song by the South African
                    electro-swing group called GoldFish.
                </p>
            </>
        ),
    },
    {
        slug: "letters-from-the-ocean",
        title: "Letters from the Ocean",
        subtitle: "Projection for a Production @ Miami University",
        year: "2020",
        tags: ["TouchDesigner", "Projection Mapping"],
        links: [
            {
                label: "Read More",
                href: "https://sites.miamioh.edu/mother-earths-gallery-of-broken-things/letter-from-the-ocean/",
                icon: faBook,
                openInNewWindow: true,
            },
        ],
        screenSource: {
            primary: {
                kind: "video",
                src: "/branding/videos/visuals/letters-from-the-ocean.mp4",
            },
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/letters-from-the-ocean.jpg",
        },
        body: (
            <>
                <p>
                    <em>Letters from the Ocean</em> was a projection piece
                    created for the Miami University Theatre Department's
                    production called{" "}
                    <em>Mother Earth's Gallery of Broken Things</em>.{" "}
                    <em>Letters from the Ocean</em> was one scene in the
                    production, which featured projections of water that
                    accompanies dancers, music, and spoken word to create an
                    immersive experience for the audience.
                </p>
            </>
        ),
    },
    {
        slug: "steampunk-mobile-fortress",
        title: "Steampunk Mobile Fortress",
        subtitle:
            "3D Model and Animation Final Project for IMS 319 @ Miami University",
        year: "2020",
        tags: ["3D Modeling", "Animation", "AutoDesk Maya"],
        links: [
            {
                label: "Read More",
                href: "https://sites.miamioh.edu/mother-earths-gallery-of-broken-things/letter-from-the-ocean/",
                icon: faBook,
                openInNewWindow: true,
            },
        ],
        screenSource: {
            primary: {
                kind: "video",
                src: "/branding/videos/visuals/steampunk-fort.mp4",
            },
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/steampunk-fort.png",
        },
        body: (
            <>
                <p>
                    <em>Steampunk Mobile Fortress</em> was a 3D model and
                    animation final project created for IMS 319 at Miami
                    University. The project involved designing and animating a
                    steampunk-inspired mobile fortress, showcasing skills in 3D
                    modeling, texturing, and animation within AutoDesk Maya.
                </p>
            </>
        ),
    },
    {
        slug: "tri-delta-sundial",
        title: "Tri-Delta Sundial",
        subtitle: "Project for IMS 319 @ Miami University",
        year: "2020",
        tags: ["3D Modeling", "AutoDesk Maya"],
        links: [
            {
                label: "Image of IRL Sundial",
                href: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.topuniversities.com%2Fsites%2Fdefault%2Ffiles%2Fprofiles-slideshow%2FOutdoor%2520orientation%2520sundial%2520resized-1664204307.jpg&f=1&nofb=1&ipt=e724a147795ee029fc81fe500b64bc135704789963b07ff276f1363b9e193ad6",
                icon: faArrowUpRightFromSquare,
                openInNewWindow: true,
            },
        ],
        screenSource: {
            primary: {
                kind: "image",
                src: "/branding/img/visuals/miami-sundial.png",
            },
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/miami-sundial.png",
        },
        body: (
            <>
                <p>
                    <em>Tri-Delta Sundial</em> is a 3D model of the Tri-Delta
                    sundial located on Miami University's campus. This model was
                    created as part of IMS 319 at Miami University, which
                    required creating a detailed and accurate representation of
                    a building or structure on campus using AutoDesk Maya.
                </p>
            </>
        ),
    },
];

const Visuals = () => {
    const { setMediaOverride, clearMediaOverride } = useSceneVideo();

    const onScreenMediaChange = React.useCallback(
        (media: ShowcaseScreenMedia | null) => {
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
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon/favicon.ico" />
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
