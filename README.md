# Portfolio 2

Paardhiv Reddy Tumma’s minimal portfolio, built with React, React Router, and Vite.
Work, About, and Contact are distinct routes in one persistent application.

## Run and build

For the stable local preview, including after closing and reopening the browser:

```sh
npm start
```

This rebuilds and serves the compiled app at http://localhost:4173. Keep the
terminal running while using the site. The preview revalidates files on reopening
so it does not depend on Vite's development dependency cache. Startup and rendering
failures show a recovery message with a Try again button instead of a blank page.

For editing with live updates:

```sh
npm install
npm run dev
```

Open http://localhost:4173. The preview now needs Vite; a plain Python file server
cannot compile React source files.

```sh
npm run build
npm run preview
```

The production site is in `dist/`. Deploy that folder on a static host with a
history fallback to `index.html` for `/about` and `/contact`. `_redirects` is
included for Netlify and Cloudflare Pages. The build also produces `about.html`
and `contact.html` aliases for older bookmarks. `/index.html`, `/work`, and the
old `.html` URLs resolve to the canonical routes without a document reload.

## Navigation and music

The header, music player, footer, and project controller remain mounted.
Client-side navigation changes the URL and active content without
replacing the audio element, reloading the document, or resetting playback time.
Back/Forward restores route scroll positions. Navigation updates titles and
metadata, announces the page, and moves keyboard focus to the main content.
Transitions are short and skipped for reduced motion. External links and
Ctrl/Command-click keep the browser’s normal behaviour.

The dock slides and fades out after scrolling down 28px, then returns after
scrolling up 12px. It stays visible near the top and during keyboard navigation,
and reappears on route changes. Small scroll reversals and overscroll do not make
it flicker. `src/useScrollDock.js` tracks direction with one animation frame per
scroll update. On mobile, the separate bottom music control remains available;
hiding the dock never unmounts or interrupts the audio player.

The track is `assets/audio/Tilt.mp3`. Configuration lives in `assets/music.js`:

```js
export const music = {
  src: 'assets/audio/Tilt.mp3',
  title: 'Tilt',
  volume: 0.45,
  autoplay: true,
};
```

Music attempts to start automatically and loops at 45% volume. Browsers may
block audible autoplay on a fresh visit. When blocked, the player waits for the
first ordinary tap, click, or keypress and retries from that interaction. No
specific Play click is required, but browser/site settings can still prohibit
sound. Pausing with the music button is respected across all route changes;
other interactions do not restart a manually paused track. A full refresh or a
new tab creates a new application session. The button always allows play/pause.
Waveform animation runs only while playing and visible, and stays still for
reduced motion. Empty `src` retains the coming-soon state.

## Edit pages and design

`src/App.jsx` owns the persistent shell, navigation, metadata, scroll restoration,
and clock. Page content is in `src/views.jsx`; styles remain in
`assets/style.css`, `assets/project-viewer.css`, `assets/trinker-terminal.css`,
and `src/app.css`. Existing spacing, typography, the 17px Contact links, and the
minimal design remain in place. There are no trackers, analytics, or form backend.
Email opens the visitor’s mail app; social/source links open in new tabs.

The short bio is starter copy based on the chosen role. Replace it with more
personal details as desired. There are no invented employers or testimonials.

## About photos and hackathon feature

`src/components/AboutProfile.jsx` and `about-profile.css` build the About page
from six supplied personal photos. Readable JPEG copies in `assets/about/`
keep the original WhatsApp exports untouched. The introduction uses the
black-shirt portrait; the hackathon team photo is featured separately; the remaining four
photos appear in the personal gallery. Clicking a photo opens its uncropped
original with Previous/Next, Left/Right, Escape, and backdrop dismissal. The
native dialog traps focus, restores focus on dismissal, locks background
scrolling, and closes when leaving About. Hover zoom respects reduced motion.

