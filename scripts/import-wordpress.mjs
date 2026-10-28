import { readFile, writeFile, mkdir, access, readdir, unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { XMLParser } from 'fast-xml-parser';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import sharp from 'sharp';
import { dirname, resolve, sep } from 'node:path';

const origin = 'https://rafaeldev.com.br';
const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false });
const source = await readFile('auxiliares/rafaeldev.WordPress.2026-10-28.xml', 'utf8');
const channel = parser.parse(source).rss.channel;
const array = (value) => (value ? (Array.isArray(value) ? value : [value]) : []);
const items = array(channel.item);
const window = new JSDOM('').window;
const purify = createDOMPurify(window);
const plain = (html) => {
  const doc = new JSDOM(html).window.document;
  return doc.body.textContent.replace(/\s+/g, ' ').trim();
};
const published = items.filter(
  (item) =>
    item['wp:status'] === 'publish' && ['post', 'page', 'portfolio'].includes(item['wp:post_type']),
);
const maps = [];
for (const name of ['post', 'page', 'portfolio', 'category', 'post_tag']) {
  const sitemap = parser.parse(await readFile(`auxiliares/${name}-sitemap.xml`, 'utf8'));
  maps.push(
    ...array(sitemap.urlset.url).map((entry) => ({
      path: new URL(entry.loc).pathname,
      group: name,
    })),
  );
}
const failures = [];
const imageCache = new Map();
await mkdir('public/media', { recursive: true });
await mkdir('src/content', { recursive: true });
await mkdir('src/content/bodies', { recursive: true });

async function migrateImage(sourceUrl) {
  let url;
  try {
    url = new URL(sourceUrl, origin);
  } catch {
    return null;
  }
  if (url.origin !== origin || !url.pathname.startsWith('/wp-content/uploads/')) return null;
  if (!/\.(?:png|jpe?g|webp|gif|avif)$/i.test(url.pathname)) return null;
  const key = url.pathname;
  if (imageCache.has(key)) return imageCache.get(key);
  const job = (async () => {
    const hash = createHash('sha256').update(`${key}:webp-v2`).digest('hex').slice(0, 16);
    const base = `public/media/${hash}`;
    const infoFile = `${base}.json`;
    const mediaRoot = resolve('public/wp-content/uploads');
    const originalFile = resolve('public', '.' + decodeURIComponent(url.pathname));
    if (!originalFile.startsWith(mediaRoot + sep)) throw new Error('Unsafe media path');
    try {
      await access(infoFile);
      await access(originalFile);
      return JSON.parse(await readFile(infoFile, 'utf8'));
    } catch {
      /* Download only on first import. */
    }
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000), redirect: 'error' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.headers.get('content-type')?.startsWith('image/'))
        throw new Error('Not an image');
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length > 15 * 1024 * 1024) throw new Error('Image too large');
      const image = sharp(buffer, { limitInputPixels: 40000000 }).rotate();
      const output = await image
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality: 68 })
        .toBuffer({ resolveWithObject: true });
      await writeFile(`${base}.webp`, output.data);
      await mkdir(dirname(originalFile), { recursive: true });
      await writeFile(originalFile, buffer);
      await image
        .resize({ width: 480, withoutEnlargement: true })
        .webp({ quality: 68 })
        .toFile(`${base}-480.webp`);
      await image
        .resize({ width: 768, withoutEnlargement: true })
        .webp({ quality: 68 })
        .toFile(`${base}-768.webp`);
      const candidates = new Map([
        [Math.min(480, output.info.width), `/media/${hash}-480.webp`],
        [Math.min(768, output.info.width), `/media/${hash}-768.webp`],
        [output.info.width, `/media/${hash}.webp`],
      ]);
      const result = {
        src: `/media/${hash}.webp`,
        small: `/media/${hash}-480.webp`,
        srcset: [...candidates].map(([width, src]) => `${src} ${width}w`).join(', '),
        width: output.info.width,
        height: output.info.height,
      };
      await writeFile(infoFile, JSON.stringify(result));
      return result;
    } catch (error) {
      failures.push({ url: url.href, reason: error.message });
      return null;
    }
  })();
  imageCache.set(key, job);
  return job;
}

