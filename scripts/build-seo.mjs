import { readFile, writeFile, rm, mkdtemp } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { build } from 'vite';
import { pages, siteUrl, fullName, structuredData } from '../src/seo.js';

const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const shell = await readFile('dist/index.html', 'utf8');
const temporary = await mkdtemp(path.resolve('.prerender-'));
try {
  await build({ logLevel: 'warn', build: { ssr: 'src/prerender.jsx', outDir: temporary, emptyOutDir: true } });
  const { render } = await import(pathToFileURL(path.join(temporary, 'prerender.js')));
  for (const [page, meta] of Object.entries(pages)) {
    const canonical = meta.path ? `${siteUrl}${meta.path}` : null;
    const image = `${siteUrl}/assets/social-preview.png`;
    const verification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
    const head = [
      `<title>${escape(meta.title)}</title>`,
      `<meta name="description" content="${escape(meta.description)}" />`,
      `<meta name="author" content="${fullName}" />`,
      `<meta name="robots" content="${canonical ? 'index, follow' : 'noindex, follow'}" />`,
      canonical && `<link rel="canonical" href="${canonical}" />`,
      canonical && `<meta property="og:url" content="${canonical}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${fullName} — Portfolio" />`,
      `<meta property="og:locale" content="en_US" />`,
      `<meta property="og:title" content="${escape(meta.title)}" />`,
      `<meta property="og:description" content="${escape(meta.description)}" />`,
      `<meta property="og:image" content="${image}" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta property="og:image:alt" content="${fullName} — Creative developer portfolio" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escape(meta.title)}" />`,
      `<meta name="twitter:description" content="${escape(meta.description)}" />`,
      `<meta name="twitter:image" content="${image}" />`,
      verification && `<meta name="google-site-verification" content="${escape(verification)}" />`,
      `<script id="portfolio-schema" type="application/ld+json">${JSON.stringify(structuredData(page)).replace(/</g, '\\u003c')}</script>`,
    ].filter(Boolean).join('\n    ');
    const html = shell.replace(/<!--seo-start-->[\s\S]*?<!--seo-end-->/, () => `<!--seo-start-->\n    ${head}\n    <!--seo-end-->`)
      .replace(/<!--app-html-->[\s\S]*?<!--\/app-html-->/, () => `<!--app-html-->${render(meta.path || '/not-found')}<!--/app-html-->`);
    await writeFile(`dist/${page === 'work' ? 'index' : page === 'missing' ? '404' : page}.html`, html);
  }
  const urls = Object.values(pages).filter(page => page.path).map(page => `  <url><loc>${siteUrl}${page.path}</loc></url>`).join('\n');
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
  console.log('Pre-rendered Work, About, Contact and 404; generated sitemap.xml and robots.txt.');
} finally {
  await rm(temporary, { recursive: true, force: true });
}
