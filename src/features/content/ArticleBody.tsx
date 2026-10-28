import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';

const loaders = import.meta.glob<{ default: string }>('../../content/bodies/*.json');
const components = new Map<string, LazyExoticComponent<ComponentType>>();

function getBody(id: string) {
  const existing = components.get(id);
  if (existing) return existing;
  const load = loaders[`../../content/bodies/${id}.json`];
  if (!load) throw new Error(`Missing imported content: ${id}`);
  const component = lazy(async () => {
    const { default: html } = await load();
    // The build-time importer sanitizes HTML using DOMPurify. Never accept runtime user input here.
    return {
      default: function ImportedBody() {
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
      },
    };
  });
  components.set(id, component);
  return component;
}

export default function ArticleBody({ id, className = '' }: { id: string; className?: string }) {
  const Body = getBody(id);
  return (
    <div className={`article-body ${className}`}>
      <Suspense fallback={<p role="status">Carregando conteúdo…</p>}>
        <Body />
      </Suspense>
    </div>
  );
}
