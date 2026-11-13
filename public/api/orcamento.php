<?php
// Requires PHP 7.4+ and the hosting mail transport configured in cPanel.
declare(strict_types=1);
require_once __DIR__ . '/quote-log.php';
$requestId = bin2hex(random_bytes(16));
$requestId = substr($requestId, 0, 8) . '-' . substr($requestId, 8, 4) . '-' . substr($requestId, 12, 4) . '-' . substr($requestId, 16, 4) . '-' . substr($requestId, 20);
$logContext = ['source' => 'server', 'request_id' => $requestId];
register_shutdown_function(function (): void {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        global $logContext;
        quote_log('quote_api_result', array_merge($logContext, ['status' => 500, 'reason' => 'fatal']));
    }
});
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function respond(int $status, bool $success, string $reason): void {
    global $logContext;
    quote_log('quote_api_result', array_merge($logContext, ['status' => $status, 'reason' => $reason]));
    http_response_code($status);
    echo json_encode(['success' => $success, 'request_id' => $logContext['request_id'], 'code' => $reason]);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'method');
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!in_array($origin, ['https://rafaeldev.com.br', 'https://new.rafaeldev.com.br'], true)) respond(403, false, 'origin');
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) respond(415, false, 'content_type');
$raw = file_get_contents('php://input', false, null, 0, 20001);
if ($raw === false || strlen($raw) > 20000) respond(413, false, 'payload_size');
$data = json_decode($raw, true);
if (is_array($data)) {
    if (quote_valid_id($data['request_id'] ?? null)) $logContext['request_id'] = $data['request_id'];
    if (quote_valid_id($data['session_id'] ?? null)) $logContext['session_id'] = $data['session_id'];
}
if (!is_array($data) || !isset($data['website']) || $data['website'] !== '') respond(422, false, 'payload_or_honeypot');
$email = $data['email'] ?? null;
$project = $data['project'] ?? null;
if (!is_string($email) || strlen($email) > 254 || preg_match('/[\r\n]/', $email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) respond(422, false, 'email');
if (!in_array($project, ['Site Simples', 'Portal/Blog', 'E-Commerce', 'Sistema', 'Consultoria'], true)) respond(422, false, 'project');
$details = $data['details'] ?? null;
if (!is_array($details) || count($details) < 4 || count($details) > 15) respond(422, false, 'details');
$lines = ['Tipo de projeto: ' . $project, 'E-mail de contato: ' . $email, ''];
foreach ($details as $field) {
    if (!is_array($field) || !is_string($field['label'] ?? null) || !is_string($field['value'] ?? null)) respond(422, false, 'detail_value');
    if (strlen($field['label']) > 100 || strlen($field['value']) > 4000) respond(422, false, 'detail_value');
    $lines[] = str_replace(["\r", "\n"], ' ', $field['label']) . ': ' . $field['value'];
}
// Keep only anonymous, short-lived counters outside the public directory.
$directory = sys_get_temp_dir() . '/rafaeldev-quote-limits';
if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) respond(503, false, 'rate_limit_storage');
$key = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . gmdate('Y-m-d'));
$file = @fopen($directory . '/' . $key, 'c+');
if (!$file || !flock($file, LOCK_EX)) respond(503, false, 'rate_limit_storage');
$last = (int) stream_get_contents($file);
if (time() - $last < 60) { fclose($file); respond(429, false, 'rate_limit'); }
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
respond($sent ? 200 : 503, $sent, $sent ? 'mail_accepted' : 'mail_failed');
