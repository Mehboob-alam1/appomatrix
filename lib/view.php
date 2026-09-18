<?php

declare(strict_types=1);

function render(string $template, array $vars = []): void
{
    global $repo, $appConfig;
    extract($vars);
    $contact = $repo->getContact();
    $settings = $repo->getSettings();
    $siteName = (string) config('site_name', 'Appo Matrix');
    $pageTitle = $vars['pageTitle'] ?? $siteName;
    $metaDescription = $vars['metaDescription'] ?? 'Appo Matrix — software development agency in Gilgit-Baltistan, Pakistan.';

    ob_start();
    require dirname(__DIR__) . '/templates/' . $template . '.php';
    $content = ob_get_clean();

    require dirname(__DIR__) . '/templates/layout.php';
}

function render_admin(string $template, array $vars = []): void
{
    global $repo;
    extract($vars);
    require dirname(__DIR__) . '/admin/views/' . $template . '.php';
}
