import assert from 'node:assert/strict';
import { chromium, expect as defaultExpect } from '@playwright/test';
/* global window */

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const measurementId = 'G-3B3ZY6JK8E';
const expect = defaultExpect.configure({ timeout: 20000 });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const hits = [];
  const violations = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && message.text().includes('Content Security Policy'))
      violations.push(message.text());
  });
  // Load Google's real configuration, but intercept collection: no test leads reach Google.
  await page.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (
      url.pathname.includes('collect') &&
      (url.hostname.endsWith('google-analytics.com') ||
        url.hostname.endsWith('analytics.google.com') ||
        url.hostname === 'www.google.com')
    ) {
      for (const line of (request.postData() || '').split('\n')) {
        const params = new URLSearchParams(url.search);
        for (const [key, value] of new URLSearchParams(line)) params.set(key, value);
        if (params.get('tid') === measurementId) hits.push(Object.fromEntries(params));
      }
      return route.fulfill({ status: 204 });
    }
    if (url.origin === origin || url.hostname === 'www.googletagmanager.com')
      return route.continue();
    return route.fulfill({ status: 204 });
  });
  await page.route('**/api/quote-events.php', (route) => route.fulfill({ status: 204 }));
  await page.route('**/api/orcamento.php', (route) => route.fulfill({ json: { success: true } }));
  await page.addInitScript(() => {
    window.open = () => null;
  });
  const views = () => hits.filter((hit) => hit.en === 'page_view');
  await page.goto(origin + '/', { waitUntil: 'networkidle' });
  await expect.poll(() => views().length, { timeout: 15000 }).toBe(1);
  await page.locator('footer a[href="/blog/"]').click();
  await expect.poll(() => views().length, { timeout: 15000 }).toBe(2);
  await page.locator('footer a[href="/orcamento/"]').click();
  await expect.poll(() => views().length, { timeout: 15000 }).toBe(3);
  await page.goBack();
  await expect.poll(() => views().length, { timeout: 15000 }).toBe(4);
  await page.goForward();
  await expect.poll(() => views().length, { timeout: 15000 }).toBe(5);
  assert.deepEqual(
    views().map((hit) => new URL(hit.dl).pathname),
    ['/', '/blog/', '/orcamento/', '/blog/', '/orcamento/'],
  );
  await page.getByRole('button', { name: /Consultoria/ }).click();
  await page.getByRole('button', { name: 'Solicitar orçamento', exact: true }).click();
  await expect.poll(() => hits.some((hit) => hit.en === 'quote_validation_error')).toBe(true);
  assert(!hits.some((hit) => hit.en === 'generate_lead'));
  await page.getByLabel(/^Nome/).fill('Teste confidencial');
  await page.getByLabel(/^Email/).fill('confidencial@example.com');
  await page.getByRole('link', { name: 'Prefiro conversar no WhatsApp' }).click();
  await expect.poll(() => hits.some((hit) => hit.en === 'quote_whatsapp_click')).toBe(true);
  await page.getByRole('button', { name: 'Solicitar orçamento', exact: true }).click();
  await page.getByRole('heading', { name: 'Pedido enviado!' }).waitFor();
  await expect.poll(() => hits.filter((hit) => hit.en === 'generate_lead').length).toBe(1);
  assert(hits.some((hit) => hit.en === 'quote_form_start'));
  assert(hits.some((hit) => hit.en === 'quote_submit_success'));
  assert(!JSON.stringify(hits).includes('confidencial'));
  for (const hit of hits) {
    assert(!('ep.session_id' in hit));
    assert(!('ep.request_id' in hit));
    if (hit['ep.link_url']?.includes('wa.me')) assert(!hit['ep.link_url'].includes('text='));
  }
  assert.deepEqual(violations, []);
  console.log(
    JSON.stringify(
      {
        measurementId,
        pageViews: views().length,
        events: [...new Set(hits.map((hit) => hit.en))],
        collection: 'intercepted; no test conversions delivered',
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
