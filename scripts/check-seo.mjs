import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { fullName, pages, siteUrl } from '../src/seo.js';

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:4174';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, headless: true, args: ['--no-sandbox'] });
try {
  for (const [key, meta] of Object.entries(pages).filter(([, meta]) => meta.path)) {
    const response = await fetch(`${base}${meta.path}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.ok(html.includes(meta.title), `${key} has its own title in the response HTML`);
    assert.ok(html.includes(`href="${siteUrl}${meta.path}"`));
    assert.ok(!html.includes('Selected projects will be here soon.'));
    const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 375, height: 900 } });
    await page.goto(`${base}${meta.path}`);
    assert.equal(await page.title(), meta.title);
    assert.equal(await page.locator('h1').count(), 1);
    assert.ok((await page.locator('h1').textContent()).includes(fullName));
    const schema = JSON.parse(await page.locator('#portfolio-schema').textContent());
    const person = schema['@graph'].find(item => item['@type'] === 'Person');
    assert.equal(person.name, fullName);
    assert.ok(person.sameAs.includes('https://github.com/Paardhu22'));
    if (key === 'work') {
      assert.ok(await page.locator('#work-empty article').count() >= 4);
      await page.getByRole('heading', { name: 'TRINKER', exact: true }).waitFor();
    }
    if (key === 'about') await page.getByRole('heading', { name: 'Motion House', exact: true }).waitFor();
    if (key === 'contact') assert.equal(await page.locator('.artwork-open:visible').count(), 3);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${key} fits the mobile viewport without JavaScript`);
    await page.screenshot({ path: `/tmp/portfolio2-seo-${key}-nojs.png`, fullPage: true });
    await page.close();
    console.log(`${key}: distinct response metadata, readable content, schema and mobile layout without JavaScript passed.`);
  }
  const robots = await fetch(`${base}/robots.txt`);
  assert.match(robots.headers.get('content-type'), /text\/plain/);
  assert.match(await robots.text(), new RegExp(`Sitemap: ${siteUrl.replaceAll('.', '\\.')}/sitemap.xml`));
  const sitemap = await fetch(`${base}/sitemap.xml`);
  assert.match(sitemap.headers.get('content-type'), /xml/);
  const xml = await sitemap.text();
  assert.equal((xml.match(/<loc>/g) || []).length, 3);
  for (const meta of Object.values(pages).filter(meta => meta.path)) assert.ok(xml.includes(`<loc>${siteUrl}${meta.path}</loc>`));
  const notFound = await readFile('dist/404.html', 'utf8');
  assert.ok(notFound.includes('noindex, follow'));
  assert.ok(!notFound.includes('rel="canonical"'));
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  assert.equal(config.cleanUrls, true);
  assert.ok(!config.rewrites?.some(rule => rule.source === '/(.*)'));
  assert.match((await fetch(`${base}/assets/social-preview.png`)).headers.get('content-type'), /image\/png/);
  const page = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 375, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base);
  await page.locator('#project-grid:not([hidden])').waitFor();
  assert.ok(await page.locator('#project-grid article').count() >= 4);
  await page.locator('#project-grid .project-preview-trigger').first().click();
  await page.locator('#project-viewer[open]').waitFor();
  await page.keyboard.press('Escape');
  await page.locator('#project-viewer[open]').waitFor({ state: 'hidden' });
  for (const [name, key] of [['About me', 'about'], ['Contact me', 'contact'], ['Selected work', 'work']]) {
    await page.getByRole('link', { name, exact: true }).click();
    await page.waitForFunction(title => document.title === title, pages[key].title);
    assert.equal(await page.title(), pages[key].title);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${siteUrl}${pages[key].path}`);
    assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'), `${siteUrl}${pages[key].path}`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await page.goto(`${base}/404.html`);
  await page.getByRole('heading', { name: 'That page isn’t here.' }).waitFor();
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'noindex, follow');
  await page.getByRole('link', { name: 'Back to work', exact: true }).click();
  await page.waitForFunction(title => document.title === title, pages.work.title);
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'), 'index, follow');
  assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
  assert.deepEqual(errors, []);
  await page.close();
  const failed = await browser.newPage();
  await failed.route('**/assets/*.js', route => route.abort());
  await failed.goto(base);
  await failed.getByRole('button', { name: 'Try again', exact: true }).waitFor();
  await failed.getByRole('heading', { name: 'TRINKER', exact: true }).waitFor();
  assert.equal(await failed.locator('#portfolio-preloader').count(), 0);
  await failed.close();
  console.log('Robots/sitemap/image, static 404 configuration, SPA metadata, project preview, mobile layout and failed-bundle recovery passed.');
} finally { await browser.close(); }
