import { cp, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Keep the user's existing assets/ locations and filenames, including audio.
await cp('assets', 'dist/assets', {
  recursive: true,
  filter: source => !['.js', '.css'].includes(path.extname(source)),
});
await import('./build-seo.mjs');
// Explicit routes preserve real 404 responses and do not swallow robots/sitemap.
await writeFile('dist/_redirects', '/work / 301\n/index.html / 301\n/about.html /about 301\n/contact.html /contact 301\n/about /about.html 200\n/contact /contact.html 200\n/* /404.html 404\n');