const entries = [];
for (const item of published) {
  const meta = Object.fromEntries(
    array(item['wp:postmeta']).map((entry) => [entry['wp:meta_key'], entry['wp:meta_value']]),
  );
  let path = new URL(item.link).pathname;
  // Yoast's current public permalink wins over a stale permalink in the WXR.
  const slug = path.split('/').filter(Boolean).at(-1);
  const current = maps.find(
    (entry) => entry.group === 'post' && entry.path.split('/').filter(Boolean).at(-1) === slug,
  );
  if (current) path = current.path;
  if (path === '/') continue;
  const raw = String(item['content:encoded'] || '').replace(
    /\[(?:\/?(?:caption|wpforms|gallery|contact-form-7))[^\]]*\]/gi,
    '',
  );
  const html = purify.sanitize(raw, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'pre',
      'code',
      'figure',
      'figcaption',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'hr',
      'div',
      'span',
    ],
    ALLOWED_ATTR: ['href', 'id', 'src', 'alt', 'width', 'height', 'colspan', 'rowspan', 'title'],
    ALLOW_DATA_ATTR: false,
  });
  const doc = new JSDOM(`<body>${html}</body>`).window.document;
  if (path === '/portfolio-de-sites/') {
    const gallery = [];
    for (const heading of doc.querySelectorAll('h5')) {
      let previous = heading.previousElementSibling;
      let image;
      let href;
      while (previous && !/^H[1-6]$/.test(previous.tagName)) {
        if (previous.tagName === 'A' && previous.getAttribute('href')?.startsWith('https://'))
          href ||= previous.getAttribute('href');
        if (previous.tagName === 'IMG') {
          image = previous.cloneNode(true);
          break;
        }
        previous = previous.previousElementSibling;
      }
      const article = doc.createElement('article');
      if (image) article.append(image);
      const title = doc.createElement('h2');
      const link = doc.createElement('a');
      link.href = href?.includes('sobasasasdosegredo.com.br')
        ? '/portfolio/sob-as-asas-do-segredo-blog-e-landing-page/'
        : href || '#';
      link.textContent = heading.textContent;
      title.append(link);
      article.append(title);
      if (heading.nextElementSibling?.tagName === 'P')
        article.append(heading.nextElementSibling.cloneNode(true));
      gallery.push(article);
    }
    doc.body.replaceChildren(...gallery);
  }
  for (const heading of doc.querySelectorAll('h1')) {
    const replacement = doc.createElement('h2');
    replacement.innerHTML = heading.innerHTML;
    heading.replaceWith(replacement);
  }
  for (const anchor of doc.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href');
    if (path === '/lp/' && href === '#Form') {
      anchor.setAttribute('href', '/orcamento/');
      continue;
    }
    if (href.startsWith('#')) continue;
    const url = new URL(href, origin);
    if (!['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) {
      anchor.removeAttribute('href');
      continue;
    }
    if (url.origin === origin) {
      const matching = maps.find(
        (entry) =>
          entry.path.split('/').filter(Boolean).at(-1) ===
          url.pathname.split('/').filter(Boolean).at(-1),
      );
      anchor.setAttribute('href', (matching?.path || url.pathname) + url.search + url.hash);
    } else anchor.setAttribute('rel', 'noopener noreferrer');
  }
  for (const anchor of doc.querySelectorAll('a')) {
    if (!anchor.textContent.trim() && !anchor.querySelector('img[alt]:not([alt=""])')) {
      if (anchor.querySelector('img')) anchor.replaceWith(...anchor.childNodes);
      else anchor.remove();
    }
  }
  for (const img of doc.querySelectorAll('img')) {
    const migrated = await migrateImage(img.getAttribute('src'));
    if (!migrated) {
      img.remove();
      continue;
    }
    img.setAttribute('src', migrated.src);
    img.setAttribute('srcset', migrated.srcset);
    img.setAttribute('sizes', '(max-width: 768px) 100vw, 768px');
    img.setAttribute('width', String(migrated.width));
    img.setAttribute('height', String(migrated.height));
    img.setAttribute('loading', 'lazy');
    img.setAttribute('decoding', 'async');
    img.setAttribute('alt', img.getAttribute('alt') || '');
  }
  const thumbnail = items.find((attachment) => attachment['wp:post_id'] === meta._thumbnail_id);
  const hero = thumbnail ? await migrateImage(thumbnail['wp:attachment_url']) : null;
  const body = doc.body.innerHTML;
  const description = String(
    meta._yoast_wpseo_metadesc ||
      plain(String(item['excerpt:encoded'] || '')) ||
      plain(body).slice(0, 157),
  );
  const terms = array(item.category).map((term) => ({
    name: term['#text'],
    slug: term['@_nicename'],
    type: term['@_domain'],
  }));
  const category = terms.find((term) => term.type === 'category')?.name || 'Desenvolvimento Web';
  entries.push({
    id: item['wp:post_name'],
    wordpressId: item['wp:post_id'],
    path,
    title: path === '/lp/' ? 'Criação de sites para sua empresa' : plain(item.title),
    seoTitle: String(
      path === '/lp/' ? 'Criação de sites profissionais' : meta._yoast_wpseo_title || item.title,
    )
      .replace(/%%[^%]+%%/g, '')
      .trim(),
    excerpt: description,
    category,
    terms,
    body,
    image: hero?.src || '',
    imageSmall: hero?.small || '',
    imageSrcSet: hero?.srcset || '',
    imageWidth: hero?.width || 0,
    imageHeight: hero?.height || 0,
    published: `${item['wp:post_date_gmt'].replace(' ', 'T')}Z`,
    modified: `${item['wp:post_modified_gmt'].replace(' ', 'T')}Z`,
    author:
      array(channel['wp:author']).find(
        (author) => author['wp:author_login'] === item['dc:creator'],
      )?.['wp:author_display_name'] || 'Rafael',
    date: new Date(`${item['wp:post_date_gmt'].replace(' ', 'T')}Z`).toLocaleDateString('pt-BR', {
      timeZone: 'UTC',
    }),
    readTime: `${Math.max(1, Math.ceil(plain(body).split(/\s+/).length / 220))} min`,
    type: 'article',
    kind: item['wp:post_type'],
    tags: terms.filter((term) => term.type === 'post_tag').map((term) => term.name),
  });
}
const archives = maps
  .filter((map) => ['category', 'post_tag'].includes(map.group))
  .map((map) => {
    const slug = map.path.split('/').filter(Boolean).at(-1);
    const type = map.group === 'category' ? 'category' : 'post_tag';
    const term = entries
      .flatMap((entry) => entry.terms)
      .find((term) => term.slug === slug && term.type === type);
    return { path: map.path, title: term?.name || slug.replaceAll('-', ' '), slug, type };
  });
