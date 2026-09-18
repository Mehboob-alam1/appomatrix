<section class="page-block">
  <div class="container content-narrow reveal">
    <?php if ($img = image_url($project['cover_image'])): ?>
      <img src="<?= e($img) ?>" alt="<?= e($project['title']) ?>" class="media-16-10" style="border-radius:var(--radius);margin-bottom:var(--space-3)">
    <?php endif; ?>
    <span class="pill"><?= e($project['category']) ?></span>
    <h1 class="page-title"><?= e($project['title']) ?></h1>
    <p class="card-text" style="-webkit-line-clamp:unset"><?= e($project['client_name']) ?></p>
    <?php foreach (['problem' => 'Problem', 'solution' => 'Solution', 'result' => 'Result'] as $key => $label): ?>
      <?php if (!empty($project[$key])): ?>
        <h2 class="card-title" style="margin-top:var(--space-4)"><?= e($label) ?></h2>
        <div class="rich-content"><?= rich_html($project[$key]) ?></div>
      <?php endif; ?>
    <?php endforeach; ?>
  </div>
</section>
