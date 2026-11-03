import { faGithub } from "@fortawesome/free-brands-svg-icons";
import type { ShowcaseItem } from "@/components/Showcase/Showcase";

export const XR_GAMES_ITEMS: ShowcaseItem[] = [
    {
        slug: "vr-basketball",
        title: "VR Basketball Shootout",
        subtitle: "Godot VR arcade game for ATLS 5660",
        year: "2026",
        tags: ["Godot", "C#", "VR", "OpenXR"],
        links: [
            {
                label: "GitHub",
                href: "https://github.com/dolphinswarm/alts-5660-creative-code/tree/main/week-8-3d",
                icon: faGithub,
            },
        ],
        screenSource: {
            kind: "video",
            src: "/branding/videos/code/vr-basketball.mp4",
            audio: { toggleable: true, defaultEnabled: false, volume: 1 },
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/thumbs/vr-basketball.webp",
        },
        body: (
            <>
                <p>
                    <em>VR Basketball Shootout</em> is an arcade-style virtual
                    reality basketball game built in Godot with C# and Godot XR
                    Tools, made for ATLS 5660 (Creative Code) at CU Boulder.
                    Press the big red button, then sink as many shots as you can
                    in 60 seconds. Every basket is worth three, shots still in
                    the air at the buzzer count, and your high score is saved
                    between sessions.
                </p>
                <p>
                    Scoring watches each ball's center cross the plane of the
                    rim instead of using a trigger area, since trigger areas
                    reported too late on fast shots. A ball that goes up through
                    the net doesn't count on its way back down, and the rim is
                    1.5× regulation size so scoring in VR is actually doable.
                    The net has no collision, so made shots are slowed down to
                    look like the net caught them.
                </p>
                <p>
                    Sound and touch carry a lot of the feel: dribbles, backboard
                    hits and rim clanks are picked by what the ball hit and
                    scaled by how hard it hit, a clock ticks through the last 10
                    seconds before the buzzer, and the controllers pulse when
                    you pick up a ball or press the start button.
                </p>
            </>
        ),
    },
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
            src: "/branding/img/thumbs/parkinsons-vr.webp",
        },
        body: (
            <>
                <p>
                    <em>Parkinson's VR Training</em> was a virtual reality
                    application developed as a training simulator as part of a
                    study conducted by a nursing professor at Malone University
                    (unnamed for privacy purposes). The study was about testing
                    the effectiveness of virtual reality in training nurses. As
                    the name implies, the application focused on treating a
                    Parkinson's Disease patient.
                </p>
                <p>
                    The application featured several scenarios of taking care of
                    a Parkinson's patient, including administering medication,
                    checking vitals, and more. The user would interact with the
                    virtual environment using VR controllers, being able to move
                    around and perform tasks as if they were in a real clinical
                    setting. Throughout the simulation, there are also various
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
            src: "/branding/img/thumbs/vrchery.webp",
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
            src: "/branding/img/thumbs/ar-looper.webp",
        },
        body: (
            <>
                <p>
                    <em>AR Looper</em> is an augmented reality music looper
                    built in Unity using the Vuforia AR stack. It was created as
                    a first AR project / learning demo: you point your phone at
                    a printed piece of paper (shown) with a specific marker on
                    it, and a virtual music looper interface appears on top of
                    the marker. You can then interact with the interface to
                    create loops of different drum sounds, adjusting the tempo
                    and pattern as you like.
                </p>
            </>
        ),
    },
    {
        slug: "ninjas-vs-knights",
        title: "Ninjas vs. Knights",
        subtitle: "Unity capture-the-flag game for CSE 389",
        year: "2021",
        tags: ["Unity", "C#", "Game Development"],
        links: [
            {
                label: "GitHub",
                href: "https://github.com/dolphinswarm/Ninjas-vs.-Knights",
                icon: faGithub,
            },
        ],
        screenSource: {
            kind: "video",
            src: "/branding/videos/code/ninjas-vs-knights.mp4",
        },
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/thumbs/ninjas-vs-knights.webp",
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
                    steal the flag from your village! Show them who's boss by
                    capturing their flag and bringing it back to your base. You
                    can pick up and fire a variety of guns to help secure your
                    chances of capturing the enemy's flag.
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
];
