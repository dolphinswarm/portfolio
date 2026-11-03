# Portfolio Improvement Plan

Action items from the site review on 2026-10-19. Check items off as they land.

Effort: **S** = under an hour, **M** = a few hours, **L** = a day or more.

---

## Phase 1: Quick wins (low risk, high impact)

### Homepage and positioning

- [x] **S** Add a visible hero over the 3D scene on the homepage: an `<h1>` with name, a one-line pitch (e.g. "Creative technologist building projection-mapped, XR and audio-reactive experiences. Denver, CO."), and two buttons: "Watch reel" and "See work". The homepage currently renders no text at all. ([index.tsx](../src/pages/index.tsx)) (Built, then removed: the visible card didn't fit the scene. The homepage keeps a screen-reader-only `<h1>`.)
- [x] **S** Add one `<h1>` to every page. None exist today except `/bork`.

### SEO basics

- [x] **M** Create a shared `<SEO>` component (title, description, canonical, Open Graph, Twitter card) and use it on every page.
    - About and Connect have no `<title>` or description at all.
    - Code / Visuals / Music titles are just one word. Use titles like "Projection Mapping & Immersive Installations | Brad Schmitz".
- [x] **S** Make a 1200×630 Open Graph image (a still from the 3D scene works well). This controls how links look on LinkedIn and Slack.
- [x] **S** Add `Person` JSON-LD to the homepage: `name`, `alternateName: "Bradley Schmitz"`, `jobTitle`, Denver address, `alumniOf` Miami University, and `sameAs` with GitHub, LinkedIn, YouTube, SoundCloud and Instagram.
- [x] **S** Add `robots.txt` and `sitemap.xml`. Mark `/bork` as `noindex`.
- [x] **S** Verify the site in Google Search Console and submit the sitemap. (Sitemap status: Success, 2026-10-20.)
- [x] **S** Fix [site.webmanifest](../public/favicon/site.webmanifest): fill in `name`/`short_name`, fix icon paths (missing `/favicon/`), and change `theme_color`/`background_color` from white to the site's dark color.

### Copy fixes

- [x] **S** Typo "Portofolio" in the homepage description. ([index.tsx:10](../src/pages/index.tsx#L10))
- [x] **S** "there is also various questions" → "there are also various questions". ([code.tsx:51](../src/pages/code.tsx#L51))

### Code hygiene

- [x] **S** Replace the create-next-app boilerplate [README.md](../README.md) with a screenshot, the stack, and a short architecture note. The "3D Portfolio" project links to this repo, so reviewers will read it.
- [x] **S** Add `@use-gesture/react` to `package.json`. It's imported in [Showcase.tsx:11](../src/components/Showcase/Showcase.tsx#L11) but only installed transitively through drei.
- [x] **S** Remove duplicate `viewport` and favicon tags from individual pages. They conflict with `_document` (they drop `viewport-fit=cover`).
- [x] ~~Remove the duplicate font variable classes~~ Not actually duplicates: `next/font` only loads its CSS from app-bundle modules, so the classes in [Layout.tsx](../src/components/Layout.tsx) are what load the fonts. Left as is.
- [x] **S** Delete unused `src/styles/Home.module.scss`.

---

## Phase 2: Performance and assets

- [x] **M** Re-encode the homepage reel. `demo-reel.mp4` is 85 MB and loads with `preload="auto"` on first visit. Target 720p, about 8–15 MB, with `-movflags +faststart`. Use [scripts/encode-videos.sh](../scripts/encode-videos.sh). (Done 2026-10-20: 85 MB → 4.6 MB.)
- [x] **M** Re-encode the showcase clips (currently 40–80 MB each) to about 5–10 MB with the same script. Audio is kept because the scene has an audio toggle. Clips stay full length for now; trimming them to shorter loops is a separate content decision. (Done 2026-10-20 at CRF 26; most clips are now 1–10 MB. On 2026-11-03 `fort-knox` and `denver-night-lights` were re-encoded from the originals at CRF 28: 22.6 → 18.0 MB and 16.3 → 12.8 MB. They're long (3:15 and 2:07), so getting under 10 MB means trimming them.)
- [x] **S** Generate ~600 px WebP/AVIF thumbnails. `vrchery.png` is 4 MB and only used as a thumbnail. (Done for Code and Visuals at 480 px: 24.9 MB → 270 KB. Music thumbnails left full-size because they double as the screen image.)
- [x] **S** Switch the static effect to the 409 KB `public/videos/tv-static.mp4` instead of the 14 MB `branding/videos/tv-static.mp4`, if it looks the same. (Not possible: that file was a different clip. Re-encoded the real one instead: 14 MB → 3.6 MB, 720p30, 1.2 s loop, no audio. Later replaced entirely by the channel-static shader; the video was deleted.)
- [x] **S** Delete unused assets (~140 MB): (Done. Also removed duplicate `public/videos/tv-static.mp4` and `public/img/thumbs/placeholder.svg`. Full-size originals of converted thumbnails were kept as source material.)
    - `public/branding/img/visuals/me-poet-shack.jpg` (17 MB)
    - `public/branding/img/visuals/futerra.jpg` (12 MB)
    - `public/branding/img/visuals/shack-video.png`
    - `public/branding/img/code/poets-shack-website.png`
    - `public/branding/img/code/simpsons-statistics.png`
    - `public/branding/videos/demo-reel.mov` (36 MB)
    - `public/branding/videos/music.mp4` (58 MB)
    - `public/branding/videos/code.mp4` (9 MB)
    - `public/threejs/portfolio_backdrop_screen.glb`
    - `public/threejs/Poliigon_StoneQuartzite_8060.mtlx` and `_Displacement.tiff`
- [x] **S** Self-host the HDR used by `<Environment preset="city">` ([Base.tsx:339](../src/components/3D/Base.tsx#L339)). It currently downloads from a third-party CDN at runtime. (Done: `public/threejs/potsdamer_platz_1k.hdr`, 1.5 MB, same file the preset loads.)
- [x] ~~**L** Move video out of git.~~ Decided against a CDN (2026-10-20). After re-encoding, the ~670 MB of video should drop to roughly 100 MB with every file well under GitHub's 100 MB limit, which the static host can serve fine. Full-length videos go on YouTube/Vimeo instead (see Video hosting in Phase 3), so the site only hosts short clips.
- [ ] **S** (Optional, later) Shrink `.git` (~980 MB) by purging the old video blobs with `git filter-repo`. This only affects clone size, and it requires a force-push, so only do it if it becomes a problem.

---

## Phase 3: Content and structure

### Information architecture

- [x] ~~**M** Reorganize nav into Work / Lab / Music.~~ Decided against (2026-11-03): most of the work is student work, so a professional/student split doesn't fit. Splitting by project type instead (below).
- [x] **M** Reorganize nav by project type: **Home / Installations / XR & Games / Apps / Music / About**. Decided 2026-11-03, done the same day on the `site-restructure` branch.
    - **Installations**: FuTerra, With/in, Shack Video, Poem Visualizer, Upham Arch, Letters from the Ocean, Trojan Horse, Fort Knox.
    - **XR & Games**: VR Basketball Shootout (ATLS 5660, added 2026-11-03), Parkinson's VR, VRchery, AR Looper, Ninjas vs. Knights.
    - **Apps**: Poet's Shack web app, The Ultimate Drum Machine, 3D Portfolio. Named "Apps" rather than "Web" so mobile apps and desktop tools fit later.
    - **Music**: dolphinswarm songs, plus score entries that link to their installation (e.g. FuTerra).
    - Cut Steampunk Mobile Fortress and Tri-Delta Sundial (no section fits, and they're the weakest pieces).
    - Redirect `/code` and `/visuals` to the new sections. (Done in `next.config.mjs`, including old `?project=` links. `/code` with no project goes to `/xr-games`.)

#### Where new projects go

- **One home per project**: the section for what someone actually experiences (a space, a headset, a screen, a song). Everything else is a tag. A music + projection piece lives in Installations, tagged Music. UI/UX work goes inside the case study of the project it was for, not on its own.
- **A new section needs at least 3 pieces worth showing.** Until then, a project fits an existing section or stays off the site. Example: once there are 3 strong 3D render / product design / graphic design pieces, add one **Design** section covering all of them, not one section per kind.
- **No "Misc" section.**
- **Keep the nav to about 6 items** (Home, About, and four sections). If a fifth section qualifies, merge two others instead of adding another.
- Moving a project to another section changes its URL, so add a redirect in `next.config.mjs` when that happens.

#### Grad school candidates (reviewed 2026-11-03)

- [ ] **S** Squirrel Census (ATLS 5660 week 6) runs on a Google Maps 3D Tiles trial that will expire. Screen-record it while it still works; the TV screen only needs the video. Could go in Apps as a video-only entry.
- [ ] Marble Clock (ATLS 5660 week 3) and Simple Reverb VST3 (week 7): Apps candidates. The clock needs a screen recording.
- [ ] Hot Dog Bar (ATLS 5430 week 9): if it's built at the Whaaat!? Festival, photograph it running. That would go in Installations.
- [ ] ATLS 5430 final project: possible first piece for a future Design section.
- [x] **L** Give each project its own URL (`/installations/<slug>`, `/xr-games/<slug>`, `/apps/<slug>`, `/music/<slug>`) instead of `?project=slug`. Each section is one optional catch-all page built statically for every project, so link previews and crawlers get that project's title, description, and canonical URL. Picking a project does a shallow URL replace; the Showcase doesn't remount. The sitemap is now generated from the project data.
    - [x] **M** Write a real `description` for each project (the field exists on `ShowcaseItem`). Until then it's built from subtitle, year, and tags, which reads flat for some items (e.g. music: "dolphinswarm (2025). Folk, Indie."). (Done 2026-11-03, in the site's first-person voice.)
    - [ ] **M** Per-project Open Graph images (1200×630). Every project page still shares the site-wide `og-image.jpg`.
- [x] **M** Move project data out of page files into `src/data/*.ts` (needed for the step above). (Done: `src/data/code.tsx`, `visuals.tsx`, `music.tsx`; `.tsx` because the bodies are JSX. Music palettes and lookup helpers moved too; `MusicPlayerBar` stays in the page.)

### Case studies (top 2–3 projects)

- [ ] **L** Expand FuTerra into a full case study:
    - your role and team size
    - constraints: venue, scale, run length, audience numbers
    - a diagram of the generative music system and media server setup
    - process shots: Unreal scenes, projection mapping, on-site setup
    - photos of people experiencing it
- [ ] **M** Same treatment for With/in (Night Lights Denver).
- [ ] **M** Merge the three Poet's Shack items into one case study, or at least stop repeating the same intro paragraph three times (`POETS_SHACK_INTRO` in [installations.tsx](../src/data/installations.tsx)).

### Code page

- [ ] **M** Cut, archive, or reframe the 2019–2021 coursework. Remove the "first project / learning demo" wording (VRchery and AR Looper in [xr-games.tsx](../src/data/xr-games.tsx)). Steampunk Fort and Tri-Delta Sundial were cut on 2026-11-03..

### About page

- [x] **M** Add a project or description for the XR Studios Creative Technologist role, your most relevant job. If it's under NDA, describe the kind of work rather than specific shows. (Done 2026-11-03 from the Extended Resume. Also added the missing ETBD Research Assistant / VR Developer role and CU Boulder ATLAS grad school.)
- [x] **S** Give each role one or two lines on impact.
- [x] **S** Trim the awards block to one line. (Summa cum laude, University Honors w/ Distinction, Outstanding Senior in Emerging Technology.)
- [x] **S** Replace `<br />` spacing with CSS.

### Contact (merged into About)

- [x] **M** Merge Connect into About. Email, copy, resume, and social links now sit under the intro ([ContactLinks.tsx](../src/components/ContactLinks/ContactLinks.tsx)); `/connect` redirects to `/about`.
- [ ] **S** Add an availability line under the contact links: types of projects you're open to, freelance vs. full-time, timezone/travel.
- [ ] **S** The "connect" procedural screen look is no longer used by any route. Reuse it somewhere or remove it from the 3D code.

### Music page

- [x] **S** Show the "I write music under the name dolphinswarm" intro once, not on all 7 songs. (Kept on each song, since only one shows at a time, but defined once as a shared constant. Same for the Poet's Shack intro.)
- [ ] **S** Give songs distinct thumbnails (all 7 share `brad-guitar.jpg`).
- [ ] **M** Move the 10 inline `style={{}}` blocks in `MusicPlayerBar` into an SCSS module like the rest of the site.

### Video hosting

- [ ] **M** Move "View Full Video" links from Google Drive to Vimeo or YouTube. Drive previews are clunky and sometimes blocked by permissions; video platforms also help discovery.

---

## Phase 4: Ongoing SEO and outreach

- [ ] **M** Add `VideoObject` JSON-LD to project pages (needs `thumbnailUrl`, `uploadDate`, `contentUrl`). Project pages now exist, so `ShowcasePage` can pass it to `<SEO jsonLd>`.
- [ ] **S** Work target phrases into visible text: "creative technologist Denver", "projection mapping", "immersive installation".
- [ ] **S** Ask &FRIENDS Studio, the Denver Theatre District artist page, and BLINK to link to your site.
- [ ] **S** Put the site URL in your GitHub, LinkedIn, YouTube, SoundCloud and Instagram bios.

### Code refactors (when touching these files)
- [ ] **M** Refactor the effects flagged by `react-hooks/set-state-in-effect` (Base, BackgroundScreen, Screen, Showcase) and `preserve-manual-memoization` (ProceduralScreenMaterial), then set both rules back to errors in `eslint.config.mjs`. Downgraded to warnings when `eslint-config-next` 16.4 made them errors.

- [x] **S** Replace the hand-rolled `<a>` + `router.push` navigation in [Header.tsx](../src/components/Header.tsx#L55-L86) with `next/link` to get prefetching back.
- [x] **S** Pull the duplicated screen-sync setup in `code.tsx` and `visuals.tsx` into a shared hook or into Showcase itself. (Done: [ShowcasePage.tsx](../src/components/Showcase/ShowcasePage.tsx) handles it for every section, Music included.)
