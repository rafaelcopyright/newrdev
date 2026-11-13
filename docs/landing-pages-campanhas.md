# Landing pages para as campanhas Rafael.dev

Data: 2026-11-13. Implementação local, sem alteração de anúncios, orçamentos ou campanhas nas plataformas.

| Campanha | Rota | Objetivo e mensagem |
| --- | --- | --- |
| Sites e blogs | `/criacao-de-sites/` | Apresentar serviços e conteúdo com clareza, transmitir confiança e facilitar o contato. |
| Sistemas | `/desenvolvimento-de-sistemas/` | Organizar cadastros, documentos e trabalho da equipe em uma ferramenta sob medida. |

## Decisões de conversão

- Ação principal: iniciar uma conversa no WhatsApp. Está na primeira tela, no cabeçalho desktop e numa barra fixa no celular. A mensagem inicial identifica a oferta, sem exigir formulário antes da conversa.
- Alternativa: formulário na própria página, acessível por âncora na primeira tela. Dois campos obrigatórios (nome e e-mail), mensagem opcional, sem seletor genérico de serviços e sem perguntas técnicas obrigatórias.
- O cabeçalho da campanha contém marca, tema e contato. Blog e navegação geral não disputam o clique principal; portfólio, apresentação e privacidade continuam acessíveis.
- A barra móvel se oculta durante o foco nos campos para não atrapalhar o preenchimento. O rodapé reserva espaço para a barra e a área segura do aparelho.
- Falha de envio preserva os campos. Uma trava síncrona impede pedidos duplicados enquanto o envio está em andamento. A mensagem opcional é limitada para respeitar os limites da API.

## Leitura dos mapas fornecidos

Evidência: três imagens de toque, rolagem e atenção de celular fornecidas pelo usuário, com data no nome de 2026-11-13. Há interações nos campos, nos botões e em elementos de seleção; a intensidade de rolagem cai em direção aos botões. O mapa de atenção destaca a região da mensagem e dos detalhes opcionais.

Isso motivou contato visível no início, retirada da seleção entre cinco serviços e redução do formulário. Atenção pode representar tempo de preenchimento ou dificuldade, e muitos toques não comprovam interesse qualificado ou falha técnica. Sem a legenda completa, tamanho da amostra e funil de envios, não calculamos abandono nem prometemos ganho percentual.

## Copy, identidade e evidências

Diagnóstico de copy: novo material a partir da oferta descrita pelo usuário e do site existente. A linguagem proposta se apoia em situações concretas (apresentar serviços, publicar artigos, procurar documentos, acompanhar solicitações), sem alegar entrevistas com clientes que não foram feitas.

Mantidos fundo, cores azul/âmbar, grade, tipografia, marca e alternância de tema do site. Na campanha de sites, Alpha International e Sob as Asas do Segredo são projetos presentes no portfólio local, com imagens existentes. A campanha de sistemas mostra uma interface explicitamente ilustrativa e explica como o escopo será definido; não a apresenta como um sistema já entregue a um cliente.

Não foram adicionados depoimentos, quantidade de clientes, métricas de resultado, preços, certificações ou prazos sem comprovação. A copy propõe escopo, investimento e prazo definidos antes da contratação. Posição no Google, trabalho offline, integrações e manutenção dependem da proposta.

## Eventos e conversões

Reutilizados GA4, Clarity e o log PHP. `campaign` tem apenas `sites` ou `sistemas` no coletor e no resultado da API. No GA4, usa-se o parâmetro personalizado `landing_campaign`, para não substituir a atribuição de campanha do Google. `form_name` usa `campanha_sites` ou `campanha_sistemas`.

- `quote_view`: página de campanha montada.
- `quote_contact_click`: clique na âncora para o formulário.
- `quote_whatsapp_click`: clique no WhatsApp, com `position` (`header`, `hero`, `sticky` ou `contact`). Não comprova envio de mensagem.
- `quote_form_start`, `quote_field_started`, `quote_validation_error`: começo do preenchimento e validações nativas, sem valores dos campos.
- `quote_submit_click`, `quote_submit_attempt`, `quote_submit_error`, `quote_submit_success`: etapas do envio, com correlação de requisição no log privado.
- `generate_lead`: somente após sucesso confirmado pela API. A aceitação pelo transporte de e-mail não é confirmação de entrega à caixa de entrada.

O e-mail inclui a rota da campanha em `Origem`. Valores pessoais e mensagens não entram nos eventos personalizados. Links visíveis do WhatsApp não contêm texto preenchido; a mensagem é composta apenas ao abrir a conversa.

Para análise no GA4, registre dimensões de escopo de evento para `landing_campaign` e `position`, caso queira usá-las nos relatórios personalizados. A marcação de `generate_lead` como evento principal continua sendo uma configuração administrativa da propriedade; não é alterada por estas páginas. Consulte também `docs/diagnostico-orcamento.md`.

O resumo privado `scripts/summarize-quote-log.mjs` separa campanha, evento, posição, campo, motivo e status. Não some clique no WhatsApp e formulário como leads distintos sem verificar se representam o mesmo contato.

## Validação e avaliação após publicar

`scripts/verify-campaigns.mjs` verifica celular/desktop, CTA na primeira tela, validação de campos vazios e nome composto apenas de espaços, erro preservando dados, sucesso, bloqueio de duplicidade, mensagem de WhatsApp, metadados, temas e ausência de valores pessoais na telemetria. A API e serviços externos são simulados. Capturas são gravadas no diretório indicado por `SCREENSHOT_DIR`, fora de `dist/`.

O formulário geral mantém o mesmo transporte e foi incluído na regressão. O teste PHP local usa SMTP simulado e verifica campanha permitida, rejeição de metadados arbitrários, aceite/falha do transporte e limites de requisições. As páginas são pré-renderizadas, têm canonical próprio e entram no sitemap de páginas. As URLs WordPress, inclusive `/lp/`, são preservadas.

Depois da publicação, avalie contatos qualificados por visita de cada campanha, tempo até o primeiro contato e pontos de erro. Compare janelas fechadas com duração, dispositivo e origem de tráfego comparáveis. Os mapas são evidência qualitativa para a hipótese; aumento de conversão só pode ser afirmado após medir o uso real.
