import { cp, copyFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Keep the user's existing assets/ locations and filenames, including audio.
await cp('assets', 'dist/assets', {
  recursive: true,
  filter: source => !['.js', '.css'].includes(path.extname(source)),
});
// Legacy bookmarks still open the React shell on static hosts.
await Promise.all(['about.html', 'contact.html'].map(file => copyFile('dist/index.html', `dist/${file}`)));
// Netlify/Cloudflare Pages history fallback; other hosts need the same rewrite.
await writeFile('dist/_redirects', '/* /index.html 200\n');
