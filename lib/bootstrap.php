<?php

declare(strict_types=1);

session_start();

$root = dirname(__DIR__);
$appConfig = [];

foreach (['config.local.php', '.env'] as $file) {
    $path = $root . '/' . $file;
    if (!is_file($path)) {
        continue;
    }
    if (str_ends_with($file, '.php')) {
        /** @var array<string, mixed> $loaded */
        $loaded = require $path;
        $appConfig = array_merge($appConfig ?? [], $loaded);
        continue;
    }
    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        if (!str_contains($line, '=')) {
            continue;
        }
        [$k, $v] = explode('=', $line, 2);
        $key = trim($k);
        $val = trim($v, " \t\"'");
        if ($key === 'NEXT_PUBLIC_SITE_URL') {
            $appConfig['site_url'] = $val;
        } elseif ($key === 'ADMIN_USERNAME') {
            $appConfig['admin_username'] = $val;
        } elseif ($key === 'ADMIN_PASSWORD') {
            $appConfig['admin_password'] = $val;
        } elseif ($key === 'NEXT_PUBLIC_CALENDLY_URL') {
            $appConfig['calendly_url'] = $val;
        } elseif ($key === 'CONTACT_NOTIFY_EMAIL') {
            $appConfig['contact_notify_email'] = $val;
        }
    }
}

$appConfig = array_merge([
    'site_url' => '',
    'site_name' => 'Appo Matrix',
    'admin_username' => 'admin',
    'admin_password' => '',
    'contact_notify_email' => 'hello@appomatrix.com',
    'calendly_url' => '',
    'db_path' => $root . '/data/cms.sqlite',
], $appConfig ?? []);

if ($appConfig['site_url'] === '' && !empty($_SERVER['HTTP_HOST'])) {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $appConfig['site_url'] = $scheme . '://' . $_SERVER['HTTP_HOST'];
}

require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Migrator.php';
require_once __DIR__ . '/Seed.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Repository.php';

$db = Database::connect($appConfig['db_path']);
Migrator::run($db, $root . '/drizzle');
Seed::runIfEmpty($db);

$repo = new Repository($db);
