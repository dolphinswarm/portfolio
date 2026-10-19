import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
    faCheck,
    faCopy,
    faEnvelope,
    faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import {
    faGithub,
    faInstagram,
    faLinkedin,
    faSoundcloud,
    faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
    CONTACT_EMAIL,
    RESUME_PATH,
    SOCIAL_LINKS,
    type SocialNetwork,
} from "@/utils/site";
import styles from "./ContactLinks.module.scss";

const SOCIAL_ICONS: Record<SocialNetwork, IconDefinition> = {
    github: faGithub,
    linkedin: faLinkedin,
    youtube: faYoutube,
    soundcloud: faSoundcloud,
    instagram: faInstagram,
};

/** Email (with copy), resume, and social profile links. */
export const ContactLinks = () => {
    const [copied, setCopied] = React.useState(false);

    const handleCopyEmail = async () => {
        try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
        } catch {
            // If clipboard is blocked, the mailto link is still available.
        }
    };

    return (
        <section
            id="contact"
            className={styles.contact}
            aria-labelledby="contact-heading"
        >
            <h2 id="contact-heading" className="visually-hidden">
                Contact
            </h2>

            <div className={styles.primaryRow}>
                <a className={styles.email} href={`mailto:${CONTACT_EMAIL}`}>
                    <FontAwesomeIcon icon={faEnvelope} fixedWidth />
                    {CONTACT_EMAIL}
                </a>
                <button
                    type="button"
                    className={styles.button}
                    onClick={handleCopyEmail}
                    disabled={copied}
                >
                    <FontAwesomeIcon
                        icon={copied ? faCheck : faCopy}
                        fixedWidth
                    />
                    <span aria-live="polite">
                        {copied ? "Copied" : "Copy email"}
                    </span>
                </button>
                <a
                    className={styles.button}
                    href={RESUME_PATH}
                    target="_blank"
                    rel="noreferrer"
                >
                    <FontAwesomeIcon icon={faFilePdf} fixedWidth />
                    Resume
                </a>
            </div>

            <ul className={styles.socials} aria-label="Profiles">
                {SOCIAL_LINKS.map((link) => (
                    <li key={link.network}>
                        <a
                            className={styles.social}
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <FontAwesomeIcon
                                icon={SOCIAL_ICONS[link.network]}
                                fixedWidth
                            />
                            {link.label}
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
};
