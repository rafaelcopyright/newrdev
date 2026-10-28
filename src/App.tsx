import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import PostPage from '@/pages/PostPage';
import PortfolioPage from '@/pages/PortfolioPage';
import ProjectPage from '@/pages/ProjectPage';
import QuotePage from '@/pages/QuotePage';
import { NavContext, initTheme, type Page } from '@/nav';

function App() {
  const [page, setPage] = useState<Page>({ name: 'home' });

  useEffect(() => {
    initTheme();
  }, []);

  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const render = () => {
    switch (page.name) {
      case 'home':
        return <HomePage />;
      case 'post':
        return <PostPage id={page.id} />;
      case 'portfolio':
        return <PortfolioPage />;
      case 'project':
        return <ProjectPage id={page.id} />;
      case 'quote':
        return <QuotePage />;
    }
  };

  return (
    <NavContext.Provider value={{ navigate, page }}>
      <div className="min-h-screen bg-bg text-text">
        <Header />
        <main key={page.name + ('id' in page ? page.id : '')} className="animate-fade-in">
          {render()}
        </main>
        <Footer />
      </div>
    </NavContext.Provider>
  );
}

export default App;
