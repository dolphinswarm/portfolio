import Link from "next/link";
import { faFilm, faMusic } from "@fortawesome/free-solid-svg-icons";
import { faSoundcloud } from "@fortawesome/free-brands-svg-icons";
import type { ShowcaseItem } from "@/components/Showcase/Showcase";

export const DEMO_AUDIO_SRC = "/branding/audio/show-demo.mp3";

export type MusicItem = ShowcaseItem & {
    previewAudioSrc?: string;
    spectrumBars?: { colorA?: string; colorB?: string };
    screenBase?: string;
};

type MusicScreenPalette = {
    spectrumBars: { colorA: string; colorB: string };
    screenBase: string;
};

// Curated per-track palettes based on title/tone/genre.
// These are used as defaults; an item can still override via `spectrumBars` / `screenBase`.
const MUSIC_SCREEN_PALETTE_BY_SLUG: Record<string, MusicScreenPalette> = {
    // dolphinswarm
    bones: {
        spectrumBars: { colorA: "#804707", colorB: "#258811" },
        screenBase: "#4b2e08",
    },
    astrogirl: {
        spectrumBars: { colorA: "#a855f7", colorB: "#fbff00" },
        screenBase: "#090617",
    },
    "movin-on": {
        spectrumBars: { colorA: "#61defd", colorB: "#fdd842" },
        screenBase: "#061018",
    },
    homecoming: {
        spectrumBars: { colorA: "#fb923c", colorB: "#ef4444" },
        screenBase: "#140a06",
    },
    "stellers-jay": {
        spectrumBars: { colorA: "#60a5fa", colorB: "#00098a" },
        screenBase: "#0b0749",
    },
    "what-i-thought-itd-be": {
        spectrumBars: { colorA: "#93c5fd", colorB: "#c4b5fd" },
        screenBase: "#070914",
    },
    "screaming-to-the-sky": {
        spectrumBars: { colorA: "#ff2bd6", colorB: "#3fe5ff" },
        screenBase: "#0a0612",
    },

    // Installation demo
    futerra: {
        spectrumBars: { colorA: "#63ff7c", colorB: "#3fe5ff" },
        screenBase: "#06130b",
    },

    // Saxophone repertoire
    "improvisation-1": {
        spectrumBars: { colorA: "#3fe5ff", colorB: "#ff2bd6" },
        screenBase: "#070615",
    },
    "creston-sonata-i": {
        spectrumBars: { colorA: "#ff6b6b", colorB: "#ffd166" },
        screenBase: "#12080a",
    },
    "creston-sonata-ii": {
        spectrumBars: { colorA: "#06d6a0", colorB: "#a78bfa" },
        screenBase: "#060f12",
    },
    "fantasia-ii-iii": {
        spectrumBars: { colorA: "#f97316", colorB: "#22c55e" },
        screenBase: "#0c0b06",
    },

    // Compositions
    forge: {
        spectrumBars: { colorA: "#ff3b3b", colorB: "#ff8a1f" },
        screenBase: "#140607",
    },
    "landward-ho": {
        spectrumBars: { colorA: "#3fe5ff", colorB: "#ffd166" },
        screenBase: "#061019",
    },
    heist: {
        spectrumBars: { colorA: "#22c55e", colorB: "#ef4444" },
        screenBase: "#050a07",
    },
    within: {
        spectrumBars: { colorA: "#f472b6", colorB: "#c084fc" },
        screenBase: "#2d1b4e",
    },
};

export const getMusicScreenPaletteForItem = (item: ShowcaseItem) => {
    const bySlug = MUSIC_SCREEN_PALETTE_BY_SLUG[item.slug];
    if (bySlug) return bySlug;

    // Tag-based fallback (for future additions).
    const tags = (item as { tags?: string[] }).tags;
    if (tags?.includes("Space Rock")) {
        return MUSIC_SCREEN_PALETTE_BY_SLUG.astrogirl;
    }
    if (tags?.includes("Folk")) {
        return MUSIC_SCREEN_PALETTE_BY_SLUG.bones;
    }
    if (tags?.includes("Orchestra")) {
        return MUSIC_SCREEN_PALETTE_BY_SLUG["landward-ho"];
    }
    if (tags?.includes("Saxophone Solo")) {
        return MUSIC_SCREEN_PALETTE_BY_SLUG["improvisation-1"];
    }

    return undefined;
};

export const getPreviewAudioSrcForItem = (item: MusicItem) => {
    return item.previewAudioSrc || DEMO_AUDIO_SRC;
};

