import { ArrowUpRight, Clock, Play, Calendar } from 'lucide-react';
import type { Post } from '@/data';
import { useNav } from '@/nav';

const categoryColors: Record<Post['category'], string> = {
  'Desenvolvimento Web': 'text-blue-bright bg-blue/10 border-blue/20',
  'Inteligência Artificial': 'text-amber bg-amber/10 border-amber/20',
  'Marketing Digital': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const { navigate } = useNav();

  return (
    <article
      onClick={() => navigate({ name: 'post', id: post.id })}
      className="group cursor-pointer animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-elev transition-all duration-500 hover:border-blue/30 hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {post.type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue/30" style={{ animation: 'pulse-ring 2.5s ease-out infinite' }} />
                <div className="relative w-14 h-14 rounded-full bg-white/90 backdrop-blur flex items-center justify-center transition-transform group-hover:scale-110">
                  <Play className="w-5 h-5 text-bg ml-0.5" fill="currentColor" />
                </div>
              </div>
            </div>
          )}

          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium border backdrop-blur ${
              categoryColors[post.category]
            }`}
          >
            {post.category}
          </span>

          {post.duration && (
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/60 text-white backdrop-blur flex items-center gap-1">
              <Clock className="w-3 h-3" /> {post.duration}
            </span>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-muted mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {post.date}
            </span>
            <span>·</span>
            <span>{post.readTime} de leitura</span>
          </div>
          <h3 className="font-display-md text-xl mb-2 group-hover:text-blue-bright transition-colors duration-300">
            {post.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed line-clamp-2">{post.excerpt}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1.5">
              {post.tags.slice(0, 3).map((t) => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-bg-elev2 text-muted">
                  {t}
                </span>
              ))}
            </div>
            <ArrowUpRight className="w-4 h-4 text-muted group-hover:text-blue-bright group-hover:rotate-45 transition-all duration-300" />
          </div>
        </div>
      </div>
    </article>
  );
}
