# Diagnóstico do formulário de orçamento

Os registros começam depois da publicação desta versão; não recuperam cliques antigos.

## Google Analytics 4

O site configura diretamente `G-3B3ZY6JK8E` em `index.html`, preservando o contêiner de Ads existente. A política CSP permite os endpoints de coleta do Analytics. Não adicione outra tag GA4 para esse mesmo destino no GTM: isso pode duplicar visualizações.

As visualizações usam o envio inicial da tag e a medição otimizada de mudanças no histórico, já habilitada no fluxo da propriedade. Não há um segundo disparo manual na aplicação. `scripts/verify-ga4.mjs` carrega a configuração real do Google e verifica cinco visualizações (início, blog, orçamento, voltar e avançar), sem duplicação no cenário testado. O Google pode agrupar e atrasar requisições; o teste aguarda a coleta. Não desative a medição por histórico nem adicione outro `page_view` manual sem ajustar e repetir esse teste.

Todos os eventos `quote_*` da tabela abaixo são enviados explicitamente para o GA4, com `form_name`, projeto, campo, categoria de erro e status quando aplicável. IDs de sessão/requisição e valores dos campos não são enviados por estes eventos. A propriedade pode ter regras automáticas de coleta configuradas na conta; revise-as separadamente.

`generate_lead` é emitido uma vez após resposta de sucesso da API. Clique no WhatsApp, validação e resposta de erro não geram esse evento. Ações de conversão Ads existentes foram preservadas. Não some eventos automáticos `form_submit`, `quote_submit_success`, `generate_lead` e ações Ads como contatos distintos.

Na propriedade, marque **`generate_lead` como evento principal** em Administrador → Eventos. Essa marcação é configuração administrativa, não é feita pelo código do site. O acesso à propriedade foi confirmado, mas a alteração administrativa não foi feita porque o controle do navegador foi interrompido pelo usuário. Revise também as duas ações Ads existentes antes de importar outra conversão primária do GA4.

O link visível do WhatsApp tem apenas o destino, sem texto preenchido. A mensagem é composta ao abrir a conversa, evitando que a coleta automática de `link_url` capture dados do formulário. O teste de WhatsApp confirma que a mensagem continua sendo preenchida.

Para reproduzir a validação de GA4 com o preview estático em execução: `node scripts/verify-ga4.mjs`. A coleta é interceptada, portanto nenhum lead de teste é entregue ao Google. Para testar a versão publicada, defina `PREVIEW_URL=https://rafaeldev.com.br` antes do comando; a API de envio e os eventos PHP continuam simulados nesse teste.

## Consulta rápida no Clarity

Abra o projeto Rafael.dev → Dashboard / Smart events ou Recordings → Filters → Smart events e procure os eventos abaixo. A API oficial usada é `clarity('event', nome)`; filtros adicionais usam `quote_project`, `quote_field`, `quote_reason` e `quote_http_status`. As tags são de sessão e podem acumular valores; para relacionar precisamente um erro a uma tentativa, use o log do servidor.

| Evento | Significado |
| --- | --- |
| `quote_view` | Página montada no navegador |
| `quote_project_selected` | Clique numa opção de projeto |
| `quote_form_start` | Primeiro campo alterado para um valor não vazio, uma vez por montagem da página |
| `quote_field_started` | Primeiro preenchimento de cada campo por montagem, sem seu valor |
| `quote_submit_click` | Ativação do botão de envio, inclusive quando a validação bloqueia |
| `quote_validation_error` | Campo inválido e categoria de erro; uma tentativa pode gerar vários registros |
| `quote_submit_attempt` | Formulário passou pela validação e iniciou a requisição |
| `quote_submit_error` | Falha HTTP, resposta inválida, recusa da API, rede ou timeout |
| `quote_submit_success` | Navegador recebeu sucesso da API |
| `quote_whatsapp_click` | Clique no link, sem comprovar envio da mensagem |

No Clarity, diferencie ocorrências do evento e sessões que contêm o evento. Bloqueadores, indisponibilidade e consentimento podem reduzir os dados coletados. Ausência de evento não comprova abandono.

## Log independente no PHP / cPanel

