import * as React from "react";
import type { ShowcaseItem } from "@/components/Showcase/Showcase";
import {
    ShowcasePage,
    getShowcaseStaticPaths,
    getShowcaseStaticProps,
    type ShowcasePageProps,
} from "@/components/Showcase/ShowcasePage";
import { SECTIONS } from "@/data/sections";
import { useSceneVideo } from "@/context/SceneVideoContext";
import { useAudioSpectrum } from "@/context/AudioSpectrumContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import {
    DEMO_AUDIO_SRC,
    MUSIC_ITEMS,
    getMusicScreenPaletteForItem,
    getPreviewAudioSrcForItem,
    type MusicItem,
} from "@/data/music";

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
    timelineRef: React.RefObject<HTMLInputElement | null>;
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

const Music = ({ slug }: ShowcasePageProps) => {
    const { setScreenStyleOverride, clearScreenStyleOverride } =
        useSceneVideo();
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

    React.useEffect(() => {
        return () => {
            clearScreenStyleOverride();
        };
    }, [clearScreenStyleOverride]);

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
        <ShowcasePage
            section={SECTIONS.music}
            items={MUSIC_ITEMS}
            slug={slug}
            showcaseProps={{
                onSelectedItemChange,
                renderBodyPrefix: (item) => (
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
                ),
            }}
        >
            {/* Keep the audio element mounted once to avoid playback interruption when the UI rerenders. */}
            <audio
                ref={audioRef}
                src={DEMO_AUDIO_SRC}
                preload="auto"
                loop
                style={{ display: "none" }}
            />
        </ShowcasePage>
    );
};

export const getStaticPaths = getShowcaseStaticPaths(MUSIC_ITEMS);
export const getStaticProps = getShowcaseStaticProps;

export default Music;
