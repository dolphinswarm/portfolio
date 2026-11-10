import React from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faEye,
    faEyeSlash,
    faVolumeHigh,
    faVolumeXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useDrag } from "@use-gesture/react";
import styles from "./Showcase.module.scss";

const FALLBACK_THUMB_SRC = "/branding/img/thumbs/placeholder.svg";

const CHROME_STORAGE_KEY = "showcase:chromeVisible";

// Each section is its own page, so changing sections mounts a new Showcase.
// Next swaps pages in one commit: while the new one renders, the old one is
// still mounted, which is how a section change is told apart from arriving
// from Home or About.
let mountedShowcaseCount = 0;

// The Hide UI state, carried to the next section's Showcase so it starts in
// the same state instead of flashing while localStorage is read.
let lastChromeVisible: boolean | null = null;

const ThumbImage = ({
    src,
    objectPosition,
}: {
    src: string;
    objectPosition?: string;
}) => {
    return (
        // Plain <img>: thumbnails are pre-sized WebP files, so next/image adds nothing.
        // Decorative: the thumb's visible title already names it, and an alt
        // would make screen readers say the title twice.
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={src}
            alt=""
            className={styles.thumbImg}
            loading="lazy"
            style={objectPosition ? { objectPosition } : undefined}
        />
    );
};

/**
 * Scroll the carousel so the thumb for `slug` is centered when possible.
 * Scrolls only the carousel (scrollIntoView can also scroll the page).
 */
const centerThumb = (
    carousel: HTMLElement | null,
    slug: string,
    behavior: ScrollBehavior,
) => {
    const thumb = carousel?.querySelector<HTMLElement>(
        `[data-showcase-thumb='${slug}']`,
    );
    if (!carousel || !thumb) return;
    const carouselRect = carousel.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    carousel.scrollTo({
        left:
            carousel.scrollLeft +
            (thumbRect.left - carouselRect.left) -
            (carouselRect.width - thumbRect.width) / 2,
        behavior,
    });
};

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

const toThumbObjectPosition = (focus?: { x?: number; y?: number }) => {
    if (!focus) return undefined;
    const x = clamp(50 + (focus.x ?? 0), 0, 100);
    const y = clamp(50 + (focus.y ?? 0), 0, 100);
    return `${x}% ${y}%`;
};

const ShowcaseThumb = ({
    item,
    selected,
    onSelect,
}: {
    item: ShowcaseItem;
    selected: boolean;
    onSelect: (slug: string) => void;
}) => {
    const primaryScreenAsset = getPrimaryScreenAsset(item.screenSource);

    const explicitThumbImage =
        item.thumbnailSource?.kind === "image"
            ? item.thumbnailSource
            : undefined;

    const explicitThumb =
        explicitThumbImage?.src ??
        (primaryScreenAsset?.kind === "image"
            ? primaryScreenAsset.src
            : undefined);

    const thumbSrc = explicitThumb ?? FALLBACK_THUMB_SRC;
    const thumbObjectPosition = toThumbObjectPosition(
        explicitThumbImage?.focus,
    );

    return (
        <button
            key={item.slug}
            type="button"
            className={
                selected
                    ? `${styles.thumb} ${styles.thumbSelected}`
                    : styles.thumb
            }
            onClick={() => onSelect(item.slug)}
            aria-pressed={selected}
            data-showcase-thumb={item.slug}
            title={item.title}
        >
            <div className={styles.thumbMedia}>
                <ThumbImage
                    src={thumbSrc}
                    objectPosition={thumbObjectPosition}
                />
            </div>

            <div className={styles.thumbLabel}>
                <div className={styles.thumbTitle}>{item.title}</div>
                {item.subtitle ? (
                    <div className={styles.thumbSub}>
                        {/* Otherwise screen readers run the title into the subtitle. */}
                        <span className="visually-hidden">, </span>
                        {item.subtitle}
                    </div>
                ) : null}
            </div>
        </button>
    );
};

export type ShowcaseItemLink = {
    label: string;
    href: string;
    icon?: IconDefinition;
    /** Force opening the link in a new tab/window (or keep it in the same tab). */
    openInNewWindow?: boolean;
};

export type ShowcaseAsset =
    | {
          kind: "video";
          src: string;
          /** Optional audio controls for this specific video asset. */
          audio?: {
              /** When true, show an Audio On/Off toggle in the Showcase UI. */
              toggleable?: boolean;
              /** Default state when the item/asset becomes active. */
              defaultEnabled?: boolean;
              /** 0..1; defaults to 1 when enabled. */
              volume?: number;
          };
      }
    | { kind: "image"; src: string; alt?: string };

