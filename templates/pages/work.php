<?php
$eyebrow = 'Case studies';
$title = 'Proof over promises';
$description = 'Real outcomes across logistics, tourism, and health.';
require __DIR__ . '/../partials/page-hero.php';
?>
<section class="section section--flush-top">
  <div class="container grid grid-sm-2 grid-md-3">
    <?php foreach ($projects as $p): ?>
      <a href="<?= e(site_url('/work/' . $p['slug'])) ?>" class="card card-hover reveal" style="overflow:hidden">
        <?php if ($img = image_url($p['cover_image'])): ?>
          <img src="<?= e($img) ?>" alt="" class="media-16-10" loading="lazy">
        <?php endif; ?>
        <div class="card-pad">
          <h2 class="card-title"><?= e($p['title']) ?></h2>
          <p class="card-text"><?= e($p['client_name']) ?> · <?= e($p['category']) ?></p>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
</section>
