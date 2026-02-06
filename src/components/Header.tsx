import React from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faHouse,
    faUser,
    faCode,
    faMusic,
    faImages,
    faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import type { Page } from "@/utils/consts";
import styles from "@/styles/Nav.module.scss";

type NavItem = {
    page: Page;
    href: string;
    label: string;
    icon: IconDefinition;
};

const NAV_ITEMS: NavItem[] = [
    { page: "home", href: "/", label: "Home", icon: faHouse },
    { page: "about", href: "/about", label: "About", icon: faUser },
    { page: "code", href: "/code", label: "Code", icon: faCode },
    { page: "visuals", href: "/visuals", label: "Visuals", icon: faImages },
    { page: "music", href: "/music", label: "Music", icon: faMusic },
    { page: "connect", href: "/connect", label: "Connect", icon: faPaperPlane },
];

export const Header = () => {
    const router = useRouter();

    const canUseHistoryRef = React.useRef<boolean>(true);

    React.useEffect(() => {
        // Some embedded/sandboxed browsers block History API operations, which Next's
        // client-side router depends on (pushState/replaceState). If that's the case,
        // we should let normal anchor navigation occur instead of preventing default.
        try {
            if (typeof window === "undefined") return;
            window.history.replaceState(
                window.history.state,
                "",
                window.location.href,
            );
            canUseHistoryRef.current = true;
        } catch {
            canUseHistoryRef.current = false;
        }
    }, []);

    const onNavClick = React.useCallback(
        (href: string) => async (e: React.MouseEvent<HTMLAnchorElement>) => {
            // Let the browser handle new-tab / modified clicks.
            if (
                e.defaultPrevented ||
                e.button !== 0 ||
                e.metaKey ||
                e.ctrlKey ||
                e.shiftKey ||
                e.altKey
            ) {
                return;
            }

            // External links: default browser behavior.
            if (/^https?:\/\//i.test(href)) return;

            // If History API is blocked, allow the browser to handle navigation.
            if (!canUseHistoryRef.current) return;

            e.preventDefault();

            try {
                await router.push(href);
            } catch {
                // If client-side routing failed, fall back to normal anchor navigation
                // next time. (We can't safely force navigation here in sandboxed contexts.)
                canUseHistoryRef.current = false;
            }
        },
        [router],
    );

    const isActiveHref = (href: string) => {
        if (href === "/") return router.pathname === "/";
        return router.pathname === href;
    };

    return (
        <>
            <header className={styles.topHeader}>
                <div className={styles.topInner}>
                    <a
                        className={`${styles.brand} handwritten`}
                        href="/"
                        aria-label="Go to home"
                        onClick={onNavClick("/")}
                    >
                        Brad Schmitz
                    </a>

                    <nav className={styles.topNav} aria-label="Primary">
                        {NAV_ITEMS.map((item) => {
                            const active = isActiveHref(item.href);
                            const className = active
                                ? `${styles.topLink} ${styles.topLinkActive}`
                                : styles.topLink;

                            return (
                                <a
                                    key={item.page}
                                    href={item.href}
                                    className={className}
                                    aria-current={active ? "page" : undefined}
                                    onClick={onNavClick(item.href)}
                                >
                                    {item.label}
                                </a>
                            );
                        })}
                    </nav>
                </div>
            </header>

            <nav className={styles.bottomNav} aria-label="Primary">
                {NAV_ITEMS.map((item) => {
                    const active = isActiveHref(item.href);
                    const className = active
                        ? `${styles.bottomItem} ${styles.bottomItemActive}`
                        : styles.bottomItem;

                    return (
                        <a
                            key={item.page}
                            href={item.href}
                            className={className}
                            aria-current={active ? "page" : undefined}
                            aria-label={item.label}
                            onClick={onNavClick(item.href)}
                        >
                            <span
                                className={styles.bottomIcon}
                                aria-hidden="true"
                            >
                                <FontAwesomeIcon icon={item.icon} fixedWidth />
                            </span>
                            <span className={styles.bottomLabel}>
                                {item.label}
                            </span>
                        </a>
                    );
                })}
            </nav>
        </>
    );
};
