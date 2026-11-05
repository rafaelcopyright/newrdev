<?php
// Requires PHP 7.4+ and the hosting mail transport configured in cPanel.
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function respond(int $status, bool $success): void {
    http_response_code($status);
    echo json_encode(['success' => $success]);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false);
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!in_array($origin, ['https://rafaeldev.com.br', 'https://new.rafaeldev.com.br'], true)) respond(403, false);
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) respond(415, false);
$raw = file_get_contents('php://input', false, null, 0, 20001);
if ($raw === false || strlen($raw) > 20000) respond(413, false);
$data = json_decode($raw, true);
if (!is_array($data) || !isset($data['website']) || $data['website'] !== '') respond(422, false);
$email = $data['email'] ?? null;
$project = $data['project'] ?? null;
if (!is_string($email) || strlen($email) > 254 || preg_match('/[\r\n]/', $email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) respond(422, false);
if (!in_array($project, ['Site Simples', 'Portal/Blog', 'E-Commerce', 'Sistema', 'Consultoria'], true)) respond(422, false);
$details = $data['details'] ?? null;
if (!is_array($details) || count($details) < 4 || count($details) > 15) respond(422, false);
$lines = ['Tipo de projeto: ' . $project, 'E-mail de contato: ' . $email, ''];
foreach ($details as $field) {
    if (!is_array($field) || !is_string($field['label'] ?? null) || !is_string($field['value'] ?? null)) respond(422, false);
    if (strlen($field['label']) > 100 || strlen($field['value']) > 4000) respond(422, false);
    $lines[] = str_replace(["\r", "\n"], ' ', $field['label']) . ': ' . $field['value'];
}
// Keep only anonymous, short-lived counters outside the public directory.
$directory = sys_get_temp_dir() . '/rafaeldev-quote-limits';
if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) respond(503, false);
$key = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . gmdate('Y-m-d'));
$file = @fopen($directory . '/' . $key, 'c+');
if (!$file || !flock($file, LOCK_EX)) respond(503, false);
$last = (int) stream_get_contents($file);
if (time() - $last < 60) { fclose($file); respond(429, false); }
ftruncate($file, 0);
rewind($file);
fwrite($file, (string) time());
fclose($file);
foreach (glob($directory . '/*') ?: [] as $counter) {
    if (filemtime($counter) < time() - 86400) @unlink($counter);
}
$headers = [
    'From: Rafael.dev <contato@rafaeldev.com.br>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];
$subject = '=?UTF-8?B?' . base64_encode('Orçamento: ' . $project) . '?=';
$sent = @mail('contato@rafaeldev.com.br', $subject, implode("\n", $lines), implode("\r\n", $headers));
respond($sent ? 200 : 503, $sent);
