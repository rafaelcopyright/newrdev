import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { render } from '../dist-ssr/entry-server.js';

const origin = 'https://rafaeldev.com.br';
const { entries, archives } = JSON.parse(await readFile('src/content/index.json', 'utf8'));
const report = JSON.parse(await readFile('docs/migration-report.json', 'utf8'));
if (report.missingSitemapPaths.length || report.mediaFailures.length)
  throw new Error('Resolve migration report before building.');
const routes = [
  ...new Set([
    '/',
    '/blog/',
    '/portfolio-de-sites/',
    '/orcamento/',
    ...entries.map((entry) => entry.path),
    ...archives.map((entry) => entry.path),
  ]),
];
const template = await readFile('dist/index.html', 'utf8');
for (const path of [...routes, '/404/']) {
  const { html, head } = await render(path);
  const output = template.replace('<!--seo-head-->', head).replace('<!--app-html-->', html);
  const directory = `dist${path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}index.html`, output);
  if (path === '/404/') await writeFile('dist/404.html', output);
}
const xml = (value) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const sitemap = (paths) =>
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths
    .map((path) => {
      const modified = entries.find((entry) => entry.path === path)?.modified;
      return `<url><loc>${xml(origin + path)}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ''}</url>`;
    })
    .join('')}</urlset>`;
await writeFile('dist/sitemap.xml', sitemap(routes));
const groups = ['post', 'page', 'portfolio', 'category', 'post_tag'];
for (const group of groups) {
  const paths =
    group === 'page'
      ? routes.filter(
          (path) =>
            ['/', '/blog/', '/orcamento/', '/portfolio-de-sites/'].includes(path) ||
            entries.some((entry) => entry.kind === 'page' && entry.path === path),
        )
      : ['category', 'post_tag'].includes(group)
        ? archives.filter((archive) => archive.type === group).map((archive) => archive.path)
        : entries.filter((entry) => entry.kind === group).map((entry) => entry.path);
  await writeFile(`dist/${group}-sitemap.xml`, sitemap(paths));
}
await writeFile(
  'dist/sitemap_index.xml',
  `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${groups.map((group) => `<sitemap><loc>${origin}/${group}-sitemap.xml</loc></sitemap>`).join('')}</sitemapindex>`,
);
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap_index.xml\n`,
);
const aliases = [...report.aliases, { from: '/portfolio/', to: '/portfolio-de-sites/' }];
const redirectRules = aliases
  .map(
    ({ from, to }) =>
      `RewriteRule ^${from.slice(1).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}?$ ${to} [R=301,L,NE]`,
  )
  .join('\n');
const queryRules = entries
  .map(
    (entry) =>
      `RewriteCond %{QUERY_STRING} ^(?:p|page_id)=${entry.wordpressId}$\nRewriteRule ^$ ${entry.path} [R=301,L,QSD]`,
  )
  .join('\n');
const base = await readFile('public/.htaccess', 'utf8');
await writeFile(
  'dist/.htaccess',
  base.replace('# migration-redirects', redirectRules + '\n' + queryRules),
);
await writeFile('docs/routes.json', JSON.stringify(routes, null, 2));
console.log(`Generated ${routes.length} static pages, 404, sitemaps and redirects.`);
