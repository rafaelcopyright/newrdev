# Publicação em homologação e produção

O arquivo `main.yml` gera HTML estático com Node.js 24 no GitHub Actions e envia apenas o conteúdo de `dist/` por FTP. Não é necessário Node.js no servidor. O `.htaccess`, as mídias, os sitemaps e as páginas são enviados junto com a build.

## Destinos e credenciais

Configure os quatro secrets em **Settings → Secrets and variables → Actions**:

| Ambiente      | Domínio                | Usuário             | Senha               | Raiz da conta FTP         |
| ------------- | ---------------------- | ------------------- | ------------------- | ------------------------- |
| `homologacao` | `new.rafaeldev.com.br` | `ftp_username`      | `ftp_password`      | Pasta do subdomínio `new` |
| `producao`    | `rafaeldev.com.br`     | `PROD_FTP_USERNAME` | `PROD_FTP_PASSWORD` | `public_html`             |

Ambas as contas conectam em `ftp.rafaeldev.com.br`, com `server-dir: ./`. A separação do destino é feita pela raiz da conta FTP, não por concatenação de caminhos. Não use `public_html/` com uma conta cuja raiz já é `public_html`. Secrets ausentes interrompem o job antes de instalar ou publicar. Produção não usa as credenciais de homologação como fallback.

## Homologação

1. Faça commit e push para `main`.
2. Abra **Actions → Build e publicação do site** e aguarde o sucesso do job de homologação.
3. Confira `https://new.rafaeldev.com.br`, incluindo artigos antigos, imagens, navegação, orçamento por email e página 404.
4. Para republicar manualmente, use **Run workflow**, selecione a branch `main` e `ambiente: homologacao`. O job é ignorado em outras branches.

A execução manual usa homologação como padrão. O build recebe `VITE_DEPLOY_ENV=homologacao`. O redirecionamento HTTPS mantém o subdomínio `new`; não envia o visitante para produção. HTML e cabeçalhos HTTP têm `noindex, follow`, inclusive os arquivos servidos pelo Apache. Canonical aponta para o domínio de produção para evitar duplicação editorial. `robots.txt` permite que os buscadores leiam o `noindex`; isso não torna o ambiente privado. Proteção por senha, se necessária, deve ser configurada na hospedagem.

## Produção

1. Valide na homologação o commit que deseja publicar e confirme que a `main` ainda aponta para ele.
2. Em **Actions → Build e publicação do site → Run workflow**, selecione **branch `main`** e **ambiente `producao`**.
3. Aguarde as validações, a build e a etapa **Publicar produção por FTP** terminarem.
4. Confira `https://rafaeldev.com.br`, as imagens e as URLs antigas. Valide um alias 301 e uma URL desconhecida com HTTP 404.
5. Limpe o cache da hospedagem/CDN somente depois do envio completo, se necessário. Use apenas o sitemap de produção no Search Console.

Pushes na `main` não publicam produção. O job de produção é ignorado quando executado manualmente em outra branch. A build usa `VITE_DEPLOY_ENV=producao`, gera os endereços do domínio principal e permite indexação.

O workflow registra os ambientes GitHub `homologacao` e `producao`. Se quiser exigir aprovação adicional, configure revisores e restrição à branch `main` no ambiente `producao`, em **Settings → Environments**, conforme os recursos disponíveis no seu plano. As regras precisam ser configuradas no GitHub; não são criadas pelo YAML.

## Validações e sincronização

Antes do FTP, o job executa `npm ci`, TypeScript, ESLint, auditoria High/critical, `npm run build` e `npm run verify:build`. A verificação cruza as URLs antigas com as 29 rotas geradas, testa os arquivos e variantes responsivas das imagens, os canonical, a política de indexação do ambiente e os redirecionamentos locais.

Cada ambiente tem sua fila de deploy, sem cancelamento de uploads em andamento. As etapas FTP têm condições e secrets separados. Os manifestos também são distintos:

- Homologação: `.rafaeldev-dist-sync-state.json`, preservando o manifesto usado anteriormente na conta do subdomínio.
- Produção: `.rafaeldev-prod-dist-sync-state.json`.

`dangerous-clean-slate` permanece desativado. O primeiro envio não faz limpeza geral nem remove a homologação caso sua pasta esteja dentro de `public_html`. O sincronizador ainda pode excluir arquivos anteriormente gerenciados que deixaram de existir na build. Preserve mídias necessárias no Git e mantenha backup dos uploads antigos fora da hospedagem. Os JSON de cache de processamento em `media/` não são publicados; imagens WebP e originais são publicados normalmente.

Não apague o manifesto rotineiramente. Se arquivos remotos forem removidos manualmente, redefina somente o manifesto do ambiente afetado para forçar o reenvio completo. Alterar o manifesto não deve ser usado como substituto de backup.

## Recuperação

Se o build falhar, o FTP não começa. Corrija o erro mostrado na aba Actions e execute novamente no ambiente desejado. Se o upload falhar, reexecute o workflow; FTP não oferece publicação atômica nem rollback automático. Para recuperar uma versão anterior em produção, reverta a alteração com um commit na `main`, valide em homologação e execute manualmente a publicação de produção.

O acesso FTP e o host existentes foram preservados. Caso a hospedagem suporte FTPS, configure `protocol: ftps` e `security: strict` em ambas as etapas FTP; confirme também a porta com o provedor.
