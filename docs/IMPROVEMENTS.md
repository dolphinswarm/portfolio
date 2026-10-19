# Portfolio Improvement Plan

Action items from the site review on 2026-10-19. Check items off as they land.

Effort: **S** = under an hour, **M** = a few hours, **L** = a day or more.

---

## Phase 1: Quick wins (low risk, high impact)

### Homepage and positioning

- [x] **S** Add a visible hero over the 3D scene on the homepage: an `<h1>` with name, a one-line pitch (e.g. "Creative technologist building projection-mapped, XR and audio-reactive experiences. Denver, CO."), and two buttons: "Watch reel" and "See work". The homepage currently renders no text at all. ([index.tsx](../src/pages/index.tsx))
- [x] **S** Add one `<h1>` to every page. None exist today except `/bork`.

### SEO basics

- [x] **M** Create a shared `<SEO>` component (title, description, canonical, Open Graph, Twitter card) and use it on every page.
    - About and Connect have no `<title>` or description at all.
    - Code / Visuals / Music titles are just one word. Use titles like "Projection Mapping & Immersive Installations | Brad Schmitz".
- [x] **S** Make a 1200×630 Open Graph image (a still from the 3D scene works well). This controls how links look on LinkedIn and Slack.
- [x] **S** Add `Person` JSON-LD to the homepage: `name`, `alternateName: "Bradley Schmitz"`, `jobTitle`, Denver address, `alumniOf` Miami University, and `sameAs` with GitHub, LinkedIn, YouTube, SoundCloud and Instagram.
- [x] **S** Add `robots.txt` and `sitemap.xml`. Mark `/bork` as `noindex`.
- [ ] **S** Verify the site in Google Search Console and submit the sitemap.
- [x] **S** Fix [site.webmanifest](../public/favicon/site.webmanifest): fill in `name`/`short_name`, fix icon paths (missing `/favicon/`), and change `theme_color`/`background_color` from white to the site's dark color.

### Copy fixes

