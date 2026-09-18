<?php

declare(strict_types=1);

require dirname(__DIR__) . '/lib/view.php';

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = rtrim($path, '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($path === '/admin/logout') {
    Auth::logout();
    redirect('/admin/login');
}

if ($path === '/admin/login') {
    if ($method === 'POST') {
        if (Auth::attempt(trim($_POST['username'] ?? ''), $_POST['password'] ?? '')) {
            redirect('/admin');
        }
        $error = 'Invalid username or password.';
    }
    if (Auth::check()) {
        redirect('/admin');
    }
    render_admin('login', ['error' => $error ?? null]);
    exit;
}

Auth::require();

if ($method === 'POST' && $path === '/admin/settings') {
    $logoUrl = trim($_POST['logo_url'] ?? '');
    if (!empty($_FILES['logo_file']['tmp_name']) && is_uploaded_file($_FILES['logo_file']['tmp_name'])) {
        $ext = strtolower(pathinfo($_FILES['logo_file']['name'], PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'], true)) {
            $uploadDir = dirname(__DIR__) . '/uploads';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            $filename = 'logo.' . ($ext === 'jpeg' ? 'jpg' : $ext);
            if (move_uploaded_file($_FILES['logo_file']['tmp_name'], $uploadDir . '/' . $filename)) {
                $logoUrl = '/uploads/' . $filename;
            }
        }
    }

    $repo->saveSettings([
        'head_html' => $_POST['head_html'] ?? '',
        'body_start_html' => $_POST['body_start_html'] ?? '',
        'body_end_html' => $_POST['body_end_html'] ?? '',
        'announcement_html' => $_POST['announcement_html'] ?? '',
        'blog_sidebar_html' => $_POST['blog_sidebar_html'] ?? '',
        'blog_in_article_html' => $_POST['blog_in_article_html'] ?? '',
        'global_seo_extra' => $_POST['global_seo_extra'] ?? '',
        'calendly_url' => trim($_POST['calendly_url'] ?? ''),
        'contact_email' => trim($_POST['contact_email'] ?? ''),
        'contact_phone' => trim($_POST['contact_phone'] ?? ''),
        'contact_whatsapp' => trim($_POST['contact_whatsapp'] ?? ''),
        'contact_address' => trim($_POST['contact_address'] ?? ''),
        'logo_url' => $logoUrl,
        'site_name' => trim($_POST['site_name'] ?? ''),
    ]);
    redirect('/admin/settings?saved=1');
}

if ($method === 'POST' && isset($_POST['entity'], $_POST['action'])) {
    $entity = $_POST['entity'];
    $action = $_POST['action'];
    if ($action === 'delete' && !empty($_POST['id'])) {
        $repo->delete($entity, $_POST['id']);
        $adminList = [
            'posts' => 'posts',
            'projects' => 'projects',
            'services' => 'services',
            'testimonials' => 'testimonials',
            'team_members' => 'team',
        ];
        redirect('/admin/' . ($adminList[$entity] ?? 'posts'));
    }
    if ($action === 'save') {
        $id = $_POST['id'] ?: uuid();
        match ($entity) {
            'posts' => $repo->savePost([
                'id' => $id,
                'slug' => trim($_POST['slug'] ?? '') ?: slugify($_POST['title'] ?? ''),
                'title' => trim($_POST['title'] ?? ''),
                'excerpt' => trim($_POST['excerpt'] ?? ''),
                'content' => $_POST['content'] ?? '',
                'category' => trim($_POST['category'] ?? ''),
                'author' => trim($_POST['author'] ?? ''),
                'featured_image' => trim($_POST['featured_image'] ?? ''),
                'seo_title' => trim($_POST['seo_title'] ?? ''),
                'seo_description' => trim($_POST['seo_description'] ?? ''),
                'published_at' => $_POST['published_at'] ?? date('c'),
                'reading_time_minutes' => (int) ($_POST['reading_time_minutes'] ?? 5),
            ]),
            'projects' => $repo->saveProject([
                'id' => $id,
                'slug' => trim($_POST['slug'] ?? '') ?: slugify($_POST['title'] ?? ''),
                'title' => trim($_POST['title'] ?? ''),
                'client_name' => trim($_POST['client_name'] ?? ''),
                'category' => trim($_POST['category'] ?? ''),
                'excerpt' => trim($_POST['excerpt'] ?? ''),
                'cover_image' => trim($_POST['cover_image'] ?? ''),
                'problem' => $_POST['problem'] ?? '',
                'solution' => $_POST['solution'] ?? '',
                'result' => $_POST['result'] ?? '',
                'featured' => isset($_POST['featured']),
                'seo_title' => trim($_POST['seo_title'] ?? ''),
                'seo_description' => trim($_POST['seo_description'] ?? ''),
            ]),
            'services' => $repo->saveService([
                'id' => $id,
                'slug' => trim($_POST['slug'] ?? '') ?: slugify($_POST['title'] ?? ''),
                'title' => trim($_POST['title'] ?? ''),
                'short_description' => trim($_POST['short_description'] ?? ''),
                'full_description' => $_POST['full_description'] ?? '',
                'icon' => trim($_POST['icon'] ?? ''),
                'seo_title' => trim($_POST['seo_title'] ?? ''),
                'seo_description' => trim($_POST['seo_description'] ?? ''),
            ]),
            'testimonials' => $repo->saveTestimonial([
                'id' => $id,
                'client_name' => trim($_POST['client_name'] ?? ''),
                'role' => trim($_POST['role'] ?? ''),
                'company' => trim($_POST['company'] ?? ''),
                'quote' => trim($_POST['quote'] ?? ''),
                'rating' => (int) ($_POST['rating'] ?? 5),
            ]),
            'team_members' => $repo->saveTeamMember([
                'id' => $id,
                'name' => trim($_POST['name'] ?? ''),
                'role' => trim($_POST['role'] ?? ''),
                'bio' => trim($_POST['bio'] ?? ''),
            ]),
            default => null,
        };
        redirect('/admin/edit?entity=' . urlencode($entity) . '&id=' . urlencode($id) . '&saved=1');
    }
}

match (true) {
    $path === '/admin' || $path === '/admin/' => render_admin('dashboard'),
    $path === '/admin/settings' => render_admin('settings', [
        'settings' => $repo->getSettings(),
        'contact' => $repo->getContact(),
        'saved' => isset($_GET['saved']),
    ]),
    $path === '/admin/submissions' => render_admin('submissions', ['items' => $repo->submissions()]),
    $path === '/admin/posts' => render_admin('list', ['title' => 'Blog posts', 'entity' => 'posts', 'items' => $repo->all('posts')]),
    $path === '/admin/projects' => render_admin('list', ['title' => 'Projects', 'entity' => 'projects', 'items' => $repo->all('projects')]),
    $path === '/admin/services' => render_admin('list', ['title' => 'Services', 'entity' => 'services', 'items' => $repo->all('services')]),
    $path === '/admin/testimonials' => render_admin('list', ['title' => 'Testimonials', 'entity' => 'testimonials', 'items' => $repo->all('testimonials')]),
    $path === '/admin/team' => render_admin('list', ['title' => 'Team', 'entity' => 'team_members', 'items' => $repo->all('team_members')]),
    $path === '/admin/edit' => render_admin('edit', [
        'entity' => $_GET['entity'] ?? 'posts',
        'item' => !empty($_GET['id']) ? $repo->find($_GET['entity'] ?? 'posts', $_GET['id']) : null,
        'saved' => isset($_GET['saved']),
    ]),
    default => (function () {
        http_response_code(404);
        echo 'Not found';
    })(),
};
