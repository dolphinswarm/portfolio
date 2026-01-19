import Link from "next/link";
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

    const isActiveHref = (href: string) => {
        if (href === "/") return router.pathname === "/";
        return router.pathname === href;
    };

    return (
        <>
            <header className={styles.topHeader}>
                <div className={styles.topInner}>
                    <Link className={styles.brand} href="/" aria-label="Go to home">
                        Portfolio
                    </Link>

                    <nav className={styles.topNav} aria-label="Primary">
                        {NAV_ITEMS.map((item) => {
                            const active = isActiveHref(item.href);
                            const className = active
                                ? `${styles.topLink} ${styles.topLinkActive}`
                                : styles.topLink;

                            return (
                                <Link
                                    key={item.page}
                                    href={item.href}
                                    className={className}
                                    aria-current={active ? "page" : undefined}
                                >
                                    {item.label}
                                </Link>
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
                        <Link
                            key={item.page}
                            href={item.href}
                            className={className}
                            aria-current={active ? "page" : undefined}
                            aria-label={item.label}
                        >
                            <span className={styles.bottomIcon} aria-hidden="true">
                                <FontAwesomeIcon icon={item.icon} fixedWidth />
                            </span>
                            <span className={styles.bottomLabel}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
};
