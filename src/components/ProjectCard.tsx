import { Link } from 'react-router-dom';
import type { Project } from '@/data';
export function ProjectCard({ project }: { project: Project; index?: number }) {
  return (
    <article className="rounded-2xl border border-border overflow-hidden bg-bg-elev">
      <Link to={project.path} className="block hover:text-blue-bright">
        {project.image && (
          <img
            src={project.imageSmall}
            srcSet={project.imageSrcSet}
            sizes="(max-width: 767px) calc(100vw - 48px), 30vw"
            alt=""
            loading="lazy"
            width={project.imageWidth}
            height={project.imageHeight}
            className="aspect-video w-full object-cover"
          />
        )}
        <div className="p-6">
          <h3 className="font-display-md text-2xl mb-3">{project.title}</h3>
          <p className="text-muted text-sm">{project.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