- [x] **S** Typo "Portofolio" in the homepage description. ([index.tsx:10](../src/pages/index.tsx#L10))
- [x] **S** "there is also various questions" → "there are also various questions". ([code.tsx:51](../src/pages/code.tsx#L51))

### Code hygiene

- [x] **S** Replace the create-next-app boilerplate [README.md](../README.md) with a screenshot, the stack, and a short architecture note. The "3D Portfolio" project links to this repo, so reviewers will read it.
- [x] **S** Add `@use-gesture/react` to `package.json`. It's imported in [Showcase.tsx:11](../src/components/Showcase/Showcase.tsx#L11) but only installed transitively through drei.
- [x] **S** Remove duplicate `viewport` and favicon tags from individual pages. They conflict with `_document` (they drop `viewport-fit=cover`).
- [x] ~~Remove the duplicate font variable classes~~ Not actually duplicates: `next/font` only loads its CSS from app-bundle modules, so the classes in [Layout.tsx](../src/components/Layout.tsx) are what load the fonts. Left as is.
- [x] **S** Delete unused `src/styles/Home.module.scss`. (Reused it for the homepage hero instead.)

---

## Phase 2: Performance and assets

- [ ] **M** Re-encode the homepage reel. `demo-reel.mp4` is 85 MB and loads with `preload="auto"` on first visit. Target 720p, about 8–15 MB, with `-movflags +faststart`.
- [ ] **M** Re-encode the showcase clips (currently 40–80 MB each) to short loops of about 5–10 MB.
- [x] **S** Generate ~600 px WebP/AVIF thumbnails. `vrchery.png` is 4 MB and only used as a thumbnail. (Done for Code and Visuals at 480 px: 24.9 MB → 270 KB. Music thumbnails left full-size because they double as the screen image.)
- [x] **S** Switch the static effect to the 409 KB `public/videos/tv-static.mp4` instead of the 14 MB `branding/videos/tv-static.mp4`, if it looks the same. (Not possible: that file was a different clip. Re-encoded the real one instead: 14 MB → 3.6 MB, 720p30, 1.2 s loop, no audio.)
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
- [ ] **S** Self-host the HDR used by `<Environment preset="city">` ([Base.tsx:320](../src/components/3D/Base.tsx#L320)). It currently downloads from a third-party CDN at runtime.
- [ ] **L** Move video out of git. The repo holds ~980 MB of media with no LFS, and GitHub rejects files over 100 MB. Options: a media CDN (Cloudflare Stream/R2, Mux, Bunny) or Git LFS. Shrinking existing history requires a history rewrite; decide separately.

---

## Phase 3: Content and structure

### Information architecture

- [ ] **M** Reorganize nav from medium (Code / Visuals / Music) to something like:
    - **Work**: featured cross-disciplinary installations (FuTerra, With/in, Poet's Shack) as full case studies.
    - **Lab** or **Archive**: student projects and experiments.
    - **Music**: lead with the FuTerra generative system and the With/in score, then the dolphinswarm songs.
- [ ] **L** Give each project its own URL (`/work/[slug]` with static generation) instead of `?project=slug`. Today the server always renders the first project, so every link preview and crawl sees the same title and text. Keep the same TV-screen UI by passing the initial slug from the route.
- [ ] **M** Move project data out of page files into `src/data/*.ts` (needed for the step above).

### Case studies (top 2–3 projects)

- [ ] **L** Expand FuTerra into a full case study:
    - your role and team size
    - constraints: venue, scale, run length, audience numbers
    - a diagram of the generative music system and media server setup
    - process shots: Unreal scenes, projection mapping, on-site setup
    - photos of people experiencing it
- [ ] **M** Same treatment for With/in (Night Lights Denver).
- [ ] **M** Merge the three Poet's Shack items into one case study, or at least stop repeating the same intro paragraph three times ([visuals.tsx:187](../src/pages/visuals.tsx#L187), [232](../src/pages/visuals.tsx#L232), [280](../src/pages/visuals.tsx#L280)).

### Code page

- [ ] **M** Cut, archive, or reframe the 2019–2021 coursework. Remove the "first project / learning demo" wording ([code.tsx:91](../src/pages/code.tsx#L91), [code.tsx:129](../src/pages/code.tsx#L129)).

### About page

- [ ] **M** Add a project or description for the XR Studios Creative Technologist role, your most relevant job. If it's under NDA, describe the kind of work rather than specific shows.
- [ ] **S** Give each role one or two lines on impact.
- [ ] **S** Trim the awards block to one line.
- [ ] **S** Replace `<br />` spacing with CSS.

### Connect page

- [ ] **S** Fill the empty right column (currently a `// TODO`, [connect.tsx:150](../src/pages/connect.tsx#L150)) with an availability note: types of projects you're open to, freelance vs. full-time, timezone.
- [x] **S** Add the resume link here too, not just on About.

### Music page

- [x] **S** Show the "I write music under the name dolphinswarm" intro once, not on all 7 songs. (Kept on each song, since only one shows at a time, but defined once as a shared constant. Same for the Poet's Shack intro.)
- [ ] **S** Give songs distinct thumbnails (all 7 share `brad-guitar.jpg`).
- [ ] **M** Move the 10 inline `style={{}}` blocks in `MusicPlayerBar` into an SCSS module like the rest of the site.

### Video hosting

- [ ] **M** Move "View Full Video" links from Google Drive to Vimeo or YouTube. Drive previews are clunky and sometimes blocked by permissions; video platforms also help discovery.

---

## Phase 4: Ongoing SEO and outreach

- [ ] **M** Add `VideoObject` JSON-LD to project pages (needs `thumbnailUrl`, `uploadDate`, `contentUrl`).
- [ ] **S** Work target phrases into visible text: "creative technologist Denver", "projection mapping", "immersive installation".
- [ ] **S** Ask &FRIENDS Studio, the Denver Theatre District artist page, and BLINK to link to your site.
- [ ] **S** Put the site URL in your GitHub, LinkedIn, YouTube, SoundCloud and Instagram bios.

### Code refactors (when touching these files)

- [x] **S** Replace the hand-rolled `<a>` + `router.push` navigation in [Header.tsx](../src/components/Header.tsx#L55-L86) with `next/link` to get prefetching back.
- [ ] **S** Pull the duplicated screen-sync setup in `code.tsx` and `visuals.tsx` into a shared hook or into Showcase itself.
