import { useState } from 'react';
import { posts, archives } from '@/data';
import { PostCard } from '@/components/PostCard';
import Seo from '@/features/seo/Seo';

export default function BlogPage({ archive }: { archive?: (typeof archives)[number] }) {
  const [search, setSearch] = useState('');
  const title = archive?.title || 'Blog';
  const candidates = archive
    ? posts.filter((post) =>
        post.terms.some((term) => term.slug === archive.slug && term.type === archive.type),
      )
    : posts;
  const filtered = candidates.filter((post) =>
    `${post.title} ${post.excerpt}`
      .toLocaleLowerCase('pt-BR')
      .includes(search.toLocaleLowerCase('pt-BR')),
  );
  return (
    <section className="pt-32 pb-20 max-w-7xl mx-auto px-6">
      <Seo
        title={`${title} | Rafael.dev`}
        description={`Artigos de ${archive?.title || 'desenvolvimento web, tecnologia e dicas práticas'} no blog de Rafael. Explore tutoriais e conteúdos para o seu próximo projeto.`}
      />
      <h1 className="font-display text-5xl mb-6">{title}</h1>
      <p className="text-muted mb-8">Tutoriais, ideias e experiências em desenvolvimento web.</p>
      <label className="block mb-10 max-w-lg">
        <span className="block mb-2">Buscar artigos</span>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full p-3 rounded-xl border border-border bg-bg-elev"
        />
      </label>
      <h2 className="sr-only">Artigos</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {filtered.length === 0 && <p role="status">Nenhum artigo encontrado.</p>}
    </section>
  );
}
