/** A list of all the pages on the site. */
export const pages = [
    "home",
    "about",
    "installations",
    "xr-games",
    "apps",
    "music",
    "bork",
] as const;

export type Page = (typeof pages)[number];
