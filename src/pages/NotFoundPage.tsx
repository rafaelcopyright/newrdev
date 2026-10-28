import { Link } from 'react-router-dom';
import Seo from '@/features/seo/Seo';
export default function NotFoundPage() {
  return (
    <section className="pt-40 pb-24 px-6 text-center">
      <Seo
        title="Página não encontrada | Rafael.dev"
        description="A página solicitada não foi encontrada. Explore o blog ou volte ao início."
        noindex
      />
      <h1 className="font-display text-5xl mb-6">Página não encontrada</h1>
      <p className="text-muted mb-8">Este endereço não existe ou foi removido.</p>
      <Link to="/blog/" className="text-blue-bright">
        Explorar o blog
      </Link>
    </section>
  );
}
