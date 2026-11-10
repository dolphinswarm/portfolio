import * as React from "react";
import { useRouter } from "next/router";
import type { GetStaticPaths, GetStaticProps } from "next";
import { SEO } from "@/components/SEO";
import { useSceneVideo } from "@/context/SceneVideoContext";
import OG_IMAGES from "@/data/og-images.json";
import type { Section } from "@/data/sections";
import {
    Showcase,
    type ShowcaseItem,
    type ShowcaseProps,
    type ShowcaseScreenMedia,
} from "./Showcase";

/** Props from getStaticProps for a `[[...slug]]` section page. */
export type ShowcasePageProps = {
    /** The project in the URL, or null on the section page itself. */
    slug: string | null;
};

/** Every section page is built at its own path plus one path per project. */
export const getShowcaseStaticPaths =
    (items: ShowcaseItem[]): GetStaticPaths =>
    async () => ({
        paths: [
            { params: { slug: [] } },
            ...items.map((item) => ({ params: { slug: [item.slug] } })),
        ],
        fallback: false,
    });

export const getShowcaseStaticProps: GetStaticProps<
    ShowcasePageProps
> = async ({ params }) => {
    const slug = Array.isArray(params?.slug) ? params.slug[0] : undefined;
    return { props: { slug: slug ?? null } };
};

/** Fallback meta description for items without their own. */
const describeItem = (item: ShowcaseItem) =>
    item.description ??
    [
        item.subtitle && item.year
            ? `${item.subtitle} (${item.year}).`
            : (item.subtitle ?? item.year),
        item.tags?.length ? `${item.tags.join(", ")}.` : undefined,
        "By Brad Schmitz.",
    ]
        .filter(Boolean)
        .join(" ");

/** The item's link-preview image from scripts/make-og-images.mjs, if it has one. */
const getItemImage = (section: Section, item: ShowcaseItem) => {
    const key = `${section.id}/${item.slug}`;
    return OG_IMAGES.includes(key) ? `/og/${key}.jpg` : undefined;
};

/** A section page: SEO, the hidden heading, and a Showcase wired to the 3D screen. */
export const ShowcasePage = ({
    section,
    items,
    slug,
    showcaseProps,
    children,
}: {
    section: Section;
    items: ShowcaseItem[];
    slug: string | null;
    /** Extra Showcase props, e.g. the Music page's player bar. */
    showcaseProps?: Pick<
        ShowcaseProps,
        "renderBodyPrefix" | "onSelectedItemChange"
    >;
    children?: React.ReactNode;
}) => {
    const router = useRouter();
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

    // Follow the URL, not just the props: picking a project does a shallow
    // replace, which updates router.query but not the page props.
    const routeSlug = Array.isArray(router.query.slug)
        ? router.query.slug[0]
        : slug;
    const item = routeSlug
        ? items.find((i) => i.slug === routeSlug)
        : undefined;

    return (
        <>
            {item ? (
                <SEO
                    title={item.title}
                    description={describeItem(item)}
                    path={`${section.path}/${item.slug}`}
                    image={getItemImage(section, item)}
                />
            ) : (
                <SEO
                    title={section.seoTitle}
                    description={section.seoDescription}
                    path={section.path}
                />
            )}
            <h1 className="visually-hidden">{section.heading}</h1>

            <Showcase
                pageTitle={section.label}
                items={items}
                basePath={section.path}
                initialSlug={slug}
                onScreenMediaChange={onScreenMediaChange}
                {...showcaseProps}
            />
            {children}
        </>
    );
};