Motion House’s description and teammates (Avinash Gupta and Vega Darsi) come
from [Paardhiv’s LinkedIn post](https://www.linkedin.com/posts/paardhiv-reddy-tumma_hackathon-videoediting-buildinpublic-activity-7497946198146883584-JLtC).
The feature links directly to that story; no event name, prize amount, or first
place claim is inferred. There is no dither effect or reveal-colour control.

## Projects

Edit `assets/projects.js`. qp-gen uses `preview: 'qpgen'` and seven screenshots in
`assets/projects/qp-gen/`. TRINKER uses `preview: 'terminal'`, SELENO uses
`preview: 'seleno'`. Emptying the list
restores the labelled preview example. All user-supplied assets stay in `assets/`;
the build copies images, audio, fonts, and their licences into `dist/assets/`.

A photo project needs a `title`; other fields are optional:

```js
{
  title: 'Your project',
  description: 'A short description.',
  details: 'More detail for the expanded view.',
  image: 'assets/projects/my-project/cover.webp',
  imageAlt: 'Describe the cover',
  url: 'https://your-project.example',
  year: '2026',
  images: [
    { src: 'assets/projects/my-project/home.webp', thumbnail: 'assets/projects/my-project/home-thumb.webp', label: 'Home', alt: 'Describe this screen' },
    { src: 'assets/projects/my-project/editor.webp', label: 'Editor', alt: 'Describe this screen' },
  ],
}
```

`previewImage` optionally supplies a larger single-image preview. `images` supplies
an ordered gallery; `thumbnail` is optional. The cover and enlarged photos remain
uncropped. Navigate with thumbnails, previous/next, Left/Right, Home/End, or a
horizontal swipe. Zoom makes detailed images scrollable, and changing screenshots
resets it. No gallery advances automatically. qp-gen has no supplied live URL, so
its Visit link is omitted. Lightweight WebP copies preserve the original PNGs.

The viewer expands from its card and closes with Escape, the close button, or the
backdrop. It locks background scrolling and returns focus to the card. Switching
routes through browser history dismisses an open preview and cancels its work.
Project viewers use native dialogs and Web Animations inside the React shell.

## TRINKER terminal

`assets/trinker-terminal.js` mounts the terminal; `assets/trinker-demo.js` contains
fixtures curated from the TRINKER repository's `examples/juice-shop/README.md`
and its reviewed plan. All results are explicitly simulated. No scan, shell,
model call, credential lookup, target request, or file write occurs in the browser.

Commands: `help`, `trinker run`, `trinker verify TRK-0001` (also 0002 and 0003),
`trinker coverage`, `trinker compile`, `trinker init`, and
`trinker report --markdown` (also `--json` and `--sarif`). Preview helpers:
`plan`, `about`, `clear`, `reset`, `whoami`; `run`, `scan`, `verify`, and `report`
are demo-only aliases. Up/Down recalls history, Tab completes commands, Ctrl+C
stops an active command from the input, and Ctrl+L clears output.

The fresh fixture shows three example findings and two negative controls. The
state-mutation check becomes inconclusive after its first run until Reset restores
the fixture; its replay explains why. The read-only findings replay normally.
Coverage describes only the five example routes, four with planned checks.
Finite progress and row animations stop for reduced motion, including a live
preference change. Closing cancels pending work and starts a fresh session next
time. An architecture case study and source link sit below the terminal.

`assets/trinker-case-study.js` edits the supplied thesis into ten sections scoped
to `main@c8e68bd`, v0.1.1 (30 September 2026). It covers compile/replay, the file
split, surface discovery, oracles, evidence, coverage and CI, safety and the AI
boundary, trade-offs, stack, tests, and limits. The 474-test count describes the
supplied snapshot; this portfolio does not execute the real scanner or its suite.
Exit-code copy distinguishes default behavior from `--strict`: an inconclusive
check is not a passed verdict even when a non-strict scan exits 0.

The case study uses the same rolling contents and reading layout as qp-gen, with
a restrained blue accent. The shared reader in `assets/project-case-study.js`
owns section links, keyboard focus, motion preferences, and cleanup. Each project
has separate anchor IDs; opening another project cannot retain the prior article.

## qp-gen paper studio

`assets/qpgen-studio.js` and `assets/qpgen-studio.css` provide a working local
preview of the paper-building workflow. Choose Class 10 Science (Light) or
Mathematics (Quadratic equations), a title, and a 12- or 20-mark sample blueprint.
Four curated questions assemble one at a time, with pause/continue and reset.
Reduced motion assembles them immediately. Mobile builds bring the preview into
view inside the dialog, with a nearby pause button.

Once built, edit the question text, swap each question with an alternate, and
change its marks. The blueprint and paper totals update from the visible rows.
Empty questions, empty marks, fractional marks, and marks outside 1–10 display
a validation message. The preview badge, live-preview label, and text-download
button are hidden as requested.
No model, backend, upload, account, or storage service is called. The full project
generates a question pool from sources and supports PDF/Word export; this demo
explains that workflow without claiming to run it. Questions are illustrative,
not a certified board-exam paper.

The seven original screenshots sit below under **Preview of real**, with the
same image, keyboard, swipe, and zoom controls as Seleno. Closing, navigating
away, or hiding the tab cancels or pauses sample assembly. Reopening starts a
fresh demo. The qp-gen source repository is only read for context.

## qp-gen architecture case study

`assets/qpgen-case-study.js` and `assets/qpgen-case-study.css` present ten sections edited from the
owner-supplied AOS thesis, scoped to `main@d6e7a9d` (15 September 2026). The case
study sits in qp-gen's details below the preview and real screenshots. It covers
the two layers, source-to-paper workflow, templates, question pool, recorded SSE
runs, editor, school features, trade-offs, stack, and testing.

A table of contents starts the case study. Its centre-staggered rolling labels
adapt the supplied Skiper UI TextRoll reference, using the site's Manrope font.
Links scroll and focus the matching heading inside the dialog without changing
the route or restarting music. Keyboard focus gets the same affordance; reduced
motion shows static labels and jumps immediately. Closing removes the article
and its listeners. TRINKER and SELENO reuse this reader with separate article data
and restrained project accents.

## Seleno showcase

SELENO uses `preview: 'seleno'`. `assets/seleno-showcase.js` owns a finite,
interactive Place → Match → Align → Inspect story, styled in
`assets/seleno-showcase.css`. Visitors can play, pause, replay, or select a step,
compare the illustrated overlay, and show or hide points. Closing the viewer,
switching routes, or hiding the tab stops playback. Reduced motion skips animated
playback to Inspect while keeping every step and control available.

The map is an illustration using one LROC terrain texture, not a live registration
or a representation of a particular Chandrayaan-2 pair. Its source is
`seleno-prototype/data/lroc/pairs/lroc_055_145_r8192_c43008_reference.png`;
the project credits NASA/ASU LROC for this data. The three selectable validation
records come from `reports/validation_20260925/deck_summary.md` and the README.
They retain the warning status, source/reference units, and held-out measurement
limitations. No registration service, dataset upload, or heavy processing runs
inside the portfolio. File chips describe outputs; they are not download buttons.

The separate **Preview of real** gallery shows all eight supplied screenshots
under the story, using the existing thumbnail, keyboard, touch, and zoom controls.
WebP copies in `assets/projects/seleno/previews/` are sized for the viewer. The
original PNGs remain untouched. The Seleno source repository is not modified.

`assets/seleno-case-study.js` adds ten sections below the real screenshots, using
the shared rolling contents navigation and Manrope reading layout. It covers
the shared entry point, placement and matching, model validation and export,
sealed evaluation, measured results, memory and job reproducibility, profiles
and artifacts, trade-offs, tests, and limitations. Its quiet gold accent follows
the showcase while maintaining readable contrast on the white page.

The copy is edited from the supplied `main@866bcfa` thesis (27 September 2026),
including its 4 October test report. It distinguishes source and reference pixel
errors, raw and screened scores, internal consistency and independent accuracy.
The reference experiment's 0.69-pixel held-out RMSE does not imply that every
acceptance gate passed. Test counts describe the supplied report; this portfolio
does not execute the registration pipeline or its suites.

## Credits

The music, animated Contact links, rolling case-study contents, and expanding project interaction adapt the
user-supplied Skiper UI examples by @gurvinder-singh02. Attribution is linked in
the footer. Manrope and IBM Plex Mono use the SIL Open Font License; licences
are in `assets/fonts/`. The public GitHub avatar is stored locally.

The design follows the spacing and personal scale of
https://www.mirayavandiepen.com/ and the applicable quality guidance from
the supplied website-quality ruleset. The user’s minimal brief and request for a
React application take precedence over that skill’s cinematic and plain-HTML defaults.
