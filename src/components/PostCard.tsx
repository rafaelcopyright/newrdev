import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import type { Post } from '@/data';

export function PostCard({ post }: { post: Post; index?: number }) {
  return (
    <article className="group rounded-2xl border border-border bg-bg-elev overflow-hidden hover:border-blue/30 transition-colors">
      <Link to={post.path} className="block">
        {post.image && (
          <img
            src={post.imageSmall}
            srcSet={post.imageSrcSet}
            sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) 45vw, 30vw"
            alt=""
            width={post.imageWidth}
            height={post.imageHeight}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover"
          />
        )}
        <div className="p-5">
          <p className="text-xs text-blue-bright mb-3">{post.category}</p>
          <div className="flex items-center gap-3 text-xs text-muted mb-3">
            <time dateTime={post.published}>{post.date}</time>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {post.readTime}
            </span>
          </div>
          <h3 className="font-display-md text-xl mb-3 group-hover:text-blue-bright">
            {post.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed line-clamp-2">{post.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm text-blue-bright">
            Ler artigo <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    </article>
  );
}
