import React from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "./Showcase.module.scss";

const FALLBACK_THUMB_SRC = "/branding/img/thumbs/placeholder.svg";

const ThumbImage = ({
    src,
    title,
}: {
    src: string;
    title: string;
}) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={title} className={styles.thumbImg} loading="lazy" />;
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
    const explicitThumb =
        (item.thumbnailSource?.kind === "image" ? item.thumbnailSource.src : undefined) ??
        (item.screenSource?.kind === "image" ? item.screenSource.src : undefined);

    const thumbSrc = explicitThumb ?? FALLBACK_THUMB_SRC;

    return (
        <button
            key={item.slug}
            type="button"
            className={selected ? `${styles.thumb} ${styles.thumbSelected}` : styles.thumb}
            onClick={() => onSelect(item.slug)}
            aria-pressed={selected}
            data-showcase-thumb={item.slug}
            title={item.title}
        >
            <div className={styles.thumbMedia}>
                <ThumbImage src={thumbSrc} title={item.title} />
            </div>

            <div className={styles.thumbLabel}>
                <div className={styles.thumbTitle}>{item.title}</div>
                {item.subtitle ? <div className={styles.thumbSub}>{item.subtitle}</div> : null}
            </div>
        </button>
    );
};

export type ShowcaseItemLink = {
    label: string;
    href: string;
    icon?: IconDefinition;
};

export type ShowcaseAsset =
    | { kind: "video"; src: string }
    | { kind: "image"; src: string; alt?: string };

export type ShowcaseScreenMedia = {
    sourceType: "video" | "image";
    source: string;
};

const toScreenMedia = (asset: ShowcaseAsset): ShowcaseScreenMedia => {
    return { sourceType: asset.kind, source: asset.src };
};

export type ShowcaseItem = {
    slug: string;
    title: string;
    subtitle?: string;
    year?: string;
    tags?: string[];

    /** The media to send to the 3D screen (preferred). */
    screenSource?: ShowcaseAsset;

    /** Thumbnail media for the carousel. Prefer an image. */
    thumbnailSource?: ShowcaseAsset;

    links?: ShowcaseItemLink[];
    body?: React.ReactNode;
};

