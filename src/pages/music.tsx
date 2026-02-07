import * as React from "react";
import Head from "next/head";
import {
    Showcase,
    type ShowcaseItem,
    type ShowcaseScreenMedia,
} from "@/components/Showcase/Showcase";
import { useSceneVideo } from "@/context/SceneVideoContext";
import { useAudioSpectrum } from "@/context/AudioSpectrumContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFile,
    faFilm,
    faMusic,
    faPause,
    faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { faSoundcloud } from "@fortawesome/free-brands-svg-icons";

const DEMO_AUDIO_SRC = "/branding/audio/show_demo.mp3";

type MusicItem = ShowcaseItem & {
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
};

const getMusicScreenPaletteForItem = (item: ShowcaseItem) => {
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

const getPreviewAudioSrcForItem = (item: MusicItem) => {
    return item.previewAudioSrc || DEMO_AUDIO_SRC;
};

const formatTime = (t: number) => {
    if (!Number.isFinite(t) || t < 0) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
};

const MusicPlayerBar = ({
    item,
    isPlaying,
    initialVolume,
    currentTime,
    duration,
    timelineRef,
    onTogglePlayback,
    onSetVolume,
    onSeekStart,
    onSeek,
    onSeekEnd,
    onEnsurePreviewSource,
}: {
    item: ShowcaseItem;
    isPlaying: boolean;
    initialVolume: number;
    currentTime: number;
    duration: number;
    timelineRef: React.RefObject<HTMLInputElement>;
    onTogglePlayback: () => void;
    onSetVolume: (volume: number) => void;
    onSeekStart: () => void;
    onSeek: (t: number) => void;
    onSeekEnd: (t: number) => void;
    onEnsurePreviewSource: (item: ShowcaseItem) => void;
}) => {
    React.useEffect(() => {
        onEnsurePreviewSource(item);
        // Intentionally only when selection changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item.slug]);

    return (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                alignItems: "center",
                padding: "10px 12px",
                marginBottom: 10,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 10,
            }}
        >
            <button
                type="button"
                onClick={onTogglePlayback}
                style={{
                    width: 38,
                    height: 38,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.06)",
                    color: "white",
                    cursor: "pointer",
                }}
                aria-label={isPlaying ? "Pause preview" : "Play preview"}
                title={isPlaying ? "Pause" : "Play"}
            >
                <FontAwesomeIcon
                    icon={isPlaying ? faPause : faPlay}
                    fixedWidth
                />
            </button>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    minWidth: 240,
                    flex: 1,
                    paddingRight: 12,
                }}
            >
                <input
                    ref={timelineRef}
                    type="range"
                    min={0}
                    max={Math.max(0, duration) || 0}
                    step={0.01}
                    defaultValue={0}
                    onPointerDown={onSeekStart}
                    onPointerUp={(e) => {
                        const v = Number(
                            (e.currentTarget as HTMLInputElement).value,
                        );
                        onSeekEnd(v);
                    }}
                    onKeyDown={(e) => {
                        // Keep the label responsive during keyboard seeking.
                        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight")
                            return;
                        const v = Number(
                            (e.currentTarget as HTMLInputElement).value,
                        );
                        onSeek(v);
                    }}
                    onInput={(e) => {
                        const v = Number((e.target as HTMLInputElement).value);
                        onSeek(v);
                    }}
                    onChange={(e) => {
                        const v = Number((e.target as HTMLInputElement).value);
                        onSeek(v);
                    }}
                    style={{ width: "100%" }}
                    aria-label="Timeline"
                />

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: "rgba(255,255,255,0.70)",
                        fontSize: 12,
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    <span>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    minWidth: 200,
                    maxWidth: 260,
                    marginLeft: "auto",
                    paddingLeft: 12,
                }}
            >
                <label
                    style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        color: "rgba(255,255,255,0.85)",
                        fontSize: 14,
                        whiteSpace: "nowrap",
                    }}
                >
                    Volume
                    <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        defaultValue={initialVolume}
                        onInput={(e) => {
                            const v = Number(
                                (e.target as HTMLInputElement).value,
                            );
                            onSetVolume(v);
                        }}
                        onChange={(e) => {
                            const v = Number(
                                (e.target as HTMLInputElement).value,
                            );
                            onSetVolume(v);
                        }}
                        style={{ flex: 1 }}
                    />
                </label>

                <div
                    style={{
                        color: "rgba(255,255,255,0.60)",
                        fontSize: 12,
                        lineHeight: 1.1,
                    }}
                >
                    Screen reacts to this audio
                </div>
            </div>
        </div>
    );
};

