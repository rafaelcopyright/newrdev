import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { chromium, expect } from '@playwright/test';
/* global window, document, innerWidth */

const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const output = process.env.SCREENSHOT_DIR || join(tmpdir(), 'rafaeldev-campaigns');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const [campaign, path, project] of [
    ['sites', '/criacao-de-sites/', 'Site Simples'],
    ['sistemas', '/desenvolvimento-de-sistemas/', 'Sistema'],
  ]) {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: width < 768 ? 844 : 1000 } });
      const events = [];
      const requests = [];
      const errors = [];
      let success = false;
      page.on('pageerror', (error) => errors.push(error.message));
      await page.route('**/*', (route) =>
        new URL(route.request().url()).origin === origin ? route.continue() : route.abort(),
      );
      await page.route('**/api/quote-events.php', async (route) => {
        events.push(route.request().postDataJSON());
        await route.fulfill({ status: 204 });
      });
      await page.route('**/api/orcamento.php', async (route) => {
        requests.push(route.request().postDataJSON());
        await route.fulfill({ status: success ? 200 : 503, json: { success } });
      });
      await page.addInitScript(() => {
        window.openedWhatsApp = [];
        window.open = (...args) => {
          window.openedWhatsApp.push(args);
          return null;
        };
      });
      assert.equal((await page.goto(origin + path)).status(), 200);
      await page.evaluate(() => {
        window.campaignAnalytics = [];
        window.openaiConversions = [];
        window.oaiq = (...args) => window.openaiConversions.push(args);
        window.gtag = (...args) => window.campaignAnalytics.push(args);
      });
      await expect(page.locator('h1')).toHaveCount(1);
      assert.equal(await page.locator('header').count(), 1);
      assert.equal(await page.locator('form :required').count(), 2);
      assert.equal(await page.locator('form input:visible, form textarea:visible').count(), 3);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        'https://rafaeldev.com.br' + path,
      );
      const heroCta = page.locator('.campaign-hero a[target="_blank"]');
      const box = await heroCta.boundingBox();
      assert(
        box.y + box.height < (width < 768 ? 844 - 75 : 1000),
        'Primary CTA below first viewport',
      );
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: join(output, `${campaign}-${width}-hero.png`) });
      await page.screenshot({ path: join(output, `${campaign}-${width}.png`), fullPage: true });
      await heroCta.click();
      await expect
        .poll(() =>
          events.some(
            (event) =>
              event.event === 'quote_whatsapp_click' &&
              event.campaign === campaign &&
              event.position === 'hero',
          ),
        )
        .toBe(true);
      const opened = await page.evaluate(() => window.openedWhatsApp);
      assert(
        new URL(opened[0][0]).searchParams
          .get('text')
          .includes(campaign === 'sites' ? 'sites e blogs' : 'sistemas sob medida'),
      );
      await page.locator('a[href="#formulario"]').click();
      await expect
        .poll(async () => (await page.locator('#formulario').boundingBox()).y)
        .toBeGreaterThanOrEqual(72);
      await expect
        .poll(async () => (await page.locator('#formulario').boundingBox()).y)
        .toBeLessThan(125);
      await page
        .getByRole('button', { name: 'Quero conversar sobre meu projeto', exact: true })
        .click();
      await expect
        .poll(() => events.filter((event) => event.event === 'quote_validation_error').length)
        .toBe(2);
      assert.equal(requests.length, 0);
      await page.getByLabel(/^Nome/).fill('   ');
      await page.getByLabel(/^E-mail/).fill('teste@example.com');
      await page
        .getByRole('button', { name: 'Quero conversar sobre meu projeto', exact: true })
        .click();
      await expect.poll(() => events.some((event) => event.reason === 'pattern')).toBe(true);
      assert.equal(requests.length, 0);
      await page.getByLabel(/^Nome/).fill('Teste privado');
      await page.getByLabel(/^E-mail/).fill('teste@example.com');
      if (width < 768) await expect(page.locator('.campaign-mobile-cta')).toBeHidden();
      await page
        .getByRole('button', { name: 'Quero conversar sobre meu projeto', exact: true })
        .click();
      await page.getByRole('alert').waitFor();
      assert.equal(await page.getByLabel(/^Nome/).inputValue(), 'Teste privado');
      assert(
        !(await page.evaluate(() => window.campaignAnalytics)).some(
          (args) => args[1] === 'generate_lead',
        ),
      );
      success = true;
      assert(
        !(await page.evaluate(() => window.campaignAnalytics)).some(
          (args) =>
            args[1] === 'conversion' && args[2]?.send_to === 'AW-18568226466/RaHHCNvTuLYdEKLNgpZF',
        ),
        'Google Ads Sistemas conversion on failed submission',
      );
      assert.deepEqual(
        await page.evaluate(() => window.openaiConversions),
        [],
        'OpenAI conversion on failed submission',
      );
      await page.locator('form').evaluate((form) => {
        form.requestSubmit();
        form.requestSubmit();
      });
      await page.getByRole('status').filter({ hasText: 'Solicitação enviada.' }).waitFor();
      await expect
        .poll(() => events.filter((event) => event.event === 'quote_submit_success').length)
        .toBe(1);
      assert.equal(requests.length, 2, 'Duplicate submission');
      const payload = requests[1];
      assert.equal(payload.campaign, campaign);
      assert.equal(payload.project, project);
      assert.equal(payload.website, '');
      assert.equal(payload.details.length, 4);
      assert(payload.details.some((field) => field.value === path));
      const analytics = await page.evaluate(() => window.campaignAnalytics);
      assert.equal(
        analytics.filter(
          (args) =>
            args[1] === 'conversion' && args[2]?.send_to === 'AW-18568226466/RaHHCNvTuLYdEKLNgpZF',
        ).length,
        campaign === 'sistemas' ? 1 : 0,
        'Google Ads Sistemas conversion must fire once and only for Sistemas',
      );
      const leads = analytics.filter((args) => args[1] === 'generate_lead');
      assert.equal(leads.length, 1);
      assert.equal(leads[0][2].landing_campaign, campaign);
      assert.deepEqual(
        await page.evaluate(() => window.openaiConversions),
        campaign === 'sistemas'
          ? [['measure', 'registration_completed', { type: 'customer_action' }]]
          : [],
        'OpenAI conversion must fire once and only for Sistemas',
      );
      assert(!JSON.stringify(events).includes('teste@example.com'));
      assert(!JSON.stringify(analytics).includes('teste@example.com'));
      await page.locator('details summary').first().click();
      await expect(page.locator('details[open]')).toHaveCount(1);
      await page.getByRole('button', { name: 'Alternar tema', exact: true }).click();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({
        path: join(output, `${campaign}-${width}-light.png`),
        fullPage: true,
      });
      assert.deepEqual(errors, []);
      await page.close();
    }
  }
  console.log(
    `Campaigns passed: mobile/desktop, first viewport, form validation/failure/success, duplicate prevention, WhatsApp, themes, metadata and privacy. Screenshots: ${output}`,
  );
} finally {
  await browser.close();
}