export const Showcase = ({
    pageTitle,
    items,
    queryKey,
    onScreenMediaChange,
}: {
    pageTitle: string;
    items: ShowcaseItem[];
    queryKey: string;
    onScreenMediaChange?: (media: ShowcaseScreenMedia | null) => void;
}) => {
    const router = useRouter();

    const dockId = React.useId();

    const chromeStorageKey = React.useMemo(
        () => `showcase:${queryKey}:${pageTitle}:chromeVisible`,
        [queryKey, pageTitle],
    );
    const [isChromeVisible, setIsChromeVisible] = React.useState(true);

    React.useEffect(() => {
        try {
            const stored = window.localStorage.getItem(chromeStorageKey);
            if (stored === null) return;
            setIsChromeVisible(stored === "true");
        } catch {
            // no-op
        }
    }, [chromeStorageKey]);

    React.useEffect(() => {
        try {
            window.localStorage.setItem(chromeStorageKey, String(isChromeVisible));
        } catch {
            // no-op
        }
    }, [chromeStorageKey, isChromeVisible]);

    const arePreviewEqual = React.useCallback(
        (a: ShowcaseScreenMedia | null, b: ShowcaseScreenMedia | null) => {
            if (a === b) return true;
            if (!a || !b) return false;
            return a.sourceType === b.sourceType && a.source === b.source;
        },
        [],
    );

    const lastPreviewRef = React.useRef<ShowcaseScreenMedia | null>(null);

    const getInitialSlug = React.useCallback(() => {
        const q = router.query?.[queryKey];
        const requested = Array.isArray(q) ? q[0] : q;
        if (typeof requested === "string" && items.some((i) => i.slug === requested)) {
            return requested;
        }
        return items[0]?.slug ?? "";
    }, [router.query, queryKey, items]);

    const [selectedSlug, setSelectedSlug] = React.useState<string>(() =>
        items[0]?.slug ? items[0].slug : "",
    );

    React.useEffect(() => {
        if (!router.isReady) return;
        const initial = getInitialSlug();
        setSelectedSlug((prev) => (prev === initial ? prev : initial));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady, getInitialSlug]);

    const selectedItem = React.useMemo(() => {
        return items.find((i) => i.slug === selectedSlug) ?? items[0];
    }, [items, selectedSlug]);

    React.useEffect(() => {
        if (!router.isReady) return;
        if (!selectedItem) return;

        // Sync selection to the URL (deep-linking). Some embedded browsers / sandboxed
        // contexts can throw a SecurityError when touching the History API.
        const currentQ = router.query?.[queryKey];
        const currentSlug = Array.isArray(currentQ) ? currentQ[0] : currentQ;
        const shouldSyncUrl = typeof currentSlug !== "string" || currentSlug !== selectedItem.slug;

        if (shouldSyncUrl) {
            const nextQuery = { ...router.query, [queryKey]: selectedItem.slug };
            void router
                .replace({ pathname: router.pathname, query: nextQuery }, undefined, {
                    shallow: true,
                    scroll: false,
                })
                .catch(() => {
                    // no-op (selection still works; URL just won't update)
                });
        }

        const preferred = selectedItem.screenSource;
        const fallback = selectedItem.thumbnailSource;

        const next: ShowcaseScreenMedia | null = preferred
            ? toScreenMedia(preferred)
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
        router,
        router.isReady,
        router.pathname,
        selectedItem,
        queryKey,
        onScreenMediaChange,
        arePreviewEqual,
    ]);

    const onSelect = React.useCallback((slug: string) => {
        setSelectedSlug(slug);

        // Keep the selected thumb centered when possible.
        const el = document.querySelector(`[data-showcase-thumb='${slug}']`);
        if (el instanceof HTMLElement) {
            const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")
                .matches;
            el.scrollIntoView({
                behavior: prefersReduced ? "auto" : "smooth",
                block: "nearest",
                inline: "center",
            });
        }
    }, []);

    const onCarouselKeyDown = React.useCallback(
        (e: React.KeyboardEvent) => {
            if (!selectedItem) return;
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();

            const idx = items.findIndex((i) => i.slug === selectedItem.slug);
            if (idx < 0) return;

            const next =
                e.key === "ArrowLeft" ? items[idx - 1] ?? items[items.length - 1] : items[idx + 1] ?? items[0];

            if (next?.slug) onSelect(next.slug);
        },
        [items, selectedItem, onSelect],
    );

    if (!items.length) return null;

    return (
        <div className={styles.wrap}>
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
                    isChromeVisible ? styles.dock : `${styles.dock} ${styles.dockHidden}`
                }
                aria-label={`${pageTitle} detail and items`}
                aria-hidden={!isChromeVisible}
            >
                {selectedItem ? (
                    <section className={styles.detail} aria-label="Selected item">
                        <div className={styles.detailTop}>
                            <div>
                                <h2 className={styles.itemTitle}>{selectedItem.title}</h2>
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
                                {selectedItem.links.map((l) => (
                                    <a
                                        key={`${selectedItem.slug}-${l.href}`}
                                        href={l.href}
                                        target={l.href.startsWith("/") ? undefined : "_blank"}
                                        rel={l.href.startsWith("/") ? undefined : "noreferrer"}
                                        className={styles.link}
                                    >
                                        {l.icon ? (
                                            <span className={styles.linkIcon} aria-hidden="true">
                                                <FontAwesomeIcon icon={l.icon} fixedWidth />
                                            </span>
                                        ) : null}
                                        {l.label}
                                    </a>
                                ))}
                            </div>
                        ) : null}

                        {selectedItem.body ? (
                            <div className={styles.body}>
                                {selectedItem.body}
                            </div>
                        ) : null}
                    </section>
                ) : null}

                <div className={styles.carousel} aria-label={`${pageTitle} items`}>
                    <div
                        className={styles.carouselInner}
                        onKeyDown={onCarouselKeyDown}
                    >
                        {items.map((item) => {
                            const selected = item.slug === selectedItem?.slug;
                            return (
                                <ShowcaseThumb
                                    key={item.slug}
                                    item={item}
                                    selected={selected}
                                    onSelect={onSelect}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
