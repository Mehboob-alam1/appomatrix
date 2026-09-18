<?php
$eyebrow = 'Testimonials';
$title = 'Client love';
$description = 'Long-term partnerships across logistics, retail, tourism, and health.';
require __DIR__ . '/../partials/page-hero.php';
?>
<section class="section section--flush-top">
  <div class="container grid grid-sm-2">
    <?php foreach ($testimonials as $t): ?>
      <blockquote class="card card-hover card-pad reveal">
        <p class="quote-mark">&ldquo;</p>
        <p class="quote-body"><?= e($t['quote']) ?></p>
        <footer class="quote-foot">
          <p class="card-title"><?= e($t['client_name']) ?></p>
          <p class="card-text"><?= e($t['role']) ?>, <?= e($t['company']) ?></p>
        </footer>
      </blockquote>
    <?php endforeach; ?>
  </div>
</section>
