import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import PortfolioPage from '@/pages/PortfolioPage';
import QuotePage from '@/pages/QuotePage';
import ContentPage from '@/features/content/ContentPage';
import BlogPage from '@/features/content/BlogPage';
import NotFoundPage from '@/pages/NotFoundPage';
import Seo from '@/features/seo/Seo';
import { entries, archives } from '@/data';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return (
    <div className="min-h-screen bg-bg text-text">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" key={pathname}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Seo
                  title="Rafael.dev — Desenvolvimento Web, IA e Marketing Digital"
                  description="Artigos e projetos de Rafael sobre desenvolvimento web, inteligência artificial e marketing digital. Conheça meu trabalho e vamos construir seu próximo site."
                />
                <HomePage />
              </>
            }
          />
          <Route path="/blog/" element={<BlogPage />} />
          <Route
            path="/portfolio-de-sites/"
            element={
              <>
                <Seo
                  title="Portfólio de sites | Rafael.dev"
                  description="Conheça os projetos de desenvolvimento web de Rafael e veja como cada site foi construído."
                />
                <PortfolioPage />
              </>
            }
          />
          <Route path="/portfolio/" element={<Navigate to="/portfolio-de-sites/" replace />} />
          <Route
            path="/orcamento/"
            element={
              <>
                <Seo
                  title="Solicitar orçamento | Rafael.dev"
                  description="Conte sobre seu próximo projeto de site, loja virtual ou aplicação web e solicite um orçamento."
                />
                <QuotePage />
              </>
            }
          />
          {entries
            .filter((entry) => entry.path !== '/portfolio-de-sites/')
            .map((entry) => (
              <Route key={entry.path} path={entry.path} element={<ContentPage entry={entry} />} />
            ))}
          {archives.map((archive) => (
            <Route
              key={archive.path}
              path={archive.path}
              element={<BlogPage archive={archive} />}
            />
          ))}
          <Route
            path="/css/como-centralizar-uma-div-com-css-com-diferentes-tipos-de-display/"
            element={
              <Navigate
                to="/dicas/como-centralizar-uma-div-com-css-com-diferentes-tipos-de-display/"
                replace
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
