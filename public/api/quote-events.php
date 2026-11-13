<?php
declare(strict_types=1);
require_once __DIR__ . '/quote-log.php';
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function finish_event(int $status): void { http_response_code($status); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    finish_event(405);
}
if (!in_array($_SERVER['HTTP_ORIGIN'] ?? '', ['https://rafaeldev.com.br', 'https://new.rafaeldev.com.br'], true)) finish_event(403);
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) finish_event(415);
$raw = file_get_contents('php://input', false, null, 0, 2049);
if ($raw === false || strlen($raw) > 2048) finish_event(413);
$data = json_decode($raw, true);
if (!is_array($data) || !quote_valid_id($data['session_id'] ?? null)) finish_event(422);
$events = ['quote_view', 'quote_project_selected', 'quote_form_start', 'quote_field_started', 'quote_submit_click', 'quote_submit_attempt', 'quote_validation_error', 'quote_submit_success', 'quote_submit_error', 'quote_whatsapp_click', 'quote_contact_click'];
if (!in_array($data['event'] ?? null, $events, true)) finish_event(422);
$allowed = [
    'campaign' => ['sites', 'sistemas'],
    'position' => ['header', 'hero', 'proof', 'sticky', 'contact', 'footer', 'solution'],
    'project' => ['site-simples', 'portal-blog', 'e-commerce', 'sistema', 'consultoria'],
    'field' => ['name', 'email', 'phone', 'company', 'message', 'pages', 'deadline', 'style', 'hosting', 'features', 'volume', 'authors', 'cms', 'search', 'monetization', 'products', 'payment', 'shipping', 'erp', 'platform', 'users', 'auth', 'integrations', 'data', 'access', 'area', 'duration', 'team', 'current'],
    'reason' => ['required', 'invalid_type', 'bad_input', 'range', 'step', 'length', 'pattern', 'invalid', 'http', 'rejected', 'invalid_response', 'timeout', 'network'],
];
// Reject unknown keys, rather than accidentally logging a field value supplied by a client.
foreach ($data as $key => $value) {
    if (!in_array($key, ['event', 'session_id', 'request_id', 'status', 'project', 'field', 'reason', 'campaign', 'position'], true)) finish_event(422);
    if (isset($allowed[$key]) && !in_array($value, $allowed[$key], true)) finish_event(422);
}
if (isset($data['request_id']) && !quote_valid_id($data['request_id'])) finish_event(422);
if (isset($data['status']) && (!is_int($data['status']) || $data['status'] < 100 || $data['status'] > 599)) finish_event(422);

// Bound log volume per IP/minute; counters contain no raw IP and expire after one day.
$directory = sys_get_temp_dir() . '/rafaeldev-event-limits';
if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) finish_event(503);
$key = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . gmdate('Y-m-d'));
$file = @fopen($directory . '/' . $key, 'c+');
if (!$file || !flock($file, LOCK_EX)) finish_event(503);
$counter = json_decode(stream_get_contents($file), true) ?: [];
$minute = (int) floor(time() / 60);
$count = ($counter['minute'] ?? 0) === $minute ? ($counter['count'] ?? 0) : 0;
if ($count >= 300) { fclose($file); finish_event(429); }
ftruncate($file, 0);
rewind($file);
fwrite($file, json_encode(['minute' => $minute, 'count' => $count + 1]));
fclose($file);
foreach (glob($directory . '/*') ?: [] as $counterFile) {
    if (filemtime($counterFile) < time() - 86400) @unlink($counterFile);
}
$data['source'] = 'client';
quote_log($data['event'], $data);
finish_event(204);
