import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';
/* global window */

const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 844 } });
    const events = [];
    const submissions = [];
    let transport = 'http';
    await page.route('**/*', (route) =>
      new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort(),
    );
    await page.addInitScript(() => {
      window.diagnosticEvents = [];
      window.clarity = (...args) => window.diagnosticEvents.push(args);
    });
    await page.route('**/api/quote-events.php', async (route) => {
      events.push(route.request().postDataJSON());
      await route.fulfill({ status: 204 });
    });
    await page.route('**/api/orcamento.php', async (route) => {
      submissions.push(route.request().postDataJSON());
      if (transport === 'network') return route.abort();
      if (transport === 'invalid_response')
        return route.fulfill({ contentType: 'text/html', body: '<html>Proxy</html>' });
      if (transport === 'http') return route.fulfill({ status: 503, json: { success: false } });
      if (transport === 'rejected') return route.fulfill({ json: { success: false } });
      await route.fulfill({ json: { success: true } });
    });
    const count = (event) => events.filter((item) => item.event === event).length;
    const submit = page.getByRole('button', { name: 'Solicitar orçamento', exact: true });
    await page.goto('http://127.0.0.1:4173/orcamento/');
    await page.getByRole('button', { name: /Site Simples/ }).click();
    await submit.click();
    await expect.poll(() => count('quote_validation_error')).toBe(2);
    assert.equal(count('quote_submit_attempt'), 0);
    assert.equal(submissions.length, 0);
    await page.getByLabel(/^Nome/).fill('Teste privado');
    await page.getByLabel(/^Email/).fill('invalido');
    await submit.click();
    await expect
      .poll(() => events.some((item) => item.field === 'email' && item.reason === 'invalid_type'))
      .toBe(true);
    await page.getByLabel(/^Email/).fill('privado@example.com');
    await page.getByRole('button', { name: /Consultoria/ }).click();
    assert.equal(await page.getByLabel(/^Nome/).inputValue(), 'Teste privado');
    await page.getByRole('link', { name: 'Prefiro conversar no WhatsApp' }).evaluate((link) => {
      link.addEventListener('click', (event) => event.preventDefault());
    });
    await page.getByRole('link', { name: 'Prefiro conversar no WhatsApp' }).dispatchEvent('click', {
      cancelable: true,
    });
    await expect.poll(() => count('quote_whatsapp_click')).toBe(1);
    for (const reason of ['http', 'invalid_response', 'rejected', 'network']) {
      transport = reason;
      await submit.click();
      await page.getByRole('alert').waitFor();
      await expect.poll(() => events.some((item) => item.reason === reason)).toBe(true);
    }
    // A rejected TimeoutError exercises timeout classification without waiting 20 seconds.
    await page.evaluate(() => {
      const originalFetch = window.fetch;
      window.fetch = (input, init) =>
        input === '/api/orcamento.php'
          ? Promise.reject(new DOMException('Timeout', 'TimeoutError'))
          : originalFetch(input, init);
      window.restoreQuoteFetch = () => (window.fetch = originalFetch);
    });
    await submit.click();
    await expect.poll(() => events.some((item) => item.reason === 'timeout')).toBe(true);
    await page.evaluate(() => window.restoreQuoteFetch());
    assert.equal(count('quote_submit_success'), 0);
    transport = 'success';
    await submit.click();
    await page.getByRole('heading', { name: 'Pedido enviado!' }).waitFor();
    await expect.poll(() => count('quote_submit_success')).toBe(1);
    assert.equal(count('quote_form_start'), 1);
    assert.equal(count('quote_field_started'), 2);
    assert.equal(count('quote_submit_click'), 8);
    assert.equal(count('quote_submit_attempt'), 6);
    assert.equal(count('quote_submit_error'), 5);
    assert.equal(new Set(events.map((item) => item.session_id)).size, 1);
    for (const submission of submissions) {
      assert(events.some((item) => item.request_id === submission.request_id));
      assert.equal(submission.session_id, events[0].session_id);
    }
    assert(!JSON.stringify(events).includes('privado'));
    const clarity = await page.evaluate(() => window.diagnosticEvents);
    assert(clarity.some((args) => args[0] === 'event' && args[1] === 'quote_form_start'));
    assert(!JSON.stringify(clarity).includes('privado'));
    assert(!JSON.stringify(clarity).includes(events[0].session_id));
    // Blocked analytics, storage and diagnostic transport must not block a real submission.
    await page.addInitScript(() => {
      Object.defineProperty(window, 'sessionStorage', {
        get() {
          throw new Error('Blocked');
        },
      });
      window.crypto.randomUUID = () => {
        throw new Error('Unavailable');
      };
      window.clarity = () => {
        throw new Error('Blocked');
      };
    });
    await page.unroute('**/api/quote-events.php');
    await page.route('**/api/quote-events.php', (route) => route.abort());
    await page.goto('http://127.0.0.1:4173/orcamento/?projeto=consultoria');
    await page.getByLabel(/^Nome/).fill('Teste');
    await page.getByLabel(/^Email/).fill('teste@example.com');
    await submit.click();
    await page.getByRole('heading', { name: 'Pedido enviado!' }).waitFor();
    await page.close();
  }
  console.log(
    'Quote telemetry: validation, clicks, starts, HTTP/JSON/network/timeout, success and privacy passed on mobile/desktop (mock transport).',
  );
} finally {
  await browser.close();
}