const MUSIC_ITEMS = [
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
                <p>
                    I write music under the name <em>dolphinswarm</em>, where I
                    self-write, record, and produce indie folk songs.
                </p>
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
                <p>
                    I write music under the name <em>dolphinswarm</em>, where I
                    self-write, record, and produce indie folk songs.
                </p>
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
                <p>
                    I write music under the name <em>dolphinswarm</em>, where I
                    self-write, record, and produce indie folk songs.
                </p>
                <p>
                    <em>movin' on</em> is an upbeat, happy folk track about the
                    desire and excitement of starting fresh and pursing new
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
                <p>
                    I write music under the name <em>dolphinswarm</em>, where I
                    self-write, record, and produce indie folk songs.
                </p>
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
                <p>
                    I write music under the name <em>dolphinswarm</em>, where I
                    self-write, record, and produce indie folk songs.
                </p>
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
                <p>
                    I write music under the name <em>dolphinswarm</em>, where I
                    self-write, record, and produce indie folk songs.
                </p>
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
                <p>
                    I write music under the name <em>dolphinswarm</em>, where I
                    self-write, record, and produce indie folk songs.
                </p>
                <p>
                    <em>screaming to the sky</em> is a spacey indie folk track
                    about frustations with dating apps. It reatures a repeated
                    guitar riff in a an open G tuning, as well as lots of
                    crunchy jazz chords.
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
        body: <p>Recorded and cut for quick drop-in use.</p>,
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
                    Villa-Lobos perhaps the most well-known soprano saxophone
                    solo piece, which I performed as part of my junior recital.
                    Originally accompanied by a chamber orchestra, I performed a
                    version with piano reduction.
                </p>
                <p>
                    For my recital, I performed movements II and III. Movement
                    II is marked "Lent" and is a short, lyrical movement with a
                    very "jumpy" melodic line. This is follow immediately after
                    by with Movement III, marked "Très animé", which is a lively
                    and rhythmically complex movement that features fast passags
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
        screenSource: { kind: "video", src: "/branding/videos/tv-static.mp4" },
        body: (
            <p>
                <em>Heist</em> is a string quartet piece inspired by classic spy
                and heist films, cinematically portraying the tension of
                attempting to pull off a robbery. Notable thing about this piece
                is it's mostly in 7/8 time!
            </p>
        ),
    },
] satisfies MusicItem[];

