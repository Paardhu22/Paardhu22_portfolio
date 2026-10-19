import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';
import sharp from 'sharp';

// Build-time only: visitors receive images, never p5, WebGL or these source files.
const names = ['harbour', 'botanical', 'fountain'];
const selected = process.argv.slice(2);
if (selected.some(name => !names.includes(name))) throw new Error('Choose harbour, botanical or fountain.');
const routes = {
  '/p5.js': 'node_modules/p5/lib/p5.min.js',
  '/brush.js': 'node_modules/p5.brush/dist/p5.brush.js',
  ...Object.fromEntries(names.map(name => [`/${name}.js`, `artwork/sketches/${name}.js`])),
};
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (routes[url.pathname]) {
    res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    res.end(await readFile(routes[url.pathname]));
  } else if (url.pathname === '/' && names.includes(url.searchParams.get('name'))) {
    const name = url.searchParams.get('name');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#f6eedc}canvas{display:block}</style></head><body>
      <script>window.addEventListener('error', event => { window.artworkError = event.message; });</script>
      <script src="/p5.js"></script><script src="/brush.js"></script><script src="/${name}.js"></script>
      <script>
        p5.disableFriendlyErrors = true;
        const originalSetup = window.setup, originalDraw = window.draw;
        window.setup = async function() { pixelDensity(1); await originalSetup(); };
        window.draw = function() { originalDraw(); window.artworkRendered = true; };
      </script></body></html>`);
  } else { res.statusCode = 404; res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  headless: true,
  args: ['--no-sandbox', '--enable-webgl', '--enable-unsafe-swiftshader'],
});
await mkdir('assets/artwork', { recursive: true });
try {
  for (const name of selected.length ? selected : names) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => { errors.push(error.message); console.error(name, error.message.slice(0, 500)); });
    console.log(`Rendering supplied ${name} sketch…`);
    await page.goto(`http://127.0.0.1:${server.address().port}/?name=${name}`, { waitUntil: 'domcontentloaded', timeout: 600_000 });
    await page.waitForFunction(() => window.artworkRendered || window.artworkError, undefined, { timeout: 600_000 });
    if (errors.length) throw new Error(errors.join('\n'));
    const png = await page.locator('canvas').screenshot({ timeout: 600_000 });
    for (const size of [480, 800, 1200]) {
      const output = `assets/artwork/${name}-${size}.webp`;
      const { size: bytes } = await sharp(png).resize(size, size).webp({ quality: 90, effort: 6 }).toFile(output);
      console.log(`${output}: ${Math.round(bytes / 1024)} KB`);
    }
    await page.close();
  }
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
