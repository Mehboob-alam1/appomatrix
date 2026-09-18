<?php
$eyebrow = 'Blog';
$title = 'Ideas worth sharing';
$description = 'Software, product, and engineering notes for global teams.';
require __DIR__ . '/../partials/page-hero.php';
?>
<section class="section section--flush-top">
  <div class="container grid grid-sm-2 grid-md-3">
    <?php foreach ($posts as $post): ?>
      <a href="<?= e(site_url('/blog/' . $post['slug'])) ?>" class="card card-hover reveal" style="overflow:hidden">
        <?php if ($img = image_url($post['featured_image'])): ?>
          <img src="<?= e($img) ?>" alt="" class="media-16-10" loading="lazy">
        <?php endif; ?>
        <div class="card-pad">
          <p class="card-meta card-meta--accent"><?= e($post['category']) ?></p>
          <h2 class="card-title"><?= e($post['title']) ?></h2>
          <p class="card-text"><?= e($post['excerpt']) ?></p>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
</section>
