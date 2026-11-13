import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { mkdtemp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';

const php = process.env.PHP_BIN || 'php';
const temp = await mkdtemp(join(tmpdir(), 'quote-api-test-'));
await mkdir(join(temp, 'limits'));
const log = join(temp, 'error.log');
const smtp = createServer((socket) => {
  socket.write('220 localhost test SMTP\r\n');
  let buffer = '';
  let data = false;
  socket.on('data', (chunk) => {
    buffer += chunk.toString();
    while (buffer.includes('\r\n')) {
      const index = buffer.indexOf('\r\n');
      const line = buffer.slice(0, index);
      buffer = buffer.slice(index + 2);
      if (data) {
        if (line === '.') {
          data = false;
          socket.write('250 Accepted\r\n');
        }
      } else if (line.startsWith('DATA')) {
        data = true;
        socket.write('354 Continue\r\n');
      } else if (line.startsWith('QUIT')) socket.end('221 Bye\r\n');
      else socket.write('250 OK\r\n');
    }
  });
});
await new Promise((done) => smtp.listen(0, '127.0.0.1', done));
const smtpPort = smtp.address().port;
const reservation = createServer();
await new Promise((done) => reservation.listen(0, '127.0.0.1', done));
const port = reservation.address().port;
await new Promise((done) => reservation.close(done));
const processPhp = spawn(
  php,
  [
    '-d',
    'log_errors=1',
    '-d',
    'display_errors=0',
    '-d',
    `error_log=${log}`,
    '-d',
    `sys_temp_dir=${join(temp, 'limits')}`,
    '-d',
    'SMTP=127.0.0.1',
    '-d',
    `smtp_port=${smtpPort}`,
    '-d',
    'sendmail_from=teste@example.com',
    '-S',
    `127.0.0.1:${port}`,
    '-t',
    resolve('public'),
  ],
  { stdio: ['ignore', 'ignore', 'pipe'], windowsHide: true },
);
let startupError = '';
processPhp.stderr.on('data', (chunk) => {
  startupError = (startupError + chunk).slice(-2000);
});
processPhp.on('error', (error) => {
  startupError = error.code;
});
const base = `http://127.0.0.1:${port}/api/`;
const session_id = randomUUID();
const request_id = randomUUID();
const headers = { Origin: 'https://rafaeldev.com.br', 'Content-Type': 'application/json' };
const post = (path, body, extraHeaders = {}) =>
  fetch(base + path, {
    method: 'POST',
    headers: { ...headers, ...extraHeaders },
    body: JSON.stringify(body),
  });
try {
  let ready = false;
  for (let i = 0; i < 50; i++) {
    try {
      await fetch(base + 'quote-events.php');
      ready = true;
      break;
    } catch {
      await delay(100);
    }
  }
  assert(ready, `PHP failed to start. Set PHP_BIN to a PHP executable. ${startupError}`);
  const event = {
    event: 'quote_form_start',
    session_id,
    project: 'consultoria',
    campaign: 'sites',
    position: 'contact',
  };
  assert.equal((await post('quote-events.php', event)).status, 204);
  assert.equal((await post('quote-events.php', { ...event, campaign: 'arbitraria' })).status, 422);
  assert.equal(
    (await post('quote-events.php', { ...event, email: 'secret@example.com' })).status,
    422,
  );
  assert.equal(
    (await post('quote-events.php', { ...event, field: 'secret@example.com' })).status,
    422,
  );
  assert.equal(
    (await post('quote-events.php', event, { Origin: 'https://example.com' })).status,
    403,
  );
  for (let i = 1; i < 300; i++) assert.equal((await post('quote-events.php', event)).status, 204);
  assert.equal((await post('quote-events.php', event)).status, 429);
  const payload = {
    campaign: 'sites',
    session_id,
    request_id,
    project: 'Consultoria',
    email: 'secret@example.com',
    website: '',
    details: Array.from({ length: 4 }, () => ({ label: 'Nome', value: 'Dado privado' })),
  };
  assert.equal((await post('orcamento.php', { ...payload, email: 'invalido' })).status, 422);
  const success = await post('orcamento.php', payload);
  assert.equal(success.status, 200);
  assert.equal((await success.json()).code, 'mail_accepted');
  assert.equal((await post('orcamento.php', payload)).status, 429);
  await new Promise((done) => smtp.close(done));
  const counters = join(temp, 'limits', 'rafaeldev-quote-limits');
  for (const name of await readdir(counters)) await writeFile(join(counters, name), '0');
  const failure = await post('orcamento.php', { ...payload, request_id: randomUUID() });
  assert.equal(failure.status, 503);
  assert.equal((await failure.json()).code, 'mail_failed');
  const content = await readFile(log, 'utf8');
  assert(content.includes('mail_accepted') && content.includes('mail_failed'));
  assert(content.includes(request_id) && content.includes(session_id));
  assert(content.includes('"campaign":"sites"'));
  assert(!content.includes('secret@example.com') && !content.includes('Dado privado'));
  assert(!content.includes('127.0.0.1'));
  console.log(
    'PHP API: collector validation/origin, server validation, mail acceptance/failure, rate limit, IDs and log privacy passed (local SMTP stub).',
  );
  console.log(`Private test log: ${log}`);
} finally {
  processPhp.kill();
  if (smtp.listening) await new Promise((done) => smtp.close(done));
}
