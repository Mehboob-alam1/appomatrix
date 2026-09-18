<?php

declare(strict_types=1);

require __DIR__ . '/lib/bootstrap.php';
require __DIR__ . '/lib/view.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = rtrim($path, '/') ?: '/';

if (str_starts_with($path, '/admin')) {
    require __DIR__ . '/admin/router.php';
    exit;
}

if ($path === '/assets/site.css') {
    header('Content-Type: text/css');
    readfile(__DIR__ . '/assets/site.css');
    exit;
}

if ($path === '/assets/site.js') {
    header('Content-Type: application/javascript; charset=utf-8');
    readfile(__DIR__ . '/assets/site.js');
    exit;
}

if ($method === 'POST' && $path === '/contact') {
    if (isset($_POST['_contact'])) {
        $repo->saveSubmission([
            'name' => trim($_POST['name'] ?? ''),
            'email' => trim($_POST['email'] ?? ''),
            'phone' => trim($_POST['phone'] ?? ''),
            'project_type' => $_POST['project_type'] ?? 'web',
            'budget' => $_POST['budget'] ?? '',
            'timeline' => $_POST['timeline'] ?? '',
            'details' => trim($_POST['details'] ?? ''),
            'source' => 'contact-page',
        ]);
        render('pages/contact', [
            'pageTitle' => 'Contact | ' . config('site_name'),
            'success' => true,
        ]);
        exit;
    }
}

match (true) {
    $path === '/' => render('pages/home', [
        'pageTitle' => config('site_name') . ' — Software that ships',
        'services' => $repo->services(),
        'projects' => $repo->projects(true),
    ]),
    $path === '/about' => render('pages/about', [
        'pageTitle' => 'About | ' . config('site_name'),
        'team' => $repo->team(),
    ]),
    $path === '/contact' => render('pages/contact', [
        'pageTitle' => 'Contact | ' . config('site_name'),
    ]),
    $path === '/services' => render('pages/services', [
        'pageTitle' => 'Services | ' . config('site_name'),
        'services' => $repo->services(),
    ]),
    $path === '/work' => render('pages/work', [
        'pageTitle' => 'Work | ' . config('site_name'),
        'projects' => $repo->projects(),
    ]),
    $path === '/blog' => render('pages/blog', [
        'pageTitle' => 'Blog | ' . config('site_name'),
        'posts' => $repo->posts(),
    ]),
    $path === '/testimonials' => render('pages/testimonials', [
        'pageTitle' => 'Testimonials | ' . config('site_name'),
        'testimonials' => $repo->testimonials(),
    ]),
    preg_match('#^/services/([a-z0-9-]+)$#', $path, $m) && ($service = $repo->serviceBySlug($m[1])) => render('pages/service', [
        'pageTitle' => $service['title'] . ' | ' . config('site_name'),
        'service' => $service,
    ]),
    preg_match('#^/work/([a-z0-9-]+)$#', $path, $m) && ($project = $repo->projectBySlug($m[1])) => render('pages/project', [
        'pageTitle' => $project['title'] . ' | ' . config('site_name'),
        'project' => $project,
    ]),
    preg_match('#^/blog/([a-z0-9-]+)$#', $path, $m) && ($post = $repo->postBySlug($m[1])) => render('pages/post', [
        'pageTitle' => $post['title'] . ' | ' . config('site_name'),
        'post' => $post,
    ]),
    default => (function () {
        http_response_code(404);
        render('pages/404', ['pageTitle' => 'Not found | ' . config('site_name')]);
    })(),
};