const Music = () => {
    const {
        setMediaOverride,
        clearMediaOverride,
        setScreenStyleOverride,
        clearScreenStyleOverride,
    } = useSceneVideo();
    const { attachMediaElement, resume, detach } = useAudioSpectrum();
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const timelineRef = React.useRef<HTMLInputElement>(null);
    const rafRef = React.useRef<number | null>(null);
    const isSeekingRef = React.useRef(false);
    const lastLabelUpdateRef = React.useRef(0);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [volume, setVolume] = React.useState(0.9);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);
    const [activeSlug, setActiveSlug] = React.useState<string>(
        MUSIC_ITEMS[0]?.slug ?? "",
    );

    const onScreenMediaChange = React.useCallback(
        (media: ShowcaseScreenMedia | null) => {
            setMediaOverride(media);
        },
        [setMediaOverride],
    );

    React.useEffect(() => {
        return () => {
            clearMediaOverride();
            clearScreenStyleOverride();
        };
    }, [clearMediaOverride, clearScreenStyleOverride]);

    const onSelectedItemChange = React.useCallback(
        (item: ShowcaseItem | null) => {
            if (!item) {
                setScreenStyleOverride(null);
                return;
            }

            const typed = item as MusicItem;
            const fallback = getMusicScreenPaletteForItem(item);

            const colorA =
                typed.spectrumBars?.colorA ?? fallback?.spectrumBars.colorA;
            const colorB =
                typed.spectrumBars?.colorB ?? fallback?.spectrumBars.colorB;
            const base = typed.screenBase ?? fallback?.screenBase;

            setScreenStyleOverride({
                music: {
                    colorA,
                    colorB,
                    base,
                },
            });
        },
        [setScreenStyleOverride],
    );

    React.useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        attachMediaElement(el);

        const onPlay = () => {
            setIsPlaying(true);
            void resume();
        };
        const onStop = () => setIsPlaying(false);

        const syncDuration = () => {
            const d = Number.isFinite(el.duration) ? el.duration : 0;
            setDuration(d > 0 ? d : 0);
        };

        const syncTime = () => {
            if (isSeekingRef.current) return;
            const t = Number.isFinite(el.currentTime) ? el.currentTime : 0;
            setCurrentTime(t);
            if (timelineRef.current) {
                timelineRef.current.value = String(t);
            }
        };

        el.addEventListener("play", onPlay);
        el.addEventListener("pause", onStop);
        el.addEventListener("ended", onStop);
        el.addEventListener("loadedmetadata", syncDuration);
        el.addEventListener("durationchange", syncDuration);
        el.addEventListener("timeupdate", syncTime);

        // Initial sync (in case metadata is already available).
        syncDuration();
        syncTime();

        return () => {
            el.removeEventListener("play", onPlay);
            el.removeEventListener("pause", onStop);
            el.removeEventListener("ended", onStop);
            el.removeEventListener("loadedmetadata", syncDuration);
            el.removeEventListener("durationchange", syncDuration);
            el.removeEventListener("timeupdate", syncTime);
            detach();
        };
    }, [attachMediaElement, detach, resume]);

    React.useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        const stop = () => {
            if (rafRef.current == null) return;
            window.cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };

        const tick = (now: number) => {
            if (!el || el.paused) {
                stop();
                return;
            }

            if (!isSeekingRef.current) {
                const t = Number.isFinite(el.currentTime) ? el.currentTime : 0;
                if (timelineRef.current) timelineRef.current.value = String(t);

                // Update the label at ~12fps so it feels smooth without spamming renders.
                if (now - lastLabelUpdateRef.current > 80) {
                    lastLabelUpdateRef.current = now;
                    setCurrentTime(t);
                }
            }

            rafRef.current = window.requestAnimationFrame(tick);
        };

        const onPlay = () => {
            if (rafRef.current == null) {
                rafRef.current = window.requestAnimationFrame(tick);
            }
        };

        const onPause = () => {
            stop();
        };

        if (!el.paused) onPlay();
        el.addEventListener("play", onPlay);
        el.addEventListener("pause", onPause);

        return () => {
            el.removeEventListener("play", onPlay);
            el.removeEventListener("pause", onPause);
            stop();
        };
    }, []);

    React.useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        el.volume = volume;
    }, [volume]);

    const togglePlayback = React.useCallback(async () => {
        const el = audioRef.current;
        if (!el) return;
        if (el.paused) {
            attachMediaElement(el);
            await resume();
            try {
                await el.play();
            } catch {
                // Autoplay / gesture policy or other playback error.
            }
        } else {
            el.pause();
        }
    }, [attachMediaElement, resume]);

    const seekTo = React.useCallback((t: number) => {
        const el = audioRef.current;
        if (!el) return;
        const next = Math.max(
            0,
            Math.min(Number.isFinite(el.duration) ? el.duration : t, t),
        );
        try {
            el.currentTime = next;
        } catch {
            // no-op
        }
        setCurrentTime(next);
    }, []);

    const onSeekStart = React.useCallback(() => {
        isSeekingRef.current = true;
    }, []);

    const onSeekEnd = React.useCallback(
        (t: number) => {
            isSeekingRef.current = false;
            seekTo(t);
        },
        [seekTo],
    );

    const setAudioSrcForSlug = React.useCallback(
        async (slug: string) => {
            const el = audioRef.current;
            if (!el) return;

            const item = MUSIC_ITEMS.find((i) => i.slug === slug);
            const nextSrc = item
                ? getPreviewAudioSrcForItem(item)
                : DEMO_AUDIO_SRC;

            const currentSrc = (el.currentSrc || el.src || "").trim();
            const isSameSrc =
                currentSrc.length > 0 && currentSrc.endsWith(nextSrc);
            if (isSameSrc) {
                setActiveSlug(slug);
                return;
            }

            const shouldKeepPlaying = !el.paused;
            try {
                el.pause();
            } catch {
                // no-op
            }

            el.src = nextSrc;
            try {
                el.load();
            } catch {
                // no-op
            }

            setActiveSlug(slug);

            if (shouldKeepPlaying) {
                attachMediaElement(el);
                await resume();
                try {
                    await el.play();
                } catch {
                    // If this fails, user can hit play again.
                }
            }
        },
        [activeSlug, attachMediaElement, resume],
    );

    const ensurePreviewSourceForItem = React.useCallback(
        (item: ShowcaseItem) => {
            void setAudioSrcForSlug(item.slug);
        },
        [setAudioSrcForSlug],
    );

    return (
        <>
            <Head>
                <title>Music</title>
                <meta
                    name="description"
                    content="Music releases, scores, and sound design."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon/favicon.ico" />
            </Head>

            <Showcase
                pageTitle="Music"
                items={MUSIC_ITEMS}
                queryKey="project"
                onScreenMediaChange={onScreenMediaChange}
                onSelectedItemChange={onSelectedItemChange}
                renderBodyPrefix={(item) => (
                    <MusicPlayerBar
                        item={item}
                        isPlaying={isPlaying}
                        initialVolume={volume}
                        currentTime={currentTime}
                        duration={duration}
                        timelineRef={timelineRef}
                        onTogglePlayback={() => void togglePlayback()}
                        onSetVolume={(v) => setVolume(v)}
                        onSeekStart={onSeekStart}
                        onSeek={(t) => seekTo(t)}
                        onSeekEnd={onSeekEnd}
                        onEnsurePreviewSource={ensurePreviewSourceForItem}
                    />
                )}
            />

            {/* Keep the audio element mounted once to avoid playback interruption when the UI rerenders. */}
            <audio
                ref={audioRef}
                src={DEMO_AUDIO_SRC}
                preload="auto"
                loop
                style={{ display: "none" }}
            />
        </>
    );
};

export default Music;
