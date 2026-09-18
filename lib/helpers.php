<?php

declare(strict_types=1);

function e(?string $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function config(string $key, ?string $default = null): ?string
{
    global $appConfig;
    return $appConfig[$key] ?? $default;
}

function site_url(string $path = ''): string
{
    $base = rtrim((string) config('site_url', ''), '/');
    if ($path === '' || $path === '/') {
        return $base ?: '/';
    }
    return $base . (str_starts_with($path, '/') ? $path : '/' . $path);
}

function asset(string $path): string
{
    return site_url('/assets/' . ltrim($path, '/'));
}

function redirect(string $path): never
{
    header('Location: ' . site_url($path));
    exit;
}

function json_response(array $data, int $code = 200): never
{
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function uuid(): string
{
    return bin2hex(random_bytes(16));
}

function slugify(string $text): string
{
    $text = strtolower(trim($text));
    $text = preg_replace('/[^a-z0-9]+/', '-', $text) ?? '';
    return trim($text, '-') ?: 'item';
}

function sanitize_html(?string $html): string
{
    if ($html === null || $html === '') {
        return '';
    }
    $allowed = '<p><br><strong><em><u><h1><h2><h3><h4><ul><ol><li><a><blockquote><img><figure><figcaption><span><div>';
    return strip_tags($html, $allowed);
}

function rich_html(?string $html): string
{
    return sanitize_html($html);
}

function plain_text(?string $value): string
{
    if ($value === null) {
        return '';
    }
    if (str_contains($value, '<')) {
        return trim(strip_tags($value));
    }
    return $value;
}

function json_decode_array(?string $json): array
{
    if (!$json) {
        return [];
    }
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

function image_url(?string $url, int $width = 1200): ?string
{
    if (!$url) {
        return null;
    }
    if (str_starts_with($url, 'http') || str_starts_with($url, '/')) {
        return $url;
    }
    return site_url('/uploads/' . ltrim($url, '/'));
}

function calendly_embed_url(?string $raw): ?string
{
    $trimmed = trim((string) $raw);
    if ($trimmed === '') {
        return null;
    }
    $href = str_starts_with($trimmed, 'http') ? $trimmed : 'https://' . $trimmed;
    $parts = parse_url($href);
    if (!$parts || empty($parts['host'])) {
        return null;
    }
    $path = $parts['path'] ?? '/';
    if (!str_ends_with($path, '/embed')) {
        $path = rtrim($path, '/') . '/embed';
    }
    $query = [];
    if (!empty($parts['query'])) {
        parse_str($parts['query'], $query);
    }
    $query['embed_type'] = $query['embed_type'] ?? 'Inline';
    return ($parts['scheme'] ?? 'https') . '://' . $parts['host'] . $path . '?' . http_build_query($query);
}