Os mesmos eventos são enviados a `/api/quote-events.php` e gravados com prefixo `[quote]` no **error log configurado no PHP da hospedagem**. A API de envio também grava `quote_api_result` com `request_id`, status e motivo, independentemente do Clarity. Consulte o log pelo acesso autenticado do cPanel (Errors / log PHP; o local exato depende da configuração do provedor). Não existe painel ou arquivo de registros público.

Baixe o log para uma pasta privada fora do repositório e execute:

```powershell
node scripts/summarize-quote-log.mjs "C:/caminho/privado/error_log" producao 2026-11-13
```

O comando exibe contagens por etapa, campo, motivo e status, com sessões e requisições distintas. Data/hora dos registros em UTC; use uma data ISO com fuso para um corte preciso. Produção e homologação são separadas. Registros do navegador e da API têm nomes distintos: não some `quote_submit_success` e `quote_api_result` como dois contatos.

### Como localizar o problema

- Muitos cliques + `quote_validation_error`: veja `field` e `reason` (`required`, `invalid_type`, etc.). A validação nativa impede `onSubmit`, mas estes erros são capturados separadamente.
- `quote_submit_attempt` sem resultado da API: compare `request_id`; pode haver bloqueio antes do PHP ou falha de transporte. Logs podem ser perdidos; não é prova definitiva.
- `quote_api_result` / `email`, `project`, `details`, `detail_value` ou `payload_or_honeypot`: o servidor recusou o conteúdo.
- `rate_limit` (429): nova tentativa em menos de 60 segundos para o mesmo IP. `rate_limit_storage` (503): falha no armazenamento temporário do limitador.
- `mail_failed` (503): `mail()` falhou. Verifique transporte e configuração de e-mail da hospedagem.
- `mail_accepted` (200), mas nenhum e-mail recebido: consulte **Track Delivery / Rastrear entrega** no cPanel para `contato@rafaeldev.com.br`, spam e devoluções. `mail()` confirma aceite do transporte, não entrega ao destinatário.
- `quote_submit_error` / `http`: o status informa a falha; `invalid_response` cobre HTML/JSON inválido com HTTP 200; `timeout` e `network` identificam falhas de transporte no navegador.

## Privacidade, limites e operação

Não registramos nomes, e-mails, telefones, mensagens, valores dos campos, URL completa, user-agent ou IP bruto. A sessão usa UUID aleatório em `sessionStorage` por aba; não identifica pessoas únicas e pode mudar ao reabrir a página. `request_id` correlaciona uma tentativa do navegador com seu resultado no PHP. Nenhum desses IDs é enviado ao Clarity por esta instrumentação.

O coletor aceita apenas eventos/campos/motivos pré-definidos, limita o tamanho da requisição e limita a 300 eventos/minuto por IP. Os contadores temporários usam hash diário e expiram após um dia. Eventos podem ser perdidos por fechamento da aba, rede ou limitação. Dados do cliente podem ser falsificados; use resultados da API para avaliar processamento real.

Configure o PHP para gravar seu error log **fora de `public_html`**, com rotação e retenção curta (sugestão operacional: 30 dias). `.htaccess` bloqueia `.log`, `error_log` e variantes como defesa adicional. Não envie logs ao Git nem à hospedagem junto com o site: apenas `dist/`.

Referências: [API do Clarity](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api), [retorno de mail()](https://www.php.net/manual/en/function.mail.php).

## Reproduzir a validação local

Após `npm run build`, inicie `npm run preview:static` em outro terminal e execute:

```powershell
node scripts/verify-quote.mjs
node scripts/verify-quote-telemetry.mjs
```

Ambos usam transporte simulado e bloqueiam serviços externos. O teste PHP requer PHP no PATH ou `PHP_BIN` apontando para o executável:

```powershell
node scripts/verify-quote-api.mjs
```

O teste PHP usa servidor local, diretório temporário isolado e stub SMTP local (runtime Windows); não envia e-mails reais. Ele verifica aceite/falha do transporte, erros de validação, limites do coletor e do envio, correlação e ausência de valores pessoais nos registros. O preview estático não executa PHP nem emula as regras Apache: verifique também o retorno 403/404 dos caminhos de logs e do helper PHP após publicar.
