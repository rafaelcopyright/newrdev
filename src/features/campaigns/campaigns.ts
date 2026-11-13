export type CampaignId = 'sites' | 'sistemas';

export type Campaign = {
  id: CampaignId;
  path: string;
  project: 'Site Simples' | 'Sistema';
  projectSlug: 'site-simples' | 'sistema';
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
  cta: string;
  whatsapp: string;
  metaTitle: string;
  benefits: { title: string; description: string }[];
  solutions: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
};

export const campaigns: Record<CampaignId, Campaign> = {
  sites: {
    id: 'sites',
    path: '/criacao-de-sites/',
    project: 'Site Simples',
    projectSlug: 'site-simples',
    eyebrow: 'Criação de sites institucionais e blogs',
    title: 'Um site que apresenta seu negócio e',
    emphasis: 'aproxima novos clientes.',
    description:
      'Mostre seus serviços, publique seu conteúdo e facilite o contato pelo celular. Eu cuido do desenvolvimento e você fala direto com quem está criando seu site.',
    cta: 'Conversar sobre meu site',
    whatsapp:
      'Olá, Rafael! Vim pela página de criação de sites e blogs. Quero conversar sobre um projeto para o meu negócio.',
    metaTitle: 'Criação de sites institucionais e blogs | Rafael.dev',
    benefits: [
      {
        title: 'Seu trabalho bem apresentado',
        description:
          'Uma estrutura que explica o que você faz, para quem atende e como entrar em contato.',
      },
      {
        title: 'Fácil de usar pelo celular',
        description:
          'Textos legíveis, navegação direta e botões de contato onde o visitante precisa deles.',
      },
      {
        title: 'Conteúdo com organização',
        description:
          'Páginas e artigos com uma base de SEO para ajudar os buscadores a entenderem seu conteúdo.',
      },
    ],
    solutions: [
      {
        title: 'Site institucional',
        description:
          'Apresente sua empresa, seus serviços e seus diferenciais. Dê ao cliente um endereço para conhecer seu trabalho antes de conversar.',
      },
      {
        title: 'Blog ou portal de conteúdo',
        description:
          'Organize artigos por assunto e mantenha seu conteúdo em um espaço próprio, com uma estrutura pensada para leitura e publicação.',
      },
    ],
    faq: [
      {
        question: 'Ainda não tenho textos, logo ou domínio. Posso começar?',
        answer:
          'Sim. Na primeira conversa, identificamos o que você já tem e o que precisa ser preparado. A proposta deixa claro o que faz parte do desenvolvimento e quais materiais serão necessários.',
      },
      {
        question: 'Quanto custa e quanto tempo leva?',
        answer:
          'Depende do número de páginas, do conteúdo e das funcionalidades. Primeiro entendo sua necessidade; depois apresento o escopo, o valor e o prazo para você avaliar antes de contratar.',
      },
      {
        question: 'Vou conseguir publicar no blog ou atualizar o site?',
        answer:
          'Podemos incluir um painel de edição, como WordPress, conforme o que você precisa atualizar. Essa escolha é feita no planejamento e fica definida na proposta.',
      },
      {
        question: 'Meu site vai aparecer no Google?',
        answer:
          'O projeto pode incluir a estrutura técnica para indexação e organização de conteúdo. Posição no Google depende também da concorrência, da relevância e da continuidade do trabalho; não prometo uma colocação específica.',
      },
    ],
  },
  sistemas: {
    id: 'sistemas',
    path: '/desenvolvimento-de-sistemas/',
    project: 'Sistema',
    projectSlug: 'sistema',
    eyebrow: 'Sistemas web, PWAs e aplicativos sob medida',
    title: 'Organize sua operação em um sistema',
    emphasis: 'feito para ela.',
    description:
      'Centralize cadastros, documentos e tarefas que hoje se espalham por planilhas e mensagens. Eu desenvolvo a ferramenta a partir da rotina da sua equipe.',
    cta: 'Conversar sobre meu sistema',
    whatsapp:
      'Olá, Rafael! Vim pela página de sistemas sob medida. Quero conversar sobre uma ferramenta para organizar a operação da minha empresa.',
    metaTitle: 'Desenvolvimento de sistemas web e aplicativos | Rafael.dev',
    benefits: [
      {
        title: 'Informações no mesmo lugar',
        description:
          'Cadastros, documentos e histórico conectados para sua equipe encontrar o que precisa.',
      },
      {
        title: 'Menos tarefas repetidas',
        description:
          'Fluxos de cadastro, acompanhamento e aprovação desenhados a partir do seu processo.',
      },
      {
        title: 'Acesso para cada função',
        description:
          'Permissões planejadas para quem administra, quem executa e quem precisa acompanhar.',
      },
    ],
    solutions: [
      {
        title: 'Gestão e administração',
        description:
          'Acompanhe clientes, solicitações, responsáveis e etapas do trabalho em um painel feito para sua operação.',
      },
      {
        title: 'Intranet e área da equipe',
        description:
          'Reúna comunicados, procedimentos e serviços internos em um ambiente de acesso controlado.',
      },
      {
        title: 'Documentos e dados',
        description:
          'Organize arquivos, campos de cadastro e buscas para que a informação não dependa de alguém lembrar onde salvou.',
      },
      {
        title: 'Aplicativos e PWAs',
        description:
          'Leve os fluxos para o celular quando o trabalho acontece fora da mesa. O formato é definido conforme os dispositivos e recursos necessários.',
      },
    ],
    faq: [
      {
        question: 'Preciso saber tecnologia para pedir um sistema?',
        answer:
          'Não. Pode começar contando o que hoje dá trabalho, quem participa e como vocês fazem. Eu traduzo essa rotina em uma proposta de funcionalidades e etapas.',
      },
      {
        question: 'Dá para começar por uma parte do processo?',
        answer:
          'Sim. Podemos planejar uma primeira versão focada no problema mais importante e definir o que fica para as próximas etapas. O escopo é combinado antes do desenvolvimento.',
      },
      {
        question: 'É possível usar no navegador e no celular?',
        answer:
          'Sim, conforme o projeto. Podemos avaliar uma aplicação web, um PWA instalável ou um aplicativo. Recursos como câmera, notificações e uso sem internet precisam ser avaliados e previstos no escopo.',
      },
      {
        question: 'Como ficam dados, acessos e manutenção?',
        answer:
          'Permissões, hospedagem, tratamento dos dados, backups e suporte são definidos no planejamento. Integrações, migração de informações e manutenção entram na proposta conforme a necessidade.',
      },
    ],
  },
};
