import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
/* global window */
const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.route('**/*', (route) =>
    new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort(),
  );
  await page.route('**/api/quote-events.php', (route) => route.fulfill({ status: 204 }));
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 1000 },
  ]) {
    await page.setViewportSize(viewport);
    for (const [slug, type, field] of [
      ['site-simples', 'Site Simples', 'Número de páginas'],
      ['portal-blog', 'Portal/Blog', 'Volume de publicações/mês'],
      ['e-commerce', 'E-Commerce', 'Catálogo (nº de produtos)'],
      ['sistema', 'Sistema', 'Usuários simultâneos estimados'],
      ['consultoria', 'Consultoria', 'Área de foco'],
    ]) {
      await page.goto(`${origin}/orcamento/?projeto=${slug}&utm_source=teste`);
      await expect(page.getByRole('button', { name: new RegExp(type) })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect
        .poll(async () => (await page.locator('form').boundingBox()).y)
        .toBeGreaterThanOrEqual(64);
      await expect.poll(async () => (await page.locator('form').boundingBox()).y).toBeLessThan(120);
      await page.getByText('Adicionar detalhes (opcional)', { exact: true }).click();
      await expect(page.getByLabel(field)).toBeVisible();
      assert.match(page.url(), /utm_source=teste/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/orcamento\/$/);
    }
  }
  for (const query of ['', '?projeto=invalido', '?utm_source=teste']) {
    await page.goto(origin + '/orcamento/' + query);
    await expect(page.locator('form')).toHaveCount(0);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/orcamento/');
  await page.getByRole('button', { name: /Site Simples/ }).click();
  await page.getByLabel(/^Nome/).fill('Cliente Teste');
  await page.getByLabel('Email', { exact: false }).fill('cliente@example.com');
  await page.getByText('Adicionar detalhes (opcional)', { exact: true }).click();
  await page.getByLabel('Número de páginas').fill('4');
  const whatsappLink = page.getByRole('link', { name: 'Prefiro conversar no WhatsApp' });
  assert.equal(await whatsappLink.getAttribute('href'), 'https://wa.me/5511969005617');
  await page.evaluate(() => {
    window.open = (url) => {
      window.testWhatsAppUrl = url;
      return null;
    };
  });
  await whatsappLink.click();
  const whatsapp = new URL(await page.evaluate(() => window.testWhatsAppUrl));
  assert.equal(whatsapp.pathname, '/5511969005617');
  assert.match(whatsapp.searchParams.get('text'), /Nome: Cliente Teste/);
  assert.match(whatsapp.searchParams.get('text'), /Número de páginas: 4/);
  await page.evaluate(() => {
    window.quoteConversionEvents = [];
    window.gtag = (...args) => window.quoteConversionEvents.push(args);
  });
  await page.route('**/api/orcamento.php', (route) =>
    route.fulfill({ status: 503, json: { success: false } }),
  );
  await page.getByRole('button', { name: 'Solicitar orçamento' }).click();
  await page.getByRole('alert').waitFor();
  assert.equal(await page.getByLabel(/^Nome/).inputValue(), 'Cliente Teste');
  assert.deepEqual(
    await page.evaluate(() =>
      window.quoteConversionEvents.filter((args) =>
        ['conversion', 'generate_lead'].includes(args[1]),
      ),
    ),
    [],
  );
  await page.unroute('**/api/orcamento.php');
  await page.route('**/api/orcamento.php', async (route) => {
    const data = route.request().postDataJSON();
    assert.equal(data.email, 'cliente@example.com');
    assert.equal(data.website, '');
    assert.equal(data.project, 'Site Simples');
    await route.fulfill({ json: { success: true } });
  });
  await page.getByRole('button', { name: 'Solicitar orçamento' }).click();
  await page.getByRole('heading', { name: 'Pedido enviado!' }).waitFor();
  const recorded = await page.evaluate(() => window.quoteConversionEvents);
  assert.equal(recorded.filter((args) => args[1] === 'generate_lead').length, 1);
  assert.deepEqual(
    recorded.filter((args) => args[1] === 'conversion'),
    [
      [
        'event',
        'conversion',
        {
          send_to: 'AW-18568226466/ZkgtCPGrgLYdEKLNgpZF',
          value: 1,
          currency: 'BRL',
        },
      ],
      ['event', 'conversion', { send_to: 'AW-18568226466/RaHHCNvTuLYdEKLNgpZF' }],
    ],
  );
  console.log('Quote email success/failure and WhatsApp checks passed (mocked transport).');
} finally {
  await browser.close();
}
