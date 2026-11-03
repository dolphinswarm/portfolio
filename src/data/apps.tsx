import Link from "next/link";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import type { ShowcaseItem } from "@/components/Showcase/Showcase";

export const APPS_ITEMS: ShowcaseItem[] = [
    {
        slug: "poets-shack-web-app",
        title: "Poet's Shack Web App",
        subtitle:
            "Gathering at the Poet's Shack Installation @ Miami University",
        year: "2020",
        description:
            "The web app for the Poet's Shack installation: visitors submitted poems that showed up live on the projection, and scanned QR codes for AR art.",
        tags: ["Node.js", "Express.js", "AR.js"],
        links: [
            {
                label: "GitHub",
                href: "https://github.com/ToxicBananaParty/PoetShack",
                icon: faGithub,
            },
        ],
        screenSource: {
            kind: "image",
            src: "/branding/img/code/poets-shack-website.png",
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/thumbs/poets-shack-website.webp",
        },
        body: (
            <>
                <p>
                    The <em>Poet's Shack Web App</em> was the companion website
                    for the 2020 Gathering at the Poet's Shack, an immersive
                    installation held in Miami University's Bishop Woods.
                    Visitors used it to submit and read poems, which then
                    appeared live on the{" "}
                    <Link href="/installations/poem-visualizer">
                        Poem Visualizer
                    </Link>{" "}
                    projection.
                </p>
                <p>
                    The site also featured a QR code scanner that played
                    interactive art in augmented reality when visitors scanned
                    pictures around the installation. It was built with Node.js,
                    Express.js, and AR.js, and is no longer running.
                </p>
            </>
        ),
    },
    {
        slug: "the-ultimate-drum-machine",
        title: "The Ultimate Drum Machine",
        subtitle: "Browser-based 16-step drum sequencer",
        year: "2022",
        description:
            "A 16-step drum sequencer that runs in your browser, built with React, TypeScript, and Tone.js. Program a beat, swap instruments, and export patterns.",
        tags: ["React", "TypeScript", "Tone.js", "Audio"],
        links: [
            {
                label: "GitHub",
                href: "https://github.com/dolphinswarm/the-ultimate-drum-machine",
                icon: faGithub,
            },
            {
                label: "Live Demo",
                href: "https://dolphinswarm.github.io/the-ultimate-drum-machine/",
                icon: faArrowUpRightFromSquare,
            },
        ],
        screenSource: {
            kind: "video",
            src: "/branding/videos/code/the-ultimate-drum-machine.mp4",
            audio: { toggleable: true, defaultEnabled: false, volume: 1 },
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/thumbs/the-ultimate-drum-machine.webp",
        },
        body: (
            <>
                <p>
                    The <em>Ultimate Drum Machine</em> is a browser-based,
                    16-step drum sequencer built with React + TypeScript and
                    powered by Tone.js. It's designed for quick beat sketching:
                    add tracks by instrument category (kick, snare, hi-hat,
                    clap, FX, crash, ride, tom, accessory), program a pattern,
                    and hit play. This was also made as part of my exploration
                    into React, web audio and music programming.
                </p>
                <p>
                    Each track has per-track volume, a dropdown to swap
                    instruments without rebuilding the pattern, and
                    drag-and-drop reordering to keep your mixer layout tidy.
                    Tempo is adjustable from 30-240 BPM, and playback starts
                    reliably after a user gesture (the Play button resumes the
                    browser audio context when needed).
                </p>
                <p>
                    Patterns can be exported/imported as a small JSON text file,
                    so you can share grooves or pick up where you left off
                    later. The project is deployed to GitHub Pages and uses
                    react-beautiful-dnd for track ordering and Tone.js for
                    sample playback + scheduling.
                </p>
            </>
        ),
    },
    {
        slug: "r3f-portfolio",
        title: "3D Portfolio",
        subtitle: "Next.js + R3F",
        year: "2026",
        description:
            "This very website! Built with Next.js and React Three Fiber, with my projects playing on a TV inside a 3D scene.",
        tags: ["Next.js", "TypeScript", "Three.js"],
        links: [
            {
                label: "GitHub",
                href: "https://github.com/dolphinswarm/portfolio",
                icon: faGithub,
            },
        ],
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/thumbs/this-website.webp",
        },
        screenSource: {
            kind: "video",
            src: "/branding/videos/demo-reel.mp4",
        },
        body: (
            <>
                <p>This portfolio website!</p>
                <p>
                    Built with Next.js and React Three Fiber (R3F), this site
                    showcases my projects and skills in a 3D, engaging, and
                    interactive "TV screen" format. The site is also built for
                    responsiveness with mobile phones.
                </p>
            </>
        ),
    },
];
