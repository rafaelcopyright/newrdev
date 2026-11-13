import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import type { ContentEntry } from '@/data';
import { siteConfig } from '@/config/site';

const origin = siteConfig.canonicalOrigin;
type Props = {
  title: string;
  description: string;
  entry?: ContentEntry;
  noindex?: boolean;
  structuredData?: Record<string, unknown>;
};
export default function Seo({ title, description, entry, noindex = false, structuredData }: Props) {
  const { pathname } = useLocation();
  const canonical = origin + pathname;
  const image = siteConfig.origin + (entry?.image || '/social.png');
  const schema = entry
    ? {
        '@context': 'https://schema.org',
        '@type': entry.kind === 'post' ? 'BlogPosting' : 'WebPage',
        headline: entry.title,
        description,
        url: canonical,
        mainEntityOfPage: canonical,
        datePublished: entry.published,
        dateModified: entry.modified,
        author: { '@type': 'Person', name: entry.author, url: origin + '/sobre/' },
        ...(entry.image ? { image: [image] } : {}),
        inLanguage: 'pt-BR',
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Rafael.dev',
        url: origin,
        inLanguage: 'pt-BR',
      };
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={
          noindex || !siteConfig.indexable
            ? 'noindex, follow'
            : 'index, follow, max-image-preview:large'
        }
      />
      <link rel="canonical" href={canonical} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Rafael.dev" />
      <meta property="og:type" content={entry?.kind === 'post' ? 'article' : 'website'} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {entry?.kind === 'post' && (
        <meta property="article:published_time" content={entry.published} />
      )}
      {entry?.kind === 'post' && <meta property="article:modified_time" content={entry.modified} />}
      <script type="application/ld+json">
        {JSON.stringify(structuredData ?? schema).replace(/</g, '\\u003c')}
      </script>
      {entry && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Início', item: origin + '/' },
              { '@type': 'ListItem', position: 2, name: entry.title, item: canonical },
            ],
          }).replace(/</g, '\\u003c')}
        </script>
      )}
    </Helmet>
  );
}
