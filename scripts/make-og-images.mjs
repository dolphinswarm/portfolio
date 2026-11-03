// Make a 1200x630 link-preview image for every project page, from its screen
// video (a single frame) or its screen/thumbnail image.
//
// Writes public/og/<section>/<slug>.jpg and src/data/og-images.json, the list
// ShowcasePage checks so pages without an image fall back to the site default.
// Rerun after adding a project:
//
//   node scripts/make-og-images.mjs              # every project
//   node scripts/make-og-images.mjs futerra      # only slugs matching
//
// Requires ffmpeg and ffprobe (winget install Gyan.FFmpeg).

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SECTIONS = ["installations", "xr-games", "apps", "music"];
const WIDTH = 1200;
const HEIGHT = 630;
const MANIFEST = path.join(ROOT, "src/data/og-images.json");

// Where in each video to grab the frame, as a fraction of its length. Tweak
// per slug when the default lands on a black or uninteresting frame.
const DEFAULT_FRAME_AT = 0.3;
const FRAME_AT = {
    "upham-arch-interactive-projection": 0.5,
    "ninjas-vs-knights": 0.1,
};

// Use a different source than the project's screen media.
const SOURCE = {
    // Its screen plays the demo reel; the site's own 3D scene suits it better.
    "r3f-portfolio": "/og-image.jpg",
};

const filter = process.argv[2] ?? "";

/** Each project's slug and the media to build its image from. */
const readProjects = (section) => {
    const source = fs
        .readFileSync(path.join(ROOT, `src/data/${section}.tsx`), "utf8")
        .replace(/\r\n/g, "\n");
    const entries = source
        .split(/(?=^ {4}\{\n {8}slug:)/m)
        .filter((entry) => /^ {4}\{\n {8}slug:/.test(entry));

    return entries.map((entry) => {
        const slug = entry.match(/slug: "([^"]+)"/)[1];
        const srcAfter = (key) => {
            const at = entry.indexOf(`${key}:`);
            return at < 0 ? undefined : entry.slice(at).match(/src: "([^"]+)"/)?.[1];
        };
        // The screen's primary media first; Music items only have a thumbnail.
        const src =
            SOURCE[slug] ?? srcAfter("screenSource") ?? srcAfter("thumbnailSource");
        if (!src) throw new Error(`${section}/${slug}: no screen or thumbnail media`);
        return { section, slug, src };
    });
};

const probe = (file) => {
    const out = execFileSync(
        "ffprobe",
        ["-v", "error", "-select_streams", "v:0", "-show_entries",
            "stream=width,height:format=duration", "-of", "json", file],
        { encoding: "utf8" },
    );
    const json = JSON.parse(out);
    const { width, height } = json.streams[0];
    return { width, height, duration: Number(json.format?.duration) || 0 };
};

const isVideo = (file) => /\.(mp4|mov|webm)$/i.test(file);

const makeImage = ({ section, slug, src }) => {
    const input = path.join(ROOT, "public", src);
    const output = path.join(ROOT, "public/og", section, `${slug}.jpg`);
    fs.mkdirSync(path.dirname(output), { recursive: true });

    const { width, height, duration } = probe(input);
    const seek = isVideo(input)
        ? ["-ss", String(duration * (FRAME_AT[slug] ?? DEFAULT_FRAME_AT))]
        : [];

    // Wide sources fill the frame (center crop). Tall or square ones would
    // lose most of the picture that way, so they sit whole over a blurred,
    // enlarged copy of themselves.
    const cover = `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=increase,crop=${WIDTH}:${HEIGHT}`;
    const vf =
        width / height >= 1.5
            ? cover
            : `split[bg][fg];[bg]${cover},boxblur=24:2,eq=brightness=-0.12[bg2];` +
              `[fg]scale=-2:${HEIGHT}[fg2];[bg2][fg2]overlay=(W-w)/2:0`;

    execFileSync(
        "ffmpeg",
        ["-nostdin", "-hide_banner", "-loglevel", "error", "-y", ...seek,
            "-i", input, "-frames:v", "1", "-filter_complex", vf, "-q:v", "4", output],
    );
    return `${section}/${slug}`;
};

const projects = SECTIONS.flatMap(readProjects);
const made = [];
for (const project of projects) {
    if (filter && !project.slug.includes(filter)) continue;
    console.log(`==> ${project.section}/${project.slug}`);
    made.push(makeImage(project));
}

// The manifest lists every image on disk, not just this run's, so a filtered
// run doesn't drop the others.
const onDisk = projects
    .map(({ section, slug }) => `${section}/${slug}`)
    .filter((key) => fs.existsSync(path.join(ROOT, "public/og", `${key}.jpg`)));
fs.writeFileSync(MANIFEST, `${JSON.stringify(onDisk, null, 4)}\n`);

console.log(`\n${made.length} made, ${onDisk.length} in ${path.relative(ROOT, MANIFEST)}`);
