<?php $adminTitle = 'Dashboard'; require __DIR__ . '/_head.php'; ?>

<h1 class="admin-h1">Dashboard</h1>
<p class="admin-lead">Manage everything on the public site—services, portfolio, blog, testimonials, team, form submissions, and global settings.</p>

<div class="admin-grid">
  <?php
  $cards = [
      ['href' => '/admin/settings', 'title' => 'Site settings', 'desc' => 'Logo, contact, Calendly, scripts', 'count' => null],
      ['href' => '/admin/services', 'title' => 'Services', 'desc' => 'What you offer on the homepage', 'count' => $stats['services'] ?? 0],
      ['href' => '/admin/projects', 'title' => 'Projects', 'desc' => 'Case studies & portfolio', 'count' => $stats['projects'] ?? 0],
      ['href' => '/admin/posts', 'title' => 'Blog posts', 'desc' => 'Articles & news', 'count' => $stats['posts'] ?? 0],
      ['href' => '/admin/testimonials', 'title' => 'Testimonials', 'desc' => 'Client quotes carousel', 'count' => $stats['testimonials'] ?? 0],
      ['href' => '/admin/team', 'title' => 'Team', 'desc' => 'About page members', 'count' => $stats['team'] ?? 0],
      ['href' => '/admin/submissions', 'title' => 'Form submissions', 'desc' => 'Contact & home inquiries', 'count' => $stats['submissions'] ?? 0],
  ];
  foreach ($cards as $card):
  ?>
    <a href="<?= e(site_url($card['href'])) ?>" class="admin-card-link">
      <h2><?= e($card['title']) ?></h2>
      <p><?= e($card['desc']) ?></p>
      <?php if ($card['count'] !== null): ?>
        <p class="admin-count"><?= (int) $card['count'] ?></p>
      <?php else: ?>
        <p class="admin-count" style="font-size:0.875rem;font-weight:600">Open →</p>
      <?php endif; ?>
    </a>
  <?php endforeach; ?>
</div>

<?php require __DIR__ . '/_foot.php'; ?>
