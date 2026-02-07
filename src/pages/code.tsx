import * as React from "react";
import Head from "next/head";
import {
    Showcase,
    type ShowcaseItem,
    type ShowcaseScreenMedia,
} from "@/components/Showcase/Showcase";
import { useSceneVideo } from "@/context/SceneVideoContext";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

const CODE_ITEMS: ShowcaseItem[] = [
    {
        slug: "parkinsons-vr",
        title: "Parkinson's VR Training",
        subtitle: "Virtual reality training sim",
        year: "2021",
        tags: ["Unity", "C#", "VR"],
        links: [
            {
                label: "GitHub",
                href: "https://github.com/dolphinswarm/Malone-University-Parkinson-s-VR-Training",
                icon: faGithub,
            },
        ],
        screenSource: {
            kind: "video",
            src: "/branding/videos/code/parkinsons-vr.mp4",
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/code/parkinsons-vr.png",
        },
        body: (
            <>
                <p>
                    <em>Parkinson's VR Training</em> was a virtual reality
                    application developed as a training simulator, developed as
                    part of a study conducted by a nursing professor at Malone
                    University (unnamed for privacy purposes). The study was
                    about testing the effectiveness of virtual reality in
                    training nurses. As the name implies, the application
                    focused on treating a Parkinson's Disease patient.
                </p>
                <p>
                    The application featured several scenarios of taking care of
                    a Parkinson's patient, including administering medication,
                    checking vitals, and more. The user would interact with the
                    virtual environment using VR controllers, being able to move
                    around and perform tasks as if they were in a real clinical
                    setting. Throughout the simulation, there is also various
                    questions and prompts to assess the user's understanding and
                    decision-making skills, which are then (optionally) recorded
                    to a report card.
                </p>
                <p>
                    Developed using Unity, C#, and the Oculus SDK, the
                    simulation was a collaboration between me, a 3D
                    modeling/animation student, our VR professor, and the
                    nursing professor leading the study. My role was primarily
                    as the lead developer, responsible for implementing the core
                    functionality, interactions, and overall user experience of
                    the application.
                </p>
            </>
        ),
    },
    {
        slug: "vrchery",
        title: "VRchery",
        subtitle: "Virtual reality archery game",
        year: "2019",
        tags: ["Unity", "C#", "VR"],
        links: [
            {
                label: "GitHub",
                href: "https://github.com/dolphinswarm/vrchery",
                icon: faGithub,
            },
        ],
        screenSource: { kind: "image", src: "/branding/img/code/vrchery.png" },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/code/vrchery.png",
        },
        body: (
            <>
                <p>
                    <em>VRchery</em> is a simple virtual reality archery game
                    built in Unity using the Oculus VR stack. It was created as
                    a first VR project / learning demo: you spawn in a
                    medieval-style town with a target ~25m away, and you shoot a
                    limited number of arrows to score points.
                </p>
                <p>
                    Features include a VR UI, bow-and-arrow pullback + release
                    using VR controllers, scoring based on distance from the
                    bullseye, and haptic feedback.
                </p>
            </>
        ),
    },
    {
        slug: "ar-looper",
        title: "AR Looper",
        subtitle: "Augmented Reality music looper",
        year: "2019",
        tags: ["Unity", "C#", "AR"],
        links: [
            {
                label: "GitHub",
                href: "https://github.com/dolphinswarm/ar-looper",
                icon: faGithub,
            },
        ],
        screenSource: {
            kind: "image",
            src: "/branding/img/code/ar-looper.png",
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/code/ar-looper.png",
        },
        body: (
            <>
                <p>
                    <em>AR Looper</em> is an augmented reality music looper
                    built in Unity using the Oculus VR stack. It was created as
                    a first VR project / learning demo: you spawn in a
                    medieval-style town with a target ~25m away, and you shoot a
                    limited number of arrows to score points.
                </p>
                <p>
                    Features include a VR UI, bow-and-arrow pullback + release
                    using VR controllers, scoring based on distance from the
                    bullseye, and haptic feedback.
                </p>
            </>
        ),
    },
    {
        slug: "ninjas-vs-knights",
        title: "Ninjas vs. Knights",
        subtitle: "Unity capture-the-flag game for CSE 389",
        year: "2026",
        tags: ["Unity", "C#", "Game Development"],
        links: [
            { label: "GitHub", href: "https://github.com/", icon: faGithub },
        ],
        screenSource: {
            kind: "video",
            src: "/branding/videos/code/ninjas-vs-knights.mp4",
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/code/ninjas-vs-knights.png",
        },
        body: (
            <>
                <p>
                    <em>Ninjas vs. Knights</em> is a third-person shooter
                    capture-the-flag game developed using Unity, built as the
                    final project for CSE 389 (was 487) at Miami University. In
                    this game, you and a team of AI-controlled ninjas must
                    travel to the enemy castle and steal their flag. However, at
                    the same time, a team of AI-controlled knights is trying to
                    the steal the flag from your village! Show them who's boss
                    by capturing their flag and brining it back to your base.
                    You can pick up and fire a vareity of guns to help secure
                    your chances of capturing the enemy's flag.
                </p>
                <p>
                    Built around a Unity "systems" stack for a 3rd-person CTF
                    loop: a GameManager handles spawning (player, friendly AI,
                    enemies, and weapon pickups), UI, pause/audio, and win/lose
                    scene flow; combat uses a shared weapon/bullet pipeline with
                    pickup guns, fire modes (e.g., shotgun spread), clip ammo +
                    fire-rate, and reload timing tied to animations for both
                    player and NPCs; aiming toggles an IK rig + reticle and
                    shifts to an over-shoulder camera; death spawns a ragdoll
                    and runs an auto-respawn loop; and title-screen difficulty
                    scales enemy stats. NPCs on both teams run NavMeshAgent
                    state machines with clear priorities
                    (engage/backpedal/aim/shoot when close, recover/return
                    dropped flags, otherwise route via midpoints), plus a small
                    random path choice to avoid always beelining.
                </p>
            </>
        ),
    },
    {
        slug: "the-ultimate-drum-machine",
        title: "The Ultimate Drum Machine",
        subtitle: "Browser-based 16-step drum sequencer",
        year: "2022",
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
            src: "/branding/img/code/the-ultimate-drum-machine.png",
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
        tags: ["Next.js", "TypeScript", "Three.js"],
        links: [
            { label: "GitHub", href: "https://github.com/", icon: faGithub },
        ],
        screenSource: {
            kind: "video",
            src: "/branding/videos/code/r3f-portfolio.mp4",
        },
        body: (
            <>
                <p>This portfolio website!</p>
                <p>
                    Built with Next.js and React Three Fiber (R3F), this site
                    showcases my projects and skills in a 3D interactive format.
                    It features smooth animations, responsive design, and
                    intuitive navigation to provide an engaging user experience.
                </p>
            </>
        ),
    },
];

const Code = () => {
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
                <title>Code</title>
                <meta
                    name="description"
                    content="Code projects and experiments."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon/favicon.ico" />
            </Head>
            <Showcase
                pageTitle="Code"
                items={CODE_ITEMS}
                queryKey="project"
                onScreenMediaChange={onScreenMediaChange}
            />
        </>
    );
};

export default Code;
