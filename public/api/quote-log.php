<?php
declare(strict_types=1);

// Uses the hosting PHP error log. Never write visitor data or logs into dist/.
function quote_log(string $event, array $context = []): void {
    $record = [
        'time' => gmdate('c'),
        'event' => $event,
        'environment' => ($_SERVER['HTTP_HOST'] ?? '') === 'rafaeldev.com.br' ? 'producao' : 'homologacao',
    ];
    foreach (['source', 'session_id', 'request_id', 'project', 'field', 'reason', 'status', 'campaign', 'position'] as $key) {
        if (isset($context[$key])) $record[$key] = $context[$key];
    }
    // An unavailable diagnostic log must not corrupt a JSON response or prevent delivery.
    @error_log('[quote] ' . json_encode($record, JSON_UNESCAPED_SLASHES));
}

function quote_valid_id($value): bool {
    return is_string($value) && preg_match('/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/D', $value) === 1;
}
