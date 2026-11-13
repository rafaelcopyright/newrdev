# OpenAI Measurement Pixel

Pixel: Fua1tdX5eJoJ62PeaPBfeL. Instalação única no head compartilhado, com fila assíncrona oficial. CSP: hash gerado a partir do snippet; SDK e configuração em bzrcdn.openai.com; transporte em bzr.openai.com. Nenhuma chave privada no navegador.

Conversão solicitada: oaiq('measure', 'registration_completed', { type: 'customer_action' }). Exclusivamente para campaign=sistemas, após resposta HTTP bem-sucedida com success=true do endpoint de orçamento. Não dispara em sites, orçamento genérico, validação, falha de envio ou WhatsApp. Não se passam valores dos campos ao pixel. A correspondência automática pode depender da configuração do pixel na conta.

Fonte oficial: https://developers.openai.com/ads/measurement-pixel

Validação: SDK e configuração do ID retornaram HTTP 200 no navegador; nenhum bloqueio de CSP. Verificador estático valida instalação única e hash em 31 rotas. Teste de campanhas cobre ausência de conversão em falha e campanha sites, disparo único após sucesso em sistemas e proteção de envio duplicado, em mobile e desktop. Requisições de formulário e chamadas de conversão são interceptadas nesses testes, para não gerar leads ou conversões artificiais. Recebimento da conversão no Ads Manager ainda não validado; usar o modo de teste da plataforma para essa confirmação.
