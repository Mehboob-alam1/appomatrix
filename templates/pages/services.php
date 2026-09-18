<?php
$eyebrow = 'Services';
$title = 'Everything you need to ship';
$description = 'Web, mobile, SaaS, and digital transformation—from discovery to launch.';
require __DIR__ . '/../partials/page-hero.php';
?>
<section class="section section--flush-top">
  <div class="container grid grid-sm-2">
    <?php foreach ($services as $s): ?>
      <a href="<?= e(site_url('/services/' . $s['slug'])) ?>" class="card card-hover card-pad reveal">
        <h2 class="card-title"><?= e($s['title']) ?></h2>
        <p class="card-text"><?= e($s['short_description']) ?></p>
      </a>
    <?php endforeach; ?>
  </div>
</section>
