<section class="hero hero--page">
  <div class="hero-blob hero-blob-a" aria-hidden="true"></div>
  <div class="container reveal">
    <?php if (!empty($eyebrow)): ?><span class="pill"><?= e($eyebrow) ?></span><?php endif; ?>
    <h1 class="page-title"><span class="gradient-text"><?= e($title) ?></span></h1>
    <?php if (!empty($description)): ?>
      <p class="lead"><?= e($description) ?></p>
    <?php endif; ?>
  </div>
</section>
