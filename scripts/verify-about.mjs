import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
/* global document, window, innerWidth */
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4180';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await page.addInitScript(() => {
  window.open = (url) => {
    window.__aboutOpened = url;
    return null;
  };
});
try {
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base + '/sobre/', { waitUntil: 'networkidle' });
    for (const theme of ['dark', 'light']) {
      await page.evaluate(
        (theme) => document.documentElement.classList.toggle('light', theme === 'light'),
        theme,
      );
      assert(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `Overflow ${width}/${theme}`,
      );
      assert.equal(await page.locator('h1').count(), 1);
      assert(
        await page
          .locator('.about-hero .about-eyebrow')
          .evaluate((node) => node.getBoundingClientRect().top >= 64),
        'Hero covered by header',
      );
      assert.equal(await page.locator('.about-job').count(), 3);
      assert.equal(await page.locator('.about-education article').count(), 3);
    }
  }
  assert.equal(
    await page.locator('link[rel="canonical"]').getAttribute('href'),
    'https://rafaeldev.com.br/sobre/',
  );
  const text = await page.locator('main').innerText();
  assert(text.includes('outubro de 2026'));
  assert(text.includes('Conclusão prevista para 2027'));
  assert(!/\[SEU NOME|Data de nascimento|CEP:|o momento/i.test(text));
  const schema = await page.locator('script[type="application/ld+json"]').first().textContent();
  assert(JSON.parse(schema)['@graph'].some((node) => node['@type'] === 'Person'));
  await page.getByRole('link', { name: 'Ver experiência', exact: true }).click();
  await page.waitForTimeout(900);
  const top = await page
    .locator('#experiencia')
    .evaluate((node) => node.getBoundingClientRect().top);
  assert(top >= 60 && top <= 110, `Anchor clearance ${top}`);
  await page.evaluate(() => {
    window.__aboutEvents = [];
    window.gtag = (...args) => window.__aboutEvents.push(args);
  });
  await page.locator('.about-contact .about-button').click();
  const events = await page.evaluate(() => window.__aboutEvents);
  assert.equal(events.filter((event) => event[1] === 'about_contact_click').length, 1);
  assert(!events.some((event) => event[1] === 'generate_lead'));
  for (const link of await page
    .locator('.about-page a[href^="/"]')
    .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('href')))) {
    const response = await page.request.get(base + link);
    assert.equal(response.status(), 200, link);
  }
  const folder = process.env.ABOUT_SCREENSHOTS;
  if (folder) {
    await mkdir(folder, { recursive: true });
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + '/sobre/', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.documentElement.classList.remove('light'));
      await page.screenshot({ path: `${folder}/sobre-${width}.png`, fullPage: true });
    }
  }
  assert.deepEqual(errors, []);
  console.log(
    'Sobre: responsive layouts, timeline, education, schema, navigation and click tracking passed.',
  );
} finally {
  await browser.close();
}
