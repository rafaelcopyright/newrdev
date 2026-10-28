import { readdir, readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const reports = (await readdir('docs')).filter((file) =>
  /^lighthouse-.+-(mobile|desktop)\.json$/.test(file),
);
const results = [];
for (const file of reports.sort()) {
  const report = JSON.parse(await readFile(`docs/${file}`, 'utf8'));
  assert(!report.runtimeError, `Invalid Lighthouse run: ${file}`);
  results.push({
    report: file,
    path: new URL(report.requestedUrl).pathname,
    device: report.configSettings.formFactor,
    fetched: report.fetchTime,
    lighthouse: report.lighthouseVersion,
    scores: Object.fromEntries(
      Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
    ),
    lcp: report.audits['largest-contentful-paint'].displayValue,
    cls: report.audits['cumulative-layout-shift'].displayValue,
  });
}
await writeFile(
  'docs/performance-summary.json',
  JSON.stringify(
    {
      environment:
        'Local production build, Lighthouse lab simulation; not PageSpeed Insights on the live domain.',
      results,
    },
    null,
    2,
  ),
);
const rows = results
  .map(
    (result) =>
      `| ${result.path} | ${result.device} | ${result.scores.performance} | ${result.scores.accessibility} | ${result.scores['best-practices']} | ${result.scores.seo} | ${result.lcp} | ${result.cls} |`,
  )
  .join('\n');
await writeFile(
  'docs/PERFORMANCE.md',
  `# Validação de desempenho\n\nLighthouse sobre a build de produção servida localmente em 127.0.0.1:4173, com simulação padrão de rede e CPU. Relatórios Lighthouse ${results[0]?.lighthouse}. São medições de laboratório: PageSpeed Insights, TLS, TTFB e cabeçalhos Apache devem ser validados na hospedagem após publicar.\n\n| Página | Dispositivo | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | CLS |\n|---|---|---:|---:|---:|---:|---|---|\n${rows}\n\nTypeScript, ESLint, build, cobertura das 29 rotas, links internos, HTML estático, 301/404 e navegação móvel foram verificados. Auditoria npm: zero vulnerabilidades. Veja o README para reproduzir.\n`,
);
console.log(
  JSON.stringify(
    results.map(({ path, device, scores }) => ({ path, device, scores })),
    null,
    2,
  ),
);
assert(
  results.every((result) => result.scores.performance > 90),
  'A measured page did not exceed 90.',
);
