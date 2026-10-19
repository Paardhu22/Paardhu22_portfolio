import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:4174';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, headless: true, args: ['--no-sandbox'] });
try {
  for (const width of [375, 768, 1280]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const errors = [], artRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.url().includes('/assets/artwork/')) artRequests.push(request.url()); });
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(artRequests.length, 0, 'Work page does not download contact artwork');
    await page.getByRole('link', { name: 'Contact me', exact: true }).click();
    await page.getByRole('heading', { name: 'The sketchbook.' }).waitFor();
    assert.equal(await page.locator('.contact-links a').count(), 3, 'All contact links remain accessible');
    assert.equal(await page.locator('.artwork-open').count(), 3);
    for (const button of await page.locator('.artwork-open').all()) {
      await button.scrollIntoViewIfNeeded();
      await button.locator('img').evaluate(img => img.decode());
      await button.focus();
      await page.keyboard.press('Enter');
      const modal = page.getByRole('dialog');
      await modal.waitFor();
      await modal.locator('img').evaluate(img => img.decode());
      assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
      await page.keyboard.press('Escape');
      await modal.waitFor({ state: 'hidden' });
      assert.equal(await button.evaluate(el => document.activeElement === el), true, 'Focus returns to the selected study');
    }
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow');
    assert.equal(await page.locator('canvas, iframe').count(), 0, 'No runtime canvas or heavy iframe');
    await page.screenshot({ path: `/tmp/portfolio2-contact-${width}.png`, fullPage: true });
    await page.locator('.artwork-open').first().click();
    await page.getByRole('dialog').waitFor();
    await page.evaluate(() => history.back());
    await page.getByRole('heading', { name: 'Selected work' }).waitFor();
    assert.equal(await page.locator('dialog[open]').count(), 0, 'History navigation dismisses the modal');
    assert.equal(await page.evaluate(() => document.body.style.overflow), '');
    await page.getByRole('link', { name: 'Contact me', exact: true }).click();
    assert.equal(await page.locator('.artwork-lightbox[open]').count(), 0, 'Returning does not reopen the previous art');
    assert.deepEqual(errors, []);
    console.log(`Contact artwork: ${width}px layout, 3 images, keyboard/lightbox/focus/navigation checks passed.`);
    await page.close();
  }
  const alias = await browser.newPage();
  await alias.goto(`${base}/contact.html`);
  await alias.getByRole('heading', { name: 'The sketchbook.' }).waitFor();
  assert.ok(new URL(alias.url()).pathname === '/contact');
  await alias.close();
  console.log('Legacy /contact.html alias passed.');
} finally { await browser.close(); }