/**
 * Per-thumbnail object-position adjustments in percentage points.
 *
 * Example: `{ focus: { x: 0, y: -15 } }` moves the crop up a bit.
 */
export type ShowcaseThumbFocusAdjustment = {
    /** Horizontal adjustment from center in percentage points. */
    x?: number;
    /** Vertical adjustment from center in percentage points. */
    y?: number;
};

/** Thumbnail media for the carousel, with optional crop focus adjustment. */
export type ShowcaseThumbnailSource = ShowcaseAsset & {
    focus?: ShowcaseThumbFocusAdjustment;
};

export type ShowcaseScreenSourceEntry = ShowcaseAsset & {
    label?: string;
    icon?: IconDefinition;
};

export type ShowcaseScreenSource =
    | ShowcaseAsset
    | {
          primary: ShowcaseScreenSourceEntry;
          secondary?: ShowcaseScreenSourceEntry;
      };

export type ShowcaseScreenMedia = {
    sourceType: "video" | "image";
    source: string;
    audio?: { enabled: boolean; volume?: number };
};

const toScreenMedia = (
    asset: ShowcaseAsset,
    opts?: { audioEnabled?: boolean },
): ShowcaseScreenMedia => {
    if (asset.kind === "video") {
        const volume =
            typeof asset.audio?.volume === "number" ? asset.audio.volume : 1;
        const shouldIncludeAudio = opts?.audioEnabled === true;
        return {
            sourceType: "video",
            source: asset.src,
            audio: shouldIncludeAudio
                ? { enabled: true, volume }
                : { enabled: false },
        };
    }

    return { sourceType: "image", source: asset.src };
};

const getPrimaryScreenAsset = (
    screenSource?: ShowcaseScreenSource,
): ShowcaseScreenSourceEntry | undefined => {
    if (!screenSource) return undefined;
    return "kind" in screenSource ? screenSource : screenSource.primary;
};

const getSecondaryScreenAsset = (
    screenSource?: ShowcaseScreenSource,
): ShowcaseScreenSourceEntry | undefined => {
    if (!screenSource) return undefined;
    return "kind" in screenSource ? undefined : screenSource.secondary;
};

export type ShowcaseItem = {
    slug: string;
    title: string;
    subtitle?: string;
    /** Meta description for the item's page. Built from subtitle, year, and tags when missing. */
    description?: string;
    year?: string;
    tags?: string[];

    /** The media to send to the 3D screen (preferred). */
    screenSource?: ShowcaseScreenSource;

    /** Thumbnail media for the carousel. Prefer an image. */
    thumbnailSource?: ShowcaseThumbnailSource;

    links?: ShowcaseItemLink[];
    body?: React.ReactNode;
};

export type ShowcaseProps = {
    pageTitle: string;
    items: ShowcaseItem[];
    /** Section path, e.g. "/installations". Selecting an item moves the URL to `${basePath}/${slug}`. */
    basePath: string;
    /** Slug from the route; falls back to the first item when missing or unknown. */
    initialSlug?: string | null;
    onScreenMediaChange?: (media: ShowcaseScreenMedia | null) => void;
    /** Optional UI to render above the selected item's body (inside the description area). */
    renderBodyPrefix?: (item: ShowcaseItem) => React.ReactNode;
    /** Optional callback when the selected item changes. */
    onSelectedItemChange?: (item: ShowcaseItem | null) => void;
};

