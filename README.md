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

O formulário de orçamento envia JSON para `/api/orcamento.php`, incluído em `dist/`, com destinatário fixo `contato@rafaeldev.com.br`. A hospedagem precisa executar PHP 7.4+ e ter o transporte de e-mail (`mail()`) habilitado e configurado no cPanel, com SPF/DKIM do domínio. O botão “Chame no WhatsApp”, exclusivo desse formulário, abre uma mensagem com os dados preenchidos para +55 11 96900-5617; o visitante confirma o envio no WhatsApp. O endpoint valida a origem, limita o tamanho dos campos, usa honeypot e restringe envios a um por minuto por IP. A confirmação indica aceitação pelo transporte, sem garantir entrega na caixa de entrada. Valide o recebimento em homologação após publicar; o preview estático e o Vite não executam PHP. Newsletter demonstrativa removida. A tag do Google Ads foi instalada separadamente conforme a seção abaixo. O GTM e o AdSense do material auxiliar não foram importados.

## Google Ads

A tag global `AW-983887988` está no `<head>` de todas as páginas, conforme o snippet atual do Google (`gtm.js`). O build gera o hash SHA-256 da inicialização para a CSP em `dist/.htaccess`, sem liberar scripts inline genéricos. A CSP permite os endpoints do Google Ads, incluindo o domínio regional brasileiro. Destinos e eventos de conversão são configurados na conta do Google; esta instalação não adiciona eventos de conversão ao formulário.

## Verificação

### Links para campanhas de orçamento

O parâmetro `projeto` seleciona automaticamente o tipo e rola até o passo 2, mantendo os parâmetros de campanha (UTM). Use `/orcamento/?projeto=site-simples`, `?projeto=portal-blog`, `?projeto=e-commerce`, `?projeto=sistema` ou `?projeto=consultoria`. Sem esse parâmetro ou com valor inválido, a seleção continua manual. O visitante pode trocar o tipo normalmente.

Com `preview:static` rodando em outro terminal:

```sh
node scripts/verify-build.mjs
node scripts/verify-browser.mjs
node scripts/verify-quote.mjs
npm audit --audit-level=high
```

O teste de navegador usa o Chrome instalado ou o executável configurado por `CHROME_PATH`. Verifica todas as rotas em viewport móvel, busca, navegação, recarga, ausência de overflow e erros de JavaScript. O teste estático cruza os sitemaps antigos com a build, verifica links locais, títulos, canonical, HTML sem JavaScript, dimensões de imagens, HTML seguro, 301 e 404.

Para medir Lighthouse localmente:

```sh
npx lighthouse http://127.0.0.1:4173/ --chrome-flags="--headless" --only-categories=performance,accessibility,best-practices,seo
```

As medições locais são testes de laboratório da build, não resultados do PageSpeed Insights na hospedagem. O servidor, a rede e scripts adicionais podem alterar os resultados. Confira novamente após publicar, em mobile e desktop, incluindo home, blog, artigos e portfólio.

## Publicação no cPanel

O workflow `.github/workflows/main.yml` publica automaticamente **em homologação** a cada push para `main`. Produção é publicada manualmente após validar a homologação. O passo a passo completo está em [.github/workflows/README.md](.github/workflows/README.md).

| Ambiente    | Site                           | Secrets do GitHub                        | Acionamento                                                   |
| ----------- | ------------------------------ | ---------------------------------------- | ------------------------------------------------------------- |
| Homologação | `https://new.rafaeldev.com.br` | `ftp_username`, `ftp_password`           | Push na `main` ou execução manual com `ambiente: homologacao` |
| Produção    | `https://rafaeldev.com.br`     | `PROD_FTP_USERNAME`, `PROD_FTP_PASSWORD` | Execução manual na `main` com `ambiente: producao`            |

Para publicar em produção: faça o push, confira o site de homologação e abra **Actions → Build e publicação do site → Run workflow**. Selecione a branch `main` e o ambiente `producao`. Execuções manuais em outra branch são ignoradas nos dois ambientes.

