import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const origin = 'https://rafaeldev.com.br';
const routes = JSON.parse(await readFile('docs/routes.json', 'utf8'));
const { entries } = JSON.parse(await readFile('src/content/index.json', 'utf8'));
const report = JSON.parse(await readFile('docs/migration-report.json', 'utf8'));
const missingLinks = [];
const legacy = JSON.parse(await readFile('docs/legacy-urls.json', 'utf8'));
for (const { path } of legacy) assert(routes.includes(path), `Missing legacy URL: ${path}`);
for (const path of routes) {
  const html = await readFile(`dist${path}index.html`, 'utf8');
  const document = new JSDOM(html).window.document;
  assert.equal(document.querySelectorAll('h1').length, 1, `H1: ${path}`);
  assert.equal(document.querySelectorAll('title').length, 1, `Title: ${path}`);
  assert.equal(document.querySelectorAll('meta[name="description"]').length, 1);
  assert.equal(document.querySelector('link[rel="canonical"]').href, origin + path);
  assert(!html.includes('<!--app-html-->'));
  const content = entries.find((entry) => entry.path === path);
  if (content && path !== '/portfolio-de-sites/')
    assert(
      document.querySelector('.article-body').textContent.length > 30,
      `Missing static content: ${path}`,
    );
  for (const node of document.querySelectorAll('*')) {
    for (const attribute of node.attributes) {
      assert(!attribute.name.startsWith('on'), `Inline handler in ${path}`);
      assert(!/^(?:javascript|vbscript|data):/i.test(attribute.value), `Unsafe URL in ${path}`);
    }
  }
  for (const img of document.querySelectorAll('img')) {
    assert(img.hasAttribute('width') && img.hasAttribute('height'), `Image dimensions: ${path}`);
    await access('dist' + img.getAttribute('src'));
  }
  for (const link of document.querySelectorAll('a[href^="#"]')) {
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    if (id) assert(document.getElementById(id), `Broken fragment: ${path}#${id}`);
  }
  for (const link of document.querySelectorAll('a[href^="/"]')) {
    const target = new URL(link.getAttribute('href'), origin).pathname;
    if (routes.includes(target) || report.aliases.some((alias) => alias.from === target)) continue;
    try {
      await access('dist' + decodeURIComponent(target));
    } catch {
      missingLinks.push({ path, target });
    }
  }
  const response = await fetch('http://127.0.0.1:4173' + path);
  assert.equal(response.status, 200, path);
}
const missing = await fetch('http://127.0.0.1:4173/does-not-exist/');
assert.equal(missing.status, 404);
assert((await missing.text()).includes('noindex, follow'));
for (const alias of report.aliases) {
  const response = await fetch('http://127.0.0.1:4173' + alias.from, { redirect: 'manual' });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), alias.to);
}
console.log(JSON.stringify({ checkedRoutes: routes.length, missingLinks }, null, 2));
assert.equal(missingLinks.length, 0, 'Broken internal links');
