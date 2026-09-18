<?php
$apath = parse_url($_SERVER['REQUEST_URI'] ?? '/admin', PHP_URL_PATH) ?: '/admin';
$apath = rtrim($apath, '/') ?: '/admin';
$links = [
    ['href' => '/admin', 'label' => 'Dashboard', 'match' => fn ($p) => $p === '/admin'],
    ['href' => '/admin/posts', 'label' => 'Posts'],
    ['href' => '/admin/projects', 'label' => 'Projects'],
    ['href' => '/admin/services', 'label' => 'Services'],
    ['href' => '/admin/testimonials', 'label' => 'Testimonials'],
    ['href' => '/admin/team', 'label' => 'Team'],
    ['href' => '/admin/submissions', 'label' => 'Submissions'],
    ['href' => '/admin/settings', 'label' => 'Settings'],
];
?>
<nav class="admin-nav" aria-label="Admin">
  <?php foreach ($links as $link): ?>
    <?php
      $href = $link['href'];
      $active = isset($link['match']) ? ($link['match'])($apath) : ($apath === $href || str_starts_with($apath, $href . '/'));
    ?>
    <a href="<?= e(site_url($href)) ?>"<?= $active ? ' class="is-active"' : '' ?>><?= e($link['label']) ?></a>
  <?php endforeach; ?>
  <a href="<?= e(site_url('/admin/logout')) ?>" class="admin-nav-logout">Logout</a>
</nav>
