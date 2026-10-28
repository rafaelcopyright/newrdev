import { chromium } from '@playwright/test';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
/* global document, innerWidth */

const routes = JSON.parse(await readFile('docs/routes.json', 'utf8'));
const browser = await chromium.launch({
  ...(process.env.CHROME_PATH
    ? { executablePath: process.env.CHROME_PATH }
    : { channel: 'chrome' }),
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text());
});
for (const route of routes) {
  await page.goto('http://127.0.0.1:4173' + route, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('h1').count(), 1, route);
  assert(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    `Overflow: ${route}`,
  );
}
await page.goto('http://127.0.0.1:4173/blog/');
await page.getByRole('searchbox').fill('Como Funciona a Internet');
assert.equal(await page.locator('main article').count(), 1);
await page.getByRole('link', { name: /Como Funciona a Internet/ }).click();
await page.reload();
assert.match(page.url(), /desenvolvimento-web\/como-funciona-a-internet/);
await page.goBack();
await page.getByRole('button', { name: 'Menu', exact: true }).click();
await page
  .getByRole('navigation', { name: 'Principal móvel' })
  .getByRole('link', { name: 'Sobre' })
  .click();
assert.match(page.url(), /sobre/);
await mkdir('docs/screenshots', { recursive: true });
await page.goto('http://127.0.0.1:4173/');
await page.getByRole('button', { name: 'Alternar tema' }).click();
await page.reload();
assert(await page.locator('html').evaluate((node) => node.classList.contains('light')));
await page.getByRole('button', { name: 'Alternar tema' }).click();
await page.screenshot({ path: 'docs/screenshots/home-mobile.png', fullPage: true });
await page.goto('http://127.0.0.1:4173/desenvolvimento-web/como-funciona-a-internet/');
await page.screenshot({ path: 'docs/screenshots/article-mobile.png', fullPage: true });
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto('http://127.0.0.1:4173/');
await page.screenshot({ path: 'docs/screenshots/home-desktop.png', fullPage: true });
await writeFile(
  'docs/browser-check.json',
  JSON.stringify({ routes: routes.length, errors }, null, 2),
);
await browser.close();
assert.deepEqual(errors, []);
console.log(`Browser checks passed for ${routes.length} routes.`);
