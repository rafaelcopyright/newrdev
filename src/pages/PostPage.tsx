import { ArrowLeft, Calendar, Clock, Play, Share2, Heart, Bookmark } from 'lucide-react';
import { posts } from '@/data';
import { PostCard } from '@/components/PostCard';
import { useNav } from '@/nav';

export default function PostPage({ id }: { id: string }) {
  const { navigate } = useNav();
  const post = posts.find((p) => p.id === id) ?? posts[0];
  const related = posts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article className="pt-16">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={post.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/40" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 lg:px-10 pt-32 pb-16">
          <button
            onClick={() => navigate({ name: 'home' })}
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors mb-8 animate-fade-up"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao início
          </button>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium border border-blue/20 bg-blue/10 text-blue-bright mb-6 animate-fade-up delay-100">
            {post.category}
          </span>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl mb-6 max-w-3xl animate-fade-up delay-200">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted animate-fade-up delay-300">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {post.readTime} de leitura
            </span>
            {post.type === 'video' && post.duration && (
              <span className="flex items-center gap-1.5 text-amber">
                <Play className="w-4 h-4" fill="currentColor" /> {post.duration}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="max-w-3xl mx-auto px-6 lg:px-10 py-16">
        {/* Floating actions */}
        <div className="hidden lg:flex flex-col gap-2 fixed left-8 top-1/2 -translate-y-1/2">
          {[
            { icon: Heart, label: 'Curtir' },
            { icon: Bookmark, label: 'Salvar' },
            { icon: Share2, label: 'Compartilhar' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              aria-label={label}
              className="w-10 h-10 rounded-xl border border-border bg-bg-elev flex items-center justify-center text-muted hover:text-blue-bright hover:border-blue/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Icon className="w-[18px] h-[18px]" />
            </button>
          ))}
        </div>

        <div className="prose-custom space-y-6 text-[17px] leading-[1.8] text-text/90">
          <p className="text-xl text-text leading-relaxed font-light border-l-2 border-blue pl-5 italic">
            {post.excerpt}
          </p>

          <h2 className="font-display-md text-3xl mt-12 mb-2">O contexto</h2>
          <p>
            Antes de entrarmos na parte técnica, vale entender por que esse tema
            ganhou tanta relevância nos últimos meses. A convergence entre
            performance, acessibilidade e experiência de desenvolvimento mudou a
            forma como arquitetamos aplicações modernas — e ignorar isso tem um
            custo real em manutenção e velocidade de entrega.
          </p>

          <p>
            O que descrevo abaixo é um modelo mental que venho refinando em projetos
            reais, não um tutorial passo a passo. A ideia é que você saia com
            clareza suficiente para adaptar ao seu próprio contexto.
          </p>

          <blockquote className="border-l-2 border-amber pl-6 py-2 my-8 text-lg font-light italic text-text/80">
            “Tecnologia bem aplicada não é a mais nova — é a que resolve o problema
            certo no momento certo.”
          </blockquote>

          <h2 className="font-display-md text-3xl mt-12 mb-2">A abordagem</h2>
          <p>
            O primeiro princípio é separar estrutura de estilo de comportamento. Isso
            parece óbvio, mas na prática a maioria das codebases mistura essas
            camadas quando cresce. A chave é definir contratos claros entre elas
            desde o início e manter essas fronteiras com linting e revisão.
          </p>

          <p>
            Em seguida, adotamos design tokens como a fonte única de verdade para
            cores, espaçamento e tipografia. Isso permite que o sistema visual
            evolua sem refactorings traumáticos e facilita a implementação de
            temas (como o modo claro/escuro deste site).
          </p>

          <pre className="bg-bg-elev2 rounded-xl p-5 overflow-x-auto border border-border text-sm font-mono text-text/80">
{`// tokens.ts
export const tokens = {
  color: { primary: '#3b82f6', accent: '#f59e0b' },
  space: { sm: 8, md: 16, lg: 24 },
  font:  { display: 200, body: 400 },
};`}
          </pre>

          <h2 className="font-display-md text-3xl mt-12 mb-2">Resultados e próximos passos</h2>
          <p>
            Aplicando esses princípios em três projetos no último ano, o tempo de
            entrega de novas features caiu em média 40% e a dívida técnica percebida
            pela equipe caiu drasticamente. Não é mágica — é disciplina de
            arquitetura aplicada com consistência.
          </p>

          <p>
            Nos próximos artigos vou aprofundar cada camada com exemplos práticos.
            Se você quiser ser avisado, assine a newsletter — o próximo sai na
            semana que vem.
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
          {post.tags.map((t) => (
            <span key={t} className="px-3 py-1.5 rounded-lg bg-bg-elev border border-border text-sm text-muted">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* RELATED */}
      <section className="max-w-8xl mx-auto px-6 lg:px-10 py-20 border-t border-border">
        <h2 className="font-display text-3xl sm:text-4xl mb-10">Continue lendo</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map((p, i) => (
            <PostCard key={p.id} post={p} index={i} />
          ))}
        </div>
      </section>
    </article>
  );
}
