# Contact sketchbook

The three files in `sketches/` are the complete AI-assisted p5.brush sketches
supplied by Paardhiv: the island harbour, pineapple botanical plate, and tiled
Girih fountain. Each has its own global setup, palette and drawing functions and
is rendered in an isolated browser page.

The website uses pre-rendered WebP images in `assets/artwork/`, at 480, 800 and
1200 pixels. It never downloads p5, p5.brush or runs the engraving loops on a
visitor's device. These tools are development dependencies only. Regeneration
is optional; normal builds use the checked-in images.

To regenerate after editing a sketch:

```sh
npm ci
npx playwright install chromium
npm run render:artwork
```

Render one study with `npm run render:artwork -- botanical` (or `harbour` or
`fountain`). Set `CHROMIUM_PATH` to use an existing Chromium installation. The
detailed engraving can take several minutes with software WebGL rendering.

The renderer retains the sketches' seeds, 1200px composition and drawing code.
It fixes output pixel density at one for consistent exports, and saves three
responsive image sizes. No AI image-generation service is involved in rendering.
