export type Post = {
  id: string;
  title: string;
  excerpt: string;
  category: 'Desenvolvimento Web' | 'Inteligência Artificial' | 'Marketing Digital';
  date: string;
  readTime: string;
  image: string;
  type: 'article' | 'video';
  duration?: string;
  tags: string[];
};

export type Project = {
  id: string;
  title: string;
  client: string;
  year: string;
  category: string;
  excerpt: string;
  image: string;
  tags: string[];
};

export const posts: Post[] = [
  {
    id: 'arquitetura-css-moderna',
    title: 'Arquitetura CSS moderna: do caos à escala',
    excerpt:
      'Como estruturar CSS em projetos grandes usando utility-first, design tokens e convenções que sobrevivem ao tempo.',
    category: 'Desenvolvimento Web',
    date: '12 Out 2026',
    readTime: '8 min',
    image:
      'https://images.pexels.com/photos/256502/pexels-photo-256502.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    type: 'article',
    tags: ['CSS', 'Arquitetura', 'Frontend'],
  },
  {
    id: 'agentes-autonomos-na-pratica',
    title: 'Agentes autônomos na prática: construindo seu primeiro pipeline',
    excerpt:
      'Um guia direto sobre como orquestrar modelos de linguagem com ferramentas externas para automatizar fluxos reais.',
    category: 'Inteligência Artificial',
    date: '28 Set 2026',
    readTime: '12 min',
    image:
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    type: 'article',
    tags: ['IA', 'Automação', 'LLM'],
  },
  {
    id: 'seo-tecnico-2026',
    title: 'SEO técnico que importa em 2026',
    excerpt:
      'Core Web Vitals, indexação semântica e a nova onda de busca com IA — o que otimizar agora para aparecer.',
    category: 'Marketing Digital',
    date: '15 Set 2026',
    readTime: '6 min',
    image:
      'https://images.pexels.com/photos/106344/pexels-photo-106344.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    type: 'article',
    tags: ['SEO', 'Performance', 'Conteúdo'],
  },
  {
    id: 'video-react-server-components',
    title: 'React Server Components explicado visualmente',
    excerpt:
      'Uma animação de 7 minutos que desmistifica o streaming de UI e o modelo mental por trás do RSC.',
    category: 'Desenvolvimento Web',
    date: '02 Set 2026',
    readTime: '7 min',
    duration: '07:42',
    image:
      'https://images.pexels.com/photos/14553707/pexels-photo-14553707.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    type: 'video',
    tags: ['React', 'RSC', 'Frontend'],
  },
  {
    id: 'video-fine-tuning-lucro',
    title: 'Fine-tuning vs RAG: quando investir em cada um',
    excerpt:
      'Comparativo financeiro e técnico para decidir o caminho certo ao personalizar modelos de IA.',
    category: 'Inteligência Artificial',
    date: '20 Ago 2026',
    readTime: '5 min',
    duration: '05:18',
    image:
      'https://images.pexels.com/photos/14314636/pexels-photo-14314636.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    type: 'video',
    tags: ['IA', 'RAG', 'Fine-tuning'],
  },
  {
    id: 'video-funnels-conversao',
    title: 'Construindo funis de conversão que não quebram',
    excerpt:
      'A anatomura de um funil digital saudável — da primeira impressão ao checkout — com métricas reais.',
    category: 'Marketing Digital',
    date: '08 Ago 2026',
    readTime: '9 min',
    duration: '09:05',
    image:
      'https://images.pexels.com/photos/577195/pexels-photo-577195.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    type: 'video',
    tags: ['Funis', 'Conversão', 'Analytics'],
  },
];

export const projects: Project[] = [
  {
    id: 'plataforma-saas-fintech',
    title: 'Plataforma SaaS para Fintech',
    client: 'NovaPay',
    year: '2026',
    category: 'Sistema',
    excerpt:
      'Dashboard em tempo real com gestão de transações, compliance e relatórios fiscais automatizados.',
    image:
      'https://images.pexels.com/photos/4955393/pexels-photo-4955393.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['React', 'Supabase', 'Realtime', 'Charts'],
  },
  {
    id: 'ecommerce-moda-sustentavel',
    title: 'E-commerce de Moda Sustentável',
    client: 'Linha Verde',
    year: '2026',
    category: 'E-Commerce',
    excerpt:
      'Loja completa com checkout otimizado, catálogo inteligente e integração com gestão de estoque.',
    image:
      'https://images.pexels.com/photos/34577/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Next.js', 'Stripe', 'CMS', 'SEO'],
  },
  {
    id: 'portal-jornalismo-dados',
    title: 'Portal de Jornalismo de Dados',
    client: 'Dados Abertos',
    year: '2025',
    category: 'Portal/Blog',
    excerpt:
      'Publicação com visualizações interativas, busca semântica e CMS headless para equipe editorial.',
    image:
      'https://images.pexels.com/photos/4884116/pexels-photo-4884116.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Vue', 'D3.js', 'Headless CMS', 'A11y'],
  },
  {
    id: 'landing-startup-ia',
    title: 'Landing Page para Startup de IA',
    client: 'Mindflow',
    year: '2025',
    category: 'Site Simples',
    excerpt:
      'Site institucional com animações sob medida, formulário de captura e blog técnico integrado.',
    image:
      'https://images.pexels.com/photos/5793947/pexels-photo-5793947.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Astro', 'Tailwind', 'Animação', 'Lead gen'],
  },
  {
    id: 'app-saude-mobile',
    title: 'App de Saúde Mobile',
    client: 'Vitalis',
    year: '2025',
    category: 'Sistema',
    excerpt:
      'Aplicativo de acompanhamento de saúde com lembretes, gráficos de evolução e sincronização com wearables.',
    image:
      'https://images.pexels.com/photos/38639/mockup-psd-ipad-iphone-38639.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['React Native', 'Expo', 'Health API'],
  },
  {
    id: 'consultoria-rebrand-digital',
    title: 'Consultoria de Rebrand Digital',
    client: 'Studio Aria',
    year: '2024',
    category: 'Consultoria',
    excerpt:
      'Diagnóstico completo de presença digital, nova identidade visual e estratégia de conteúdo em 90 dias.',
    image:
      'https://images.pexels.com/photos/669228/pexels-photo-669228.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    tags: ['Branding', 'Estratégia', 'Conteúdo', 'Design'],
  },
];
