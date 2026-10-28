# Rafael.dev

React + TypeScript + Vite, com HTML estático gerado por rota para Apache/LiteSpeed/cPanel. Não precisa de Node.js em produção.

## Desenvolvimento

Requer Node.js 24 e npm (validado com Node.js 24.13.1). As skills obrigatórias estão em `AGENTS.md`.

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview:static
```

`preview:static` serve a build na porta 4173 e reproduz os redirects e status 404 para verificação local. O preview padrão do Vite não reproduz o Apache e usa fallback de SPA.

## Conteúdo e migração

Os posts e projetos demonstrativos foram substituídos pelo conteúdo publicado do WordPress. Rascunhos, comentários, usuários, configurações e credenciais não são exportados para a aplicação.

O importador lê o WXR e as cinco cópias dos sitemaps em `auxiliares/`, sanitiza o HTML com DOMPurify, copia imagens originais e gera WebP responsivo. O diretório `auxiliares/` fica fora do Git e da build. Para refazer a importação, mantenha localmente o arquivo `rafaeldev.WordPress.2026-10-28.xml` e os sitemaps `post`, `page`, `portfolio`, `category` e `post_tag`.

```sh
npm run import:wordpress
npm run build
```

O catálogo público fica em `src/content/index.json`; os corpos sanitizados ficam em `src/content/bodies/` e são carregados sob demanda. A geração aguarda os componentes assíncronos para entregar o conteúdo completo no HTML. A cópia integral gerada `wordpress.json` é apenas auxiliar local. Uma instalação limpa compila sem o WXR. O relatório de migração está em `docs/migration-report.json`; as rotas publicadas, em `docs/routes.json`; as URLs de referência do sitemap antigo, em `docs/legacy-urls.json`.

As URLs do sitemap antigo são preservadas, incluindo `/categoria/`, `/assunto/`, `/portfolio-de-sites/` e o projeto em `/portfolio/…/`. O artigo sobre DIV usa `/dicas/…/`, conforme o sitemap público; o endereço `/css/…/` do WXR recebe 301. Links com `?p=ID` ou `?page_id=ID` dos conteúdos internos migrados também recebem 301 no Apache. A antiga página inicial é substituída pela nova home.

O formulário de orçamento prepara um email para o endereço de contato que já aparece nos artigos públicos do site. O visitante precisa revisar e enviar no seu aplicativo de email. Não existe confirmação falsa de recebimento. Newsletter demonstrativa removida. GTM e AdSense do material auxiliar não foram ativados; sua inclusão exige rever consentimento, CSP e desempenho.

## Verificação

Com `preview:static` rodando em outro terminal:

```sh
node scripts/verify-build.mjs
node scripts/verify-browser.mjs
npm audit --audit-level=high
```

O teste de navegador usa o Chrome instalado ou o executável configurado por `CHROME_PATH`. Verifica todas as rotas em viewport móvel, busca, navegação, recarga, ausência de overflow e erros de JavaScript. O teste estático cruza os sitemaps antigos com a build, verifica links locais, títulos, canonical, HTML sem JavaScript, dimensões de imagens, HTML seguro, 301 e 404.

Para medir Lighthouse localmente:

```sh
npx lighthouse http://127.0.0.1:4173/ --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo
```

As medições locais são testes de laboratório da build, não resultados do PageSpeed Insights na hospedagem. O servidor, a rede e scripts adicionais podem alterar os resultados. Confira novamente após publicar, em mobile e desktop, incluindo home, blog, artigos e portfólio.

## Publicação no cPanel

1. Faça backup do WordPress, banco e uploads antes de substituir o site.
2. Envie **somente o conteúdo de `dist/`**, incluindo `.htaccess`, para `public_html`. Não envie o repositório ou `auxiliares/`. Preserve uploads antigos que tenham links externos e não estejam no conjunto importado; o WXR não contém todos os arquivos do servidor.
3. Use certificado TLS válido. A configuração assume `https://rafaeldev.com.br`, com redirecionamento de HTTP e `www`. Em CDN/proxy, valide a detecção de HTTPS do Apache para evitar loop.
4. Confirme `mod_rewrite`, `mod_headers` e `mod_deflate` (ou os equivalentes do LiteSpeed). Use permissões 755 para diretórios e 644 para arquivos.
5. Confira respostas 200 das URLs antigas, 301 dos aliases e HTTP 404 real para URL desconhecida. Não configure fallback global para `index.html`.
6. Verifique os cabeçalhos de segurança por HTTPS. HSTS é aplicado apenas a HTTPS, sem incluir subdomínios. A CSP permite scripts e conexões do próprio domínio; estilos inline permanecem permitidos para os componentes existentes. Inline scripts executáveis, frames e plugins ficam bloqueados.
7. No WHM, mantenha ModSecurity e regras OWASP atualizados. Isso depende do administrador da hospedagem e não foi alterado pelo código.
8. Envie `/sitemap_index.xml` ao Search Console, monitore indexação/404 e repita PageSpeed Insights em produção. Revise também o texto antigo da política de privacidade e links externos/editoriais do WordPress antes de lançar.

Arquivos HTML são revalidados; JS, CSS e WebP têm cache longo. Assets do Vite têm hash; as imagens migradas usam hash da URL original. Se substituir uma imagem mantendo a mesma URL original, renove a chave do asset ou invalide o cache. Publique HTML e assets juntos, conservando os assets da versão anterior durante o período de atualização de clientes.
