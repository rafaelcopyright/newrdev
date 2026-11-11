import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { createHash } from 'node:crypto';
import { siteConfig } from '../dist-ssr/entry-server.js';

const origin = siteConfig.canonicalOrigin;
const previewOrigin = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
const apache = await readFile('dist/.htaccess', 'utf8');
assert(apache.includes(`RewriteRule ^ ${siteConfig.origin}%{REQUEST_URI}`));
assert.equal(
  apache.includes('Header always set X-Robots-Tag "noindex, follow"'),
  !siteConfig.indexable,
);
assert(
  (await readFile('dist/sitemap_index.xml', 'utf8')).includes(
    siteConfig.origin + '/post-sitemap.xml',
  ),
);
const routes = JSON.parse(await readFile('docs/routes.json', 'utf8'));
const { entries } = JSON.parse(await readFile('src/content/index.json', 'utf8'));
const report = JSON.parse(await readFile('docs/migration-report.json', 'utf8'));
const missingLinks = [];
const legacy = JSON.parse(await readFile('docs/legacy-urls.json', 'utf8'));
for (const { path } of legacy) assert(routes.includes(path), `Missing legacy URL: ${path}`);
for (const path of routes) {
  const html = await readFile(`dist${path}index.html`, 'utf8');
  const document = new JSDOM(html).window.document;
  const googleTag = document.querySelectorAll(
    'head script[src="https://www.googletagmanager.com/gtm.js?id=GTM-5VP68DMK"]',
  );
  assert.equal(googleTag.length, 1, `Google tag: ${path}`);
  assert(googleTag[0].hasAttribute('async'));
  const initialization = document.querySelector('#google-tag-init')?.textContent;
  assert(initialization, `Google tag initialization: ${path}`);
  const tagHash = createHash('sha256').update(initialization).digest('base64');
  assert(apache.includes(`'sha256-${tagHash}'`), `Google tag CSP hash: ${path}`);
  const clarityScripts = document.querySelectorAll('head script#clarity-init');
  assert.equal(clarityScripts.length, 1, `Clarity initialization: ${path}`);
  const clarityInitialization = clarityScripts[0].textContent;
  assert(clarityInitialization.includes('"zc0j7q1yzt"'), `Clarity project: ${path}`);
  const clarityHash = createHash('sha256').update(clarityInitialization).digest('base64');
  assert(apache.includes(`'sha256-${clarityHash}'`), `Clarity CSP hash: ${path}`);
  assert.equal(document.querySelectorAll('h1').length, 1, `H1: ${path}`);
  assert.equal(document.querySelectorAll('title').length, 1, `Title: ${path}`);
  assert.equal(document.querySelectorAll('meta[name="description"]').length, 1);
  assert.equal(document.querySelector('link[rel="canonical"]').href, origin + path);
  assert.equal(
    document.querySelector('meta[name="robots"]').content.includes('noindex'),
    !siteConfig.indexable,
  );
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
    for (const candidate of (img.getAttribute('srcset') || '').split(',').filter(Boolean)) {
      await access('dist' + candidate.trim().split(/\s+/)[0]);
    }
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
  const response = await fetch(previewOrigin + path);
  assert.equal(response.status, 200, path);
  assert.equal(
    response.headers.get('x-robots-tag'),
    siteConfig.indexable ? null : 'noindex, follow',
  );
}
const missing = await fetch(previewOrigin + '/does-not-exist/');
assert.equal(missing.status, 404);
assert((await missing.text()).includes('noindex, follow'));
for (const alias of report.aliases) {
  const response = await fetch(previewOrigin + alias.from, { redirect: 'manual' });
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('location'), alias.to);
}
console.log(JSON.stringify({ checkedRoutes: routes.length, missingLinks }, null, 2));
assert.equal(missingLinks.length, 0, 'Broken internal links');
