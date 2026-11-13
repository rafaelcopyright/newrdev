import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const [file, environment = 'producao', since] = process.argv.slice(2);
if (!file || (since && !Number.isFinite(Date.parse(since)))) {
  console.error(
    'Uso: node scripts/summarize-quote-log.mjs <error_log> [producao|homologacao] [data ISO]',
  );
  process.exit(1);
}
const groups = new Map();
const stream = createReadStream(file, { encoding: 'utf8' });
stream.on('error', (error) => {
  console.error(`Não foi possível ler o log: ${error.code}`);
  process.exitCode = 1;
});
try {
  for await (const line of createInterface({ input: stream, crlfDelay: Infinity })) {
    const index = line.indexOf('[quote] ');
    if (index < 0) continue;
    let record;
    try {
      record = JSON.parse(line.slice(index + 8));
    } catch {
      continue;
    }
    if (
      record.environment !== environment ||
      (since && Date.parse(record.time) < Date.parse(since))
    )
      continue;
    const key = [
      record.campaign,
      record.event,
      record.position,
      record.field,
      record.reason,
      record.status,
    ]
      .filter(Boolean)
      .join(' / ');
    const group = groups.get(key) || { eventos: 0, sessions: new Set(), requests: new Set() };
    group.eventos++;
    if (record.session_id) group.sessions.add(record.session_id);
    if (record.request_id) group.requests.add(record.request_id);
    groups.set(key, group);
  }
  console.table(
    [...groups].map(([etapa, group]) => ({
      etapa,
      eventos: group.eventos,
      sessoes: group.sessions.size,
      requisicoes: group.requests.size,
    })),
  );
  console.log('Sessões são identificadores aleatórios por aba; não representam pessoas únicas.');
  console.log('mail_accepted confirma aceite da hospedagem, não entrega na caixa de entrada.');
} catch {
  process.exitCode = 1;
}
