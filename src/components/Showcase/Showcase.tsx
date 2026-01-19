import React from "react";
import { useRouter } from "next/router";
import styles from "./Showcase.module.scss";

export type ShowcaseItemLink = {
    label: string;
    href: string;
};

export type ShowcaseMedia =
    | { kind: "video"; src: string }
    | { kind: "image"; src: string; alt?: string };

export type ShowcaseItem = {
    slug: string;
    title: string;
    subtitle?: string;
    year?: string;
    tags?: string[];

    /** Video to send to the 3D screen. */
    previewVideoSrc?: string;

    /** Optional thumbnail (recommended for mobile). */
    previewImageSrc?: string;

    links?: ShowcaseItemLink[];
    media?: ShowcaseMedia;
    body?: React.ReactNode;
};

export const Showcase = ({
    pageTitle,
    pageSubtitle,
    items,
    queryKey,
    onPreviewVideoSrcChange,
}: {
    pageTitle: string;
    pageSubtitle?: string;
    items: ShowcaseItem[];
    queryKey: string;
    onPreviewVideoSrcChange?: (src: string) => void;
}) => {
    const router = useRouter();

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
        setSelectedSlug(initial);
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
            try {
                void router.replace({ pathname: router.pathname, query: nextQuery }, undefined, {
                    shallow: true,
                    scroll: false,
                });
            } catch {
                // no-op (selection still works; URL just won't update)
            }
        }

        const src =
            selectedItem.previewVideoSrc ??
            (selectedItem.media?.kind === "video" ? selectedItem.media.src : undefined);
        if (src) onPreviewVideoSrcChange?.(src);
    }, [router, router.isReady, router.pathname, selectedItem, queryKey, onPreviewVideoSrcChange]);

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
            <header className={styles.header}>
                <h1 className={styles.title}>{pageTitle}</h1>
                {pageSubtitle ? <p className={styles.subtitle}>{pageSubtitle}</p> : null}
            </header>

            {selectedItem ? (
                <section className={styles.detail} aria-label="Selected item">
                    <div className={styles.detailTop}>
                        <div>
                            <h2 className={styles.itemTitle}>{selectedItem.title}</h2>
                            {selectedItem.subtitle ? (
                                <div className={styles.itemSubtitle}>{selectedItem.subtitle}</div>
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
                            {selectedItem.links.map((l) => (
                                <a
                                    key={`${selectedItem.slug}-${l.href}`}
                                    href={l.href}
                                    target={l.href.startsWith("/") ? undefined : "_blank"}
                                    rel={l.href.startsWith("/") ? undefined : "noreferrer"}
                                    className={styles.link}
                                >
                                    {l.label}
                                </a>
                            ))}
                        </div>
                    ) : null}

                    {selectedItem.body ? (
                        <div className={styles.body}>{selectedItem.body}</div>
                    ) : null}
                </section>
            ) : null}

            <div className={styles.carousel} aria-label={`${pageTitle} items`}>
                <div className={styles.carouselInner} onKeyDown={onCarouselKeyDown}>
                    {items.map((item) => {
                        const selected = item.slug === selectedItem?.slug;
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
                                    {item.previewImageSrc ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={item.previewImageSrc}
                                            alt=""
                                            className={styles.thumbImg}
                                            loading="lazy"
                                        />
                                    ) : selected && item.previewVideoSrc ? (
                                        <video
                                            className={styles.thumbVideo}
                                            src={item.previewVideoSrc}
                                            muted
                                            playsInline
                                            loop
                                            autoPlay
                                            preload="metadata"
                                        />
                                    ) : (
                                        <div className={styles.thumbFallback}>
                                            <div className={styles.thumbFallbackTitle}>{item.title}</div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.thumbLabel}>
                                    <div className={styles.thumbTitle}>{item.title}</div>
                                    {item.subtitle ? (
                                        <div className={styles.thumbSub}>{item.subtitle}</div>
                                    ) : null}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