export const Showcase = ({
    pageTitle,
    items,
    basePath,
    initialSlug,
    onScreenMediaChange,
    renderBodyPrefix,
    onSelectedItemChange,
}: ShowcaseProps) => {
    const router = useRouter();

    const dockId = React.useId();

    // Fade in when arriving from a page without a Showcase, but not when
    // switching sections, where the panel should look like it stayed put.
    const [shouldFadeIn] = React.useState(() => mountedShowcaseCount === 0);

    React.useEffect(() => {
        mountedShowcaseCount += 1;
        return () => {
            mountedShowcaseCount -= 1;
        };
    }, []);

    const [isChromeVisible, setIsChromeVisible] = React.useState(
        () => lastChromeVisible ?? true,
    );

    React.useEffect(() => {
        // Only on the first Showcase of the visit; after that the module
        // value is current and already used as the initial state.
        if (lastChromeVisible !== null) return;
        try {
            const stored = window.localStorage.getItem(CHROME_STORAGE_KEY);
            if (stored === null) return;
            setIsChromeVisible(stored === "true");
        } catch {
            // no-op
        }
    }, []);

    React.useEffect(() => {
        lastChromeVisible = isChromeVisible;
        try {
            window.localStorage.setItem(
                CHROME_STORAGE_KEY,
                String(isChromeVisible),
            );
        } catch {
            // no-op
        }
    }, [isChromeVisible]);

    const arePreviewEqual = React.useCallback(
        (a: ShowcaseScreenMedia | null, b: ShowcaseScreenMedia | null) => {
            if (a === b) return true;
            if (!a || !b) return false;
            const aAudioEnabled = a.audio?.enabled === true;
            const bAudioEnabled = b.audio?.enabled === true;
            const aVol =
                typeof a.audio?.volume === "number" ? a.audio.volume : 1;
            const bVol =
                typeof b.audio?.volume === "number" ? b.audio.volume : 1;

            return (
                a.sourceType === b.sourceType &&
                a.source === b.source &&
                aAudioEnabled === bAudioEnabled &&
                (aAudioEnabled ? aVol === bVol : true)
            );
        },
        [],
    );

    const lastPreviewRef = React.useRef<ShowcaseScreenMedia | null>(null);
    const lastSelectedSlugRef = React.useRef<string | null>(null);

    const resolveSlug = (slug?: string | null) =>
        slug && items.some((i) => i.slug === slug)
            ? slug
            : (items[0]?.slug ?? "");

    const [selectedSlug, setSelectedSlug] = React.useState(() =>
        resolveSlug(initialSlug),
    );

    // Taps update the URL with a shallow replace, which leaves the route props
    // alone, so `initialSlug` only changes on a real navigation (e.g. a <Link>
    // to another project in this section). Follow it when it does.
    const [prevInitialSlug, setPrevInitialSlug] = React.useState(initialSlug);
    if (initialSlug !== prevInitialSlug) {
        setPrevInitialSlug(initialSlug);
        setSelectedSlug(resolveSlug(initialSlug));
    }

    const [isAltScreenSourceActive, setIsAltScreenSourceActive] =
        React.useState(false);
    const [isAudioEnabled, setIsAudioEnabled] = React.useState(false);

    const selectedItem = React.useMemo(() => {
        return items.find((i) => i.slug === selectedSlug) ?? items[0];
    }, [items, selectedSlug]);

    // Reset the per-item toggle when changing selection.
    React.useEffect(() => {
        setIsAltScreenSourceActive(false);
    }, [selectedSlug]);

    const activeScreenAsset = React.useMemo(() => {
        if (!selectedItem) return undefined;
        const secondary = getSecondaryScreenAsset(selectedItem.screenSource);
        const primary = getPrimaryScreenAsset(selectedItem.screenSource);
        return isAltScreenSourceActive && secondary ? secondary : primary;
    }, [selectedItem, isAltScreenSourceActive]);

    const isAudioToggleAvailable =
        activeScreenAsset?.kind === "video" &&
        activeScreenAsset.audio?.toggleable === true;

    // Reset audio state when switching items or the active asset.
    React.useEffect(() => {
        if (activeScreenAsset?.kind !== "video") {
            setIsAudioEnabled(false);
            return;
        }
        const nextDefault = activeScreenAsset.audio?.defaultEnabled === true;
        setIsAudioEnabled(nextDefault);
    }, [activeScreenAsset]);

    React.useEffect(() => {
        if (!selectedItem) return;

        if (lastSelectedSlugRef.current !== selectedItem.slug) {
            lastSelectedSlugRef.current = selectedItem.slug;
            onSelectedItemChange?.(selectedItem);
        }

        const preferred = activeScreenAsset;
        const fallback = selectedItem.thumbnailSource;

        const audioEnabled = isAudioToggleAvailable
            ? isAudioEnabled
            : preferred?.kind === "video" &&
              preferred.audio?.defaultEnabled === true;

        const next: ShowcaseScreenMedia | null = preferred
            ? toScreenMedia(preferred, { audioEnabled })
            : fallback
              ? toScreenMedia(fallback)
              : null;

        // Avoid infinite update loops when the parent passes a non-memoized callback
        // and we compute a fresh `{ sourceType, source }` object each render.
        if (!arePreviewEqual(lastPreviewRef.current, next)) {
            lastPreviewRef.current = next;
            onScreenMediaChange?.(next);
        }

        return () => {
            // Important in StrictMode: effects are intentionally mounted/unmounted twice
            // in development. If we keep the last preview cached, the second invocation
            // can be skipped while the parent has already cleared the override.
            lastPreviewRef.current = null;
        };
    }, [
        selectedItem,
        isAltScreenSourceActive,
        activeScreenAsset,
        isAudioEnabled,
        isAudioToggleAvailable,
        onScreenMediaChange,
        onSelectedItemChange,
        arePreviewEqual,
    ]);

    const primaryScreenAsset = getPrimaryScreenAsset(
        selectedItem?.screenSource,
    );
    const secondaryScreenAsset = getSecondaryScreenAsset(
        selectedItem?.screenSource,
    );

    const hasVideoToggle =
        primaryScreenAsset?.kind === "video" &&
        secondaryScreenAsset?.kind === "video";

    const primaryLabel = primaryScreenAsset?.label ?? "Video 1";
    const secondaryLabel = secondaryScreenAsset?.label ?? "Video 2";
    const nextLabel = isAltScreenSourceActive ? primaryLabel : secondaryLabel;

    const nextIcon = isAltScreenSourceActive
        ? primaryScreenAsset?.icon
        : secondaryScreenAsset?.icon;

    const carouselRef = React.useRef<HTMLDivElement>(null);

    const onSelect = React.useCallback(
        (slug: string) => {
            setSelectedSlug(slug);

            // Deep-link the selection. Shallow, so the page doesn't re-run its
            // data fetching or remount. Some embedded browsers / sandboxed
            // contexts throw a SecurityError when touching the History API.
            void router
                .replace(`${basePath}/${slug}`, undefined, {
                    shallow: true,
                    scroll: false,
                })
                .catch(() => {
                    // no-op (selection still works; URL just won't update)
                });

            const prefersReduced = window.matchMedia?.(
                "(prefers-reduced-motion: reduce)",
            ).matches;
            centerThumb(
                carouselRef.current,
                slug,
                prefersReduced ? "auto" : "smooth",
            );
        },
        [router, basePath],
    );

    // A deep link can select an item that starts scrolled out of the carousel
    // (e.g. /music/heist), so bring it into view on load and whenever a real
    // navigation changes the selection.
    React.useEffect(() => {
        if (initialSlug) centerThumb(carouselRef.current, initialSlug, "auto");
    }, [initialSlug]);

    const onCarouselKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (!selectedItem) return;
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();

            const idx = items.findIndex((i) => i.slug === selectedItem.slug);
            if (idx < 0) return;

            const next =
                e.key === "ArrowLeft"
                    ? (items[idx - 1] ?? items[items.length - 1])
                    : (items[idx + 1] ?? items[0]);

            if (next?.slug) onSelect(next.slug);
        },
        [items, selectedItem, onSelect],
    );

    const isDraggingRef = React.useRef(false);

    const bindCarouselDrag = useDrag(
        ({ active, movement: [mx], first, memo, event }) => {
            // Touch devices use native scrolling (momentum + snap); this only
            // adds click-and-drag scrolling for mouse users.
            const isMouse =
                "pointerType" in event && event.pointerType === "mouse";
            if (!isMouse) return memo;

            const el = carouselRef.current;
            if (!el) return memo;

            if (first) {
                isDraggingRef.current = false;
                return el.scrollLeft;
            }

            // Mark as dragging once past a small threshold so clicks still work.
            if (Math.abs(mx) > 3) {
                isDraggingRef.current = true;
            }

            el.scrollLeft = (memo as number) - mx;

            if (!active) {
                // Reset after a tick so the click handler can check.
                requestAnimationFrame(() => {
                    isDraggingRef.current = false;
                });
            }

            return memo;
        },
        { axis: "x", filterTaps: true },
    );

    // Ignore the click that fires when a mouse drag is released over a thumb.
    const onThumbClick = React.useCallback(
        (slug: string) => {
            if (isDraggingRef.current) return;
            onSelect(slug);
        },
        [onSelect],
    );

    if (!items.length) return null;

    return (
        <div
            className={
                shouldFadeIn
                    ? `${styles.wrap} ${styles.wrapFadeIn}`
                    : styles.wrap
            }
        >
            <button
                type="button"
                className={styles.chromeToggle}
                onClick={() => setIsChromeVisible((v) => !v)}
                aria-expanded={isChromeVisible}
                aria-controls={dockId}
            >
                <span className={styles.chromeToggleIcon} aria-hidden="true">
                    <FontAwesomeIcon
                        icon={isChromeVisible ? faEyeSlash : faEye}
                        fixedWidth
                    />
                </span>
                <span>{isChromeVisible ? "Hide UI" : "Show UI"}</span>
            </button>

            <div
                id={dockId}
                className={
                    isChromeVisible
                        ? styles.dock
                        : `${styles.dock} ${styles.dockHidden}`
                }
                aria-label={`${pageTitle} detail and items`}
                aria-hidden={!isChromeVisible}
            >
                {selectedItem ? (
                    <section
                        className={styles.detail}
                        aria-label="Selected item"
                    >
                        <div className={styles.detailTop}>
                            <div>
                                <h2 className={styles.itemTitle}>
                                    {selectedItem.title}
                                </h2>
                                {hasVideoToggle ? (
                                    <button
                                        type="button"
                                        className={styles.videoToggle}
                                        onClick={() =>
                                            setIsAltScreenSourceActive(
                                                (v) => !v,
                                            )
                                        }
                                        aria-pressed={isAltScreenSourceActive}
                                    >
                                        {nextIcon ? (
                                            <span
                                                className={
                                                    styles.videoToggleIcon
                                                }
                                                aria-hidden="true"
                                            >
                                                <FontAwesomeIcon
                                                    icon={nextIcon}
                                                    fixedWidth
                                                />
                                            </span>
                                        ) : null}
                                        Switch to {nextLabel}
                                    </button>
                                ) : null}

                                {isAudioToggleAvailable ? (
                                    <button
                                        type="button"
                                        className={styles.audioToggle}
                                        onClick={() =>
                                            setIsAudioEnabled((v) => !v)
                                        }
                                        aria-pressed={isAudioEnabled}
                                    >
                                        <span
                                            className={styles.audioToggleIcon}
                                            aria-hidden="true"
                                        >
                                            <FontAwesomeIcon
                                                icon={
                                                    isAudioEnabled
                                                        ? faVolumeHigh
                                                        : faVolumeXmark
                                                }
                                                fixedWidth
                                            />
                                        </span>
                                        Audio: {isAudioEnabled ? "On" : "Off"}
                                    </button>
                                ) : null}
                            </div>
                            {selectedItem.year ? (
                                <div className={styles.year} aria-label="Year">
                                    {selectedItem.year}
                                </div>
                            ) : null}
                        </div>

                        {selectedItem.tags?.length ? (
                            <div className={styles.tags} aria-label="Tags">
                                {selectedItem.tags.map((t) => (
                                    <span key={t} className={styles.tag}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                        ) : null}

                        {selectedItem.links?.length ? (
                            <div className={styles.links} aria-label="Links">
                                {selectedItem.links.map((l) =>
                                    (() => {
                                        const isInternal =
                                            l.href.startsWith("/");
                                        const shouldOpenInNewWindow =
                                            typeof l.openInNewWindow ===
                                            "boolean"
                                                ? l.openInNewWindow
                                                : !isInternal;
                                        const target = shouldOpenInNewWindow
                                            ? "_blank"
                                            : undefined;
                                        const rel = shouldOpenInNewWindow
                                            ? "noopener noreferrer"
                                            : undefined;

                                        return (
                                            <a
                                                key={`${selectedItem.slug}-${l.href}`}
                                                href={l.href}
                                                target={target}
                                                rel={rel}
                                                className={styles.link}
                                            >
                                                {l.icon ? (
                                                    <span
                                                        className={
                                                            styles.linkIcon
                                                        }
                                                        aria-hidden="true"
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={l.icon}
                                                            fixedWidth
                                                        />
                                                    </span>
                                                ) : null}
                                                {l.label}
                                            </a>
                                        );
                                    })(),
                                )}
                            </div>
                        ) : null}

                        {renderBodyPrefix || selectedItem.body ? (
                            <div className={styles.body}>
                                {selectedItem
                                    ? renderBodyPrefix?.(selectedItem)
                                    : null}
                                {selectedItem.body}
                            </div>
                        ) : null}
                    </section>
                ) : null}

                <div
                    className={styles.carousel}
                    aria-label={`${pageTitle} items`}
                >
                    <div
                        ref={carouselRef}
                        className={styles.carouselInner}
                        onKeyDown={onCarouselKeyDown}
                        {...bindCarouselDrag()}
                    >
                        {items.map((item) => {
                            const selected = item.slug === selectedItem?.slug;
                            return (
                                <ShowcaseThumb
                                    key={item.slug}
                                    item={item}
                                    selected={selected}
                                    onSelect={onThumbClick}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
