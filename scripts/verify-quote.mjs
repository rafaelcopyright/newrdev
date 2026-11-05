import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://127.0.0.1:4173/orcamento/');
  await page.getByRole('button', { name: /Site Simples/ }).click();
  await page.getByLabel('Nome completo').fill('Cliente Teste');
  await page.getByLabel('Email', { exact: false }).fill('cliente@example.com');
  await page.getByLabel('Número de páginas').fill('4');
  const whatsapp = new URL(
    await page.getByRole('link', { name: 'Chame no WhatsApp' }).getAttribute('href'),
  );
  assert.equal(whatsapp.pathname, '/5511969005617');
  assert.match(whatsapp.searchParams.get('text'), /Nome completo: Cliente Teste/);
  assert.match(whatsapp.searchParams.get('text'), /Número de páginas: 4/);
  await page.route('**/api/orcamento.php', (route) =>
    route.fulfill({ status: 503, json: { success: false } }),
  );
  await page.getByRole('button', { name: 'Enviar por Email' }).click();
  await page.getByRole('alert').waitFor();
  assert.equal(await page.getByLabel('Nome completo').inputValue(), 'Cliente Teste');
  await page.unroute('**/api/orcamento.php');
  await page.route('**/api/orcamento.php', async (route) => {
    const data = route.request().postDataJSON();
    assert.equal(data.email, 'cliente@example.com');
    assert.equal(data.website, '');
    assert.equal(data.project, 'Site Simples');
    await route.fulfill({ json: { success: true } });
  });
  await page.getByRole('button', { name: 'Enviar por Email' }).click();
  await page.getByRole('heading', { name: 'Pedido enviado!' }).waitFor();
  console.log('Quote email success/failure and WhatsApp checks passed (mocked transport).');
} finally {
  await browser.close();
}