await writeFile('src/content/wordpress.json', JSON.stringify({ entries, archives }, null, 2));
await writeFile(
  'src/content/index.json',
  JSON.stringify({ entries: entries.map(({ body, ...entry }) => entry), archives }, null, 2),
);
for (const entry of entries) {
  if (!/^[a-z0-9-]+$/i.test(entry.id)) throw new Error('Unsafe content slug');
  await writeFile(`src/content/bodies/${entry.id}.json`, JSON.stringify(entry.body));
}
const aliases = published
  .filter((item) => item['wp:post_type'] === 'post')
  .flatMap((item) => {
    const entry = entries.find((entry) => entry.wordpressId === item['wp:post_id']);
    const old = new URL(item.link).pathname;
    return entry && old !== entry.path ? [{ from: old, to: entry.path }] : [];
  });
const report = {
  entries: entries.map(({ wordpressId, path, kind }) => ({ wordpressId, path, kind })),
  aliases,
  missingSitemapPaths: maps.filter(
    (map) =>
      !['/', '/portfolio-de-sites/'].includes(map.path) &&
      !entries.some((entry) => entry.path === map.path) &&
      !archives.some((entry) => entry.path === map.path),
  ),
  mediaFailures: failures,
};
await mkdir('docs', { recursive: true });
await writeFile('docs/migration-report.json', JSON.stringify(report, null, 2));
await writeFile('docs/legacy-urls.json', JSON.stringify(maps, null, 2));
const activeMedia = new Set(
  (await Promise.all(imageCache.values()))
    .filter(Boolean)
    .map((image) => image.src.match(/\/([a-f0-9]{16})\.webp$/)[1]),
);
const mediaDirectory = resolve('public/media');
for (const file of await readdir(mediaDirectory)) {
  const generated = /^([a-f0-9]{16})(?:-(?:480|768))?\.(?:webp|json)$/.exec(file);
  const target = resolve(mediaDirectory, file);
  if (generated && !activeMedia.has(generated[1]) && target.startsWith(mediaDirectory + sep))
    await unlink(target);
}
console.log(
  `Imported ${entries.length} documents, ${archives.length} archives. Missing URLs: ${report.missingSitemapPaths.length}. Media failures: ${failures.length}.`,
);
window.close();
