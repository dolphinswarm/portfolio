/** The canonical origin of the deployed site (no trailing slash). */
export const SITE_URL = "https://bradschmitz.com";

export const SITE_NAME = "Brad Schmitz";

/** Short role line shown in the header and the homepage lower third. */
export const SITE_ROLE = "Creative Technologist & Musician";

/** Default social share image (1200x630), relative to SITE_URL. */
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

export const CONTACT_EMAIL = "brad.j.schmitz@gmail.com";

export const RESUME_PATH = "/resume.pdf";

export type SocialNetwork =
    | "github"
    | "linkedin"
    | "youtube"
    | "soundcloud"
    | "instagram";

/** Public profiles, in display order. */
export const SOCIAL_LINKS: {
    network: SocialNetwork;
    label: string;
    href: string;
}[] = [
    {
        network: "linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/bradley-schmitz/",
    },
    {
        network: "github",
        label: "GitHub",
        href: "https://github.com/dolphinswarm",
    },
    {
        network: "youtube",
        label: "YouTube",
        href: "https://www.youtube.com/@brad.j.schmitz",
    },
    {
        network: "soundcloud",
        label: "SoundCloud",
        href: "https://soundcloud.com/dolphinswarm",
    },
    {
        network: "instagram",
        label: "Instagram",
        href: "https://www.instagram.com/dolphinswarm.music/",
    },
];

/** Profile URLs for the Person structured data. */
export const SOCIAL_PROFILES = SOCIAL_LINKS.map((link) => link.href);
