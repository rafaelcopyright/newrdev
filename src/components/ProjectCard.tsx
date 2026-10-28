import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/data';
import { useNav } from '@/nav';

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const { navigate } = useNav();

  return (
    <article
      onClick={() => navigate({ name: 'project', id: project.id })}
      className="group cursor-pointer animate-fade-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-elev transition-all duration-500 hover:border-blue/30 hover:-translate-y-1">
        <div className="relative aspect-[16/11] overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/50 text-white backdrop-blur border border-white/10">
            {project.category}
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span>{project.client}</span>
            <span>{project.year}</span>
          </div>
          <h3 className="font-display-md text-xl mb-2 group-hover:text-blue-bright transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed line-clamp-2">{project.excerpt}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 3).map((t) => (
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
