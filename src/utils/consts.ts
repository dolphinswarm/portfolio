/** A list of all the pages on the site. */
export const pages = [
    "home",
    "about",
    "code",
    "music",
    "visuals",
    "bork",
] as const;

export type Page = (typeof pages)[number];
