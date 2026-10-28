import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('dist');
const apache = await readFile('dist/.htaccess', 'utf8');
const headers = [...apache.matchAll(/^Header always set ([\w-]+) "([^"]+)"$/gm)].map((match) => [
  match[1],
  match[2],
]);
const { aliases } = JSON.parse(await readFile('docs/migration-report.json', 'utf8'));
const { entries } = JSON.parse(await readFile('src/content/index.json', 'utf8'));
const routes = JSON.parse(await readFile('docs/routes.json', 'utf8'));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
};
const server = createServer(async (request, response) => {
  for (const [name, value] of headers) response.setHeader(name, value);
  const url = new URL(request.url, 'http://localhost');
  let path;
  try {
    path = decodeURIComponent(url.pathname);
  } catch {
    response.writeHead(400).end();
    return;
  }
  const alias = aliases.find((alias) => alias.from.replace(/\/$/, '') === path.replace(/\/$/, ''));
  const queryId = url.searchParams.get('p') || url.searchParams.get('page_id');
  const queryTarget =
    path === '/' && queryId ? entries.find((entry) => entry.wordpressId === queryId)?.path : null;
  const target =
    queryTarget ||
    alias?.to ||
    (path === '/portfolio/'
      ? '/portfolio-de-sites/'
      : routes.includes(path + '/')
        ? path + '/'
        : null);
  if (target) {
    response.writeHead(301, { Location: target }).end();
    return;
  }
  const file = resolve(root, '.' + path, ...(path.endsWith('/') ? ['index.html'] : []));
  if (!file.startsWith(root + sep) || path.split('/').some((part) => part.startsWith('.'))) {
    response.writeHead(403).end();
    return;
  }
  try {
    const buffer = await readFile(file);
    response.writeHead(200, {
      'Content-Type': types[extname(file)] || 'application/octet-stream',
      'Cache-Control': /\.(webp|js|css|woff2)$/.test(file)
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    response.end(buffer);
  } catch {
    try {
      const html = await readFile(resolve(root, '404.html'));
      response.writeHead(404, { 'Content-Type': types['.html'] });
      response.end(html);
    } catch {
      response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Build indisponível. Execute npm run build.');
    }
  }
});
server.listen(4173, '127.0.0.1', () => console.log('Static build at http://127.0.0.1:4173'));
