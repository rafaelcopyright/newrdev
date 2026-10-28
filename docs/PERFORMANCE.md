# Validação de desempenho

Lighthouse sobre a build de produção servida localmente em 127.0.0.1:4173, com simulação padrão de rede e CPU. Relatórios Lighthouse 13.6.0. São medições de laboratório: PageSpeed Insights, TLS, TTFB e cabeçalhos Apache devem ser validados na hospedagem após publicar.

| Página | Dispositivo | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | CLS |
|---|---|---:|---:|---:|---:|---|---|
| /desenvolvimento-web/como-funciona-a-internet/ | desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 |
| /desenvolvimento-web/como-funciona-a-internet/ | mobile | 94 | 100 | 100 | 100 | 3.2 s | 0 |
| /blog/ | mobile | 94 | 100 | 100 | 100 | 3.1 s | 0 |
| / | desktop | 100 | 100 | 100 | 100 | 0.2 s | 0 |
| / | mobile | 100 | 100 | 100 | 100 | 0.9 s | 0 |
| /dicas/como-fazer-um-diagnostico-de-site/ | mobile | 96 | 100 | 100 | 100 | 2.7 s | 0 |
| /lp/ | mobile | 98 | 100 | 100 | 100 | 2.3 s | 0 |
| /portfolio-de-sites/ | mobile | 96 | 100 | 100 | 100 | 2.8 s | 0 |

TypeScript, ESLint, build, cobertura das 29 rotas, links internos, HTML estático, 301/404 e navegação móvel foram verificados. Auditoria npm: zero vulnerabilidades. Veja o README para reproduzir.