// Shared intro shown with each dolphinswarm song.
const DOLPHINSWARM_INTRO = (
    <p>
        I write music under the name <em>dolphinswarm</em>, where I self-write,
        record, and produce indie folk songs.
    </p>
);

export const MUSIC_ITEMS = [
    {
        slug: "bones",
        title: "bones",
        subtitle: "dolphinswarm",
        year: "2025",
        tags: ["Folk", "Indie"],
        links: [
            {
                label: "SoundCloud",
                href: "https://soundcloud.com/dolphinswarm/bones",
                icon: faSoundcloud,
            },
        ],
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/me/brad-guitar.jpg",
            focus: { y: -10 },
        },
        previewAudioSrc: "/branding/audio/bones.mp3",
        body: (
            <>
                {DOLPHINSWARM_INTRO}
                <p>
                    <em>bones</em> is a clawhammer banjo song, which discusses
                    what I want to happen to my body after I die (in a
                    lighthearted way!).
                </p>
            </>
        ),
    },
    {
        slug: "astrogirl",
        title: "astrogirl",
        subtitle: "dolphinswarm",
        year: "2024",
        tags: ["Space Rock", "Indie"],
        links: [
            {
                label: "SoundCloud",
                href: "https://soundcloud.com/dolphinswarm/astrogirl",
                icon: faSoundcloud,
            },
        ],
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/me/brad-guitar.jpg",
            focus: { y: -10 },
        },
        previewAudioSrc: "/branding/audio/astrogirl.mp3",
        body: (
            <>
                {DOLPHINSWARM_INTRO}
                <p>
                    <em>astrogirl</em> is a dreamy, spacey indie rock track
                    about a dying relationship and how it feels to drift apart
                    from someone you care about, comparing it to the vastness of
                    space. The song uses lots of reverb, sampling, and vocal
                    processing (a la Space Oddity) and a steady drumbeat to
                    create a sense of trance and distance.
                </p>
            </>
        ),
    },
    {
        slug: "movin-on",
        title: "movin' on",
        subtitle: "dolphinswarm",
        year: "2024",
        tags: ["Folk", "Indie"],
        links: [
            {
                label: "SoundCloud",
                href: "https://soundcloud.com/dolphinswarm/movin-on",
                icon: faSoundcloud,
            },
        ],
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/me/brad-guitar.jpg",
            focus: { y: -10 },
        },
        previewAudioSrc: "/branding/audio/movin-on.mp3",
        body: (
            <>
                {DOLPHINSWARM_INTRO}
                <p>
                    <em>movin' on</em> is an upbeat, happy folk track about the
                    desire and excitement of starting fresh and pursuing new
                    opportunities.
                </p>
            </>
        ),
    },
    {
        slug: "homecoming",
        title: "homecoming",
        subtitle: "dolphinswarm",
        year: "2024",
        tags: ["Folk", "Indie"],
        links: [
            {
                label: "SoundCloud",
                href: "https://soundcloud.com/dolphinswarm/homecoming",
                icon: faSoundcloud,
            },
        ],
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/me/brad-guitar.jpg",
            focus: { y: -10 },
        },
        previewAudioSrc: "/branding/audio/homecoming.mp3",
        body: (
            <>
                {DOLPHINSWARM_INTRO}
                <p>
                    <em>homecoming</em> is an emo folk track about the season of
                    fall, and how I personally really dislike it. It's a play on
                    words about a school homecoming event, and wanting to go
                    back home for comfort instead of facing painful changes and
                    memories.
                </p>
            </>
        ),
    },
    {
        slug: "stellers-jay",
        title: "steller's jay",
        subtitle: "dolphinswarm",
        year: "2024",
        tags: ["Folk", "Indie"],
        links: [
            {
                label: "SoundCloud",
                href: "https://soundcloud.com/dolphinswarm/stellers-jay",
                icon: faSoundcloud,
            },
        ],
        previewAudioSrc: "/branding/audio/stellers-jay.mp3",
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/me/brad-guitar.jpg",
            focus: { y: -10 },
        },
        body: (
            <>
                {DOLPHINSWARM_INTRO}
                <p>
                    <em>steller's jay</em> is an acoustic folk love song,
                    comparing a relationship to a Steller's Jay bird.
                </p>
            </>
        ),
    },
    {
        slug: "what-i-thought-itd-be",
        title: "what i thought it'd be",
        subtitle: "dolphinswarm",
        year: "2024",
        tags: ["Folk", "Indie"],
        links: [
            {
                label: "SoundCloud",
                href: "https://soundcloud.com/dolphinswarm/what-i-thought-itd-be",
                icon: faSoundcloud,
            },
        ],
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/me/brad-guitar.jpg",
            focus: { y: -10 },
        },
        previewAudioSrc: "/branding/audio/what-i-thought-itd-be.mp3",
        body: (
            <>
                {DOLPHINSWARM_INTRO}
                <p>
                    <em>what i thought it'd be</em> is a slower, reflective
                    track about dreams and expectations disappointing when
                    reality doesn't align with them.
                </p>
            </>
        ),
    },
    {
        slug: "screaming-to-the-sky",
        title: "screaming to the sky",
        subtitle: "dolphinswarm",
        year: "2024",
        tags: ["Folk", "Indie"],
        links: [
            {
                label: "SoundCloud",
                href: "https://soundcloud.com/dolphinswarm/screaming-to-the-sky",
                icon: faSoundcloud,
            },
        ],
        previewAudioSrc: "/branding/audio/screaming-to-the-sky.mp3",
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/me/brad-guitar.jpg",
            focus: { y: -10 },
        },
        body: (
            <>
                {DOLPHINSWARM_INTRO}
                <p>
                    <em>screaming to the sky</em> is a spacey indie folk track
                    about frustrations with dating apps. It features a repeated
                    guitar riff in an open G tuning, as well as lots of crunchy
                    jazz chords.
                </p>
            </>
        ),
    },
    {
        slug: "futerra",
        title: "FuTerra | I Was The Earth",
        subtitle: "Generative Music for BLINK 2024 Installation",
        year: "2024",
        tags: ["Ableton Live", "Generative Music"],
        links: [
            {
                label: "View Full Video",
                href: "https://drive.google.com/file/d/1qEKORAOorDiQXzrEezOVH6YbbtHf3Fug/view?usp=sharing",
                icon: faFilm,
                openInNewWindow: true,
            },
        ],
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/futerra-2.jpg",
        },
        previewAudioSrc: "/branding/audio/show-demo.mp3",
        body: (
            <p>
                <em>FuTerra | I Was The Earth</em> is the generative music
                soundscape I created for the BLINK 2024 video installation of
                the same name (see the piece on the{" "}
                <Link href="/visuals#futerra">Visuals</Link> page). The music is
                meant to evoke a sense of awe, wonder, evolution, and the
                passage of time, reflecting the themes of the installation. It
                was created using Ableton Live with various generative
                techniques, including randomization, algorithmic composition,
                and live processing of field recordings.
            </p>
        ),
    },
    {
        slug: "improvisation-1",
        title: "Improvisation 1",
        subtitle: "Ryo Noda",
        year: "2020",
        tags: ["Saxophone Solo", "Alto Saxophone"],
        previewAudioSrc: "/branding/audio/improvisation-i.mp3",
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/audio/jazztime.png",
        },
        body: (
            <>
                <p>
                    <em>Improvisation 1</em> is a solo saxophone piece by Ryo
                    Noda, which I performed as part of my junior recital. It
                    utilizes extended techniques and explores the expressive
                    capabilities of the saxophone. It's also notated with lots
                    of symbols!
                </p>
            </>
        ),
    },
    {
        slug: "creston-sonata-i",
        title: "Movement I - With Vigor",
        subtitle: "Paul Creston",
        year: "2020",
        tags: ["Saxophone Solo", "Alto Saxophone"],
        previewAudioSrc: "/branding/audio/creston-i.mp3",
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/audio/jazztime.png",
        },
        body: (
            <>
                <p>
                    <em>Sonata for Alto Saxophone and Piano</em> by Paul Creston
                    is a staple of the alto saxophone solo repertoire, which I
                    performed as part of my junior recital. The sonata consists
                    of three movements, each with its own character and
                    technical challenges.
                </p>
                <p>
                    Movement I, marked "With Vigor", is an energetic and
                    rhythmically driven movement that features fast passages,
                    syncopated rhythms, and dynamic contrasts.
                </p>
            </>
        ),
    },
    {
        slug: "creston-sonata-ii",
        title: "Movement II - With Tranquility",
        subtitle: "Paul Creston",
        year: "2020",
        tags: ["Saxophone Solo", "Alto Saxophone"],
        previewAudioSrc: "/branding/audio/creston-ii.mp3",
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/audio/jazztime.png",
        },
        body: (
            <>
                <p>
                    <em>Sonata for Alto Saxophone and Piano</em> by Paul Creston
                    is a staple of the alto saxophone solo repertoire, which I
                    performed as part of my junior recital. The sonata consists
                    of three movements, each with its own character and
                    technical challenges.
                </p>
                <p>
                    Movement II, marked "With Tranquility", is a lyrical and
                    expressive slow movement with a beautiful melodic line,
                    which showcases the saxophone's vibrato and dynamic range.
                </p>
            </>
        ),
    },
    {
        slug: "fantasia-ii-iii",
        title: "Fantasia - Mvts. II & III",
        subtitle: "Heitor Villa-Lobos",
        year: "2020",
        tags: ["Saxophone Solo", "Soprano Saxophone"],
        previewAudioSrc: "/branding/audio/fantasia-ii-iii.mp3",
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/audio/jazztime.png",
        },
        body: (
            <>
                <p>
                    <em>Fantasia for Soprano Saxophone</em> by Heitor
                    Villa-Lobos is perhaps the most well-known soprano saxophone
                    solo piece, which I performed as part of my junior recital.
                    Originally accompanied by a chamber orchestra, I performed a
                    version with piano reduction.
                </p>
                <p>
                    For my recital, I performed movements II and III. Movement
                    II is marked "Lent" and is a short, lyrical movement with a
                    very "jumpy" melodic line. It is followed immediately by
                    Movement III, marked "Très animé", which is a lively and
                    rhythmically complex movement that features fast passages
                    and requires lots of focus on the soprano saxophone's
                    "touchy" tone.
                </p>
            </>
        ),
    },
    {
        slug: "forge",
        title: "Forge",
        subtitle: "Composition for Orchestra",
        year: "2020",
        tags: ["Orchestra", "Composition"],
        links: [
            {
                label: "SoundCloud",
                href: "https://soundcloud.com/dolphinswarm/forge-1",
                icon: faSoundcloud,
            },
            {
                label: "Score",
                href: "/branding/docs/forge.pdf",
                icon: faMusic,
                openInNewWindow: true,
            },
        ],
        previewAudioSrc: "/branding/audio/forge.mp3",
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/audio/composition.png",
        },
        body: (
            <p>
                <em>Forge</em> is a cinematic orchestral piece meant to convey
                an evil, daunting factory. It uses heavy brass, low strings,
                industrial percussion, and lots of dissonance to create a dark,
                mechanical atmosphere.
            </p>
        ),
    },
    {
        slug: "landward-ho",
        title: "Landward Ho!",
        subtitle: "Composition for Orchestra",
        year: "2017",
        tags: ["Orchestra", "Composition"],
        links: [
            {
                label: "SoundCloud",
                href: "https://soundcloud.com/dolphinswarm/landward-ho-1",
                icon: faSoundcloud,
            },
            {
                label: "Score",
                href: "/branding/docs/landward-ho.pdf",
                icon: faMusic,
                openInNewWindow: true,
            },
        ],
        previewAudioSrc: "/branding/audio/landward-ho.mp3",
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/audio/composition.png",
        },
        body: (
            <p>
                <em>Landward Ho!</em> is a cinematic orchestral piece, invoking
                the spirit of adventure and "discovering new lands."
            </p>
        ),
    },
    {
        slug: "heist",
        title: "Heist",
        subtitle: "Composition for String Quartet",
        year: "2021",
        tags: ["String Quartet", "Composition"],
        links: [
            {
                label: "SoundCloud",
                href: "https://soundcloud.com/dolphinswarm/heist",
                icon: faSoundcloud,
            },
            {
                label: "Score",
                href: "/branding/docs/heist.pdf",
                icon: faMusic,
                openInNewWindow: true,
            },
        ],
        previewAudioSrc: "/branding/audio/heist.mp3",
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/audio/composition.png",
        },
        body: (
            <p>
                <em>Heist</em> is a string quartet piece inspired by classic spy
                and heist films, cinematically portraying the tension of
                attempting to pull off a robbery. Notable thing about this piece
                is it's mostly in 7/8 time!
            </p>
        ),
    },
    {
        slug: "within",
        title: "With/in: The Dance Between Being & Becoming",
        subtitle: "Composition for Denver Night Lights Video Installation",
        year: "2026",
        tags: ["Soundtrack", "Classical"],
        previewAudioSrc: "/branding/audio/within.mp3",
        thumbnailSource: {
            kind: "image",
            src: "/branding/img/visuals/denver-night-lights.png",
        },
        body: (
            <p>
                <em>With/in: The Dance Between Being & Becoming</em> is the I
                composed as the accompanying music for the Denver Night Lights
                video installation of the same name (see the piece on the{" "}
                <Link href="/visuals#within">Visuals</Link> page). The piece is
                a whimsical, carnival-esque waltz (think a merry-go-round) that
                is meant to evoke feelings of nostalgia, joy, and
                bittersweetness.
            </p>
        ),
    },
] satisfies MusicItem[];