O Node.js 24 roda exclusivamente no runner do GitHub: `npm ci`, TypeScript, ESLint, auditoria de vulnerabilidades High/critical, build e verificação estática das 29 rotas. Se alguma etapa falhar, o envio por FTP não começa. Somente o conteúdo de `dist/` é enviado, incluindo `.htaccess`. O servidor não precisa de Node.js. A exportação privada do WordPress não é necessária para compilar o conteúdo já importado.

O servidor FTP é `ftp.rafaeldev.com.br` para ambos os ambientes. O destino permanece `./`, relativo à raiz de cada conta FTP: a conta de homologação já aponta para `new.rafaeldev.com.br` e a conta de produção aponta diretamente para `public_html`. Não acrescente `public_html/` ao destino de produção. As actions usam revisões fixas e o token do GitHub tem apenas leitura. Nenhuma credencial é incluída na build.

Os deploys são serializados por ambiente. Homologação usa o manifesto `.rafaeldev-dist-sync-state.json`; produção usa `.rafaeldev-prod-dist-sync-state.json`. Não existe limpeza geral do servidor. Arquivos antigos do envio anterior podem permanecer e precisam de revisão antes de qualquer remoção. A sincronização FTP não é uma troca atômica: uma falha durante o upload pode exigir reexecutar o workflow. O protocolo FTP existente foi preservado; se a hospedagem oferecer FTPS, configure `protocol: ftps` e `security: strict` nas duas etapas de publicação.

A configuração `VITE_DEPLOY_ENV` define a build: `homologacao` usa HTTPS no próprio subdomínio, imagens e sitemaps de homologação, e `noindex` no HTML e no cabeçalho HTTP. Os canonical continuam apontando para produção. O `robots.txt` permite o rastreamento para que o buscador possa ler o `noindex`; não envie o sitemap de homologação ao Search Console. Essa restrição de indexação não é autenticação. `producao` usa o domínio principal e permite indexação. Sem a variável, o build local assume produção.

Para testar a build de homologação no PowerShell:

```powershell
$env:VITE_DEPLOY_ENV = 'homologacao'
npm run build
npm run preview:static
# Após encerrar o preview, remova a variável para voltar à build de produção:
Remove-Item Env:VITE_DEPLOY_ENV
```

1. Faça backup do WordPress, banco e uploads antes de substituir o site.
2. Envie **somente o conteúdo de `dist/`**, incluindo `.htaccess`, para `public_html`. Não envie o repositório ou `auxiliares/`. Preserve uploads antigos que tenham links externos e não estejam no conjunto importado; o WXR não contém todos os arquivos do servidor.
3. Use certificado TLS válido. A configuração assume `https://rafaeldev.com.br`, com redirecionamento de HTTP e `www`. Em CDN/proxy, valide a detecção de HTTPS do Apache para evitar loop.
4. Confirme `mod_rewrite`, `mod_headers` e `mod_deflate` (ou os equivalentes do LiteSpeed). Use permissões 755 para diretórios e 644 para arquivos.
5. Confira respostas 200 das URLs antigas, 301 dos aliases e HTTP 404 real para URL desconhecida. Não configure fallback global para `index.html`.
6. Verifique os cabeçalhos de segurança por HTTPS. HSTS é aplicado apenas a HTTPS, sem incluir subdomínios. A CSP permite scripts e conexões do próprio domínio; estilos inline permanecem permitidos para os componentes existentes. Inline scripts executáveis, frames e plugins ficam bloqueados.
7. No WHM, mantenha ModSecurity e regras OWASP atualizados. Isso depende do administrador da hospedagem e não foi alterado pelo código.
8. Envie `/sitemap_index.xml` ao Search Console, monitore indexação/404 e repita PageSpeed Insights em produção. Revise também o texto antigo da política de privacidade e links externos/editoriais do WordPress antes de lançar.

Arquivos HTML são revalidados; JS, CSS e WebP têm cache longo. Assets do Vite têm hash; as imagens migradas usam hash da URL original. Se substituir uma imagem mantendo a mesma URL original, renove a chave do asset ou invalide o cache. Publique HTML e assets juntos, conservando os assets da versão anterior durante o período de atualização de clientes.
