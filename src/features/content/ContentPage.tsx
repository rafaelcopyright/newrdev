import { Link } from 'react-router-dom';
import { posts, type ContentEntry } from '@/data';
import { PostCard } from '@/components/PostCard';
import Seo from '@/features/seo/Seo';
import ArticleBody from './ArticleBody';

export default function ContentPage({ entry }: { entry: ContentEntry }) {
  const related = posts
    .filter((post) => post.id !== entry.id && post.category === entry.category)
    .slice(0, 3);
  return (
    <article className="pt-32 pb-16">
      <Seo title={`${entry.seoTitle} | Rafael.dev`} description={entry.excerpt} entry={entry} />
      <header className="max-w-4xl mx-auto px-6 mb-12">
        <nav aria-label="Caminho da página" className="text-sm text-muted mb-8">
          <Link to="/">Início</Link>
          {entry.kind !== 'page' && (
            <>
              {' '}
              /{' '}
              <Link to={entry.kind === 'portfolio' ? '/portfolio-de-sites/' : '/blog/'}>
                {entry.kind === 'portfolio' ? 'Portfólio' : 'Blog'}
              </Link>
            </>
          )}
        </nav>
        <h1 className="font-display text-4xl sm:text-5xl mb-6">{entry.title}</h1>
        {entry.kind === 'post' && (
          <p className="text-sm text-muted">
            Por {entry.author} · <time dateTime={entry.published}>{entry.date}</time> ·{' '}
            {entry.readTime} de leitura
          </p>
        )}
        {entry.image && (
          <img
            src={entry.image}
            srcSet={entry.imageSrcSet}
            sizes="(max-width: 896px) calc(100vw - 48px), 848px"
            alt=""
            width={entry.imageWidth}
            height={entry.imageHeight}
            {...{ fetchpriority: 'high' }}
            className="mt-10 w-full rounded-2xl max-h-[480px] object-cover"
          />
        )}
      </header>
      <ArticleBody id={entry.id} className="max-w-3xl mx-auto px-6" />
      {entry.kind === 'post' && (
        <footer className="max-w-3xl mx-auto px-6 mt-12 flex gap-3 flex-wrap">
          {entry.terms.map((term) => (
            <Link
              key={term.type + term.slug}
              to={`/${term.type === 'category' ? 'categoria' : 'assunto'}/${term.slug}/`}
              className="text-sm text-blue-bright"
            >
              {term.name}
            </Link>
          ))}
        </footer>
      )}
      {entry.path === '/lp/' && (
        <div className="max-w-3xl mx-auto px-6 mt-10">
          <Link to="/orcamento/" className="inline-block px-6 py-3 rounded-xl bg-blue text-white">
            Solicitar orçamento
          </Link>
        </div>
      )}
      {entry.kind === 'post' && related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-20">
          <h2 className="font-display text-3xl mb-8">Continue lendo</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
