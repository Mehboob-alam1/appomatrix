<section class="py-12 sm:py-16">
  <div class="container max-w-3xl">
    <?php if ($img = image_url($project['cover_image'])): ?>
      <img src="<?= e($img) ?>" alt="<?= e($project['title']) ?>" class="mb-8 aspect-video w-full rounded-2xl object-cover">
    <?php endif; ?>
    <p class="text-sm" style="color: var(--accent)"><?= e($project['category']) ?> · <?= e($project['client_name']) ?></p>
    <h1 class="mt-2 text-3xl font-semibold"><?= e($project['title']) ?></h1>
    <?php foreach (['problem' => 'Problem', 'solution' => 'Solution', 'result' => 'Result'] as $key => $label): ?>
      <?php if (!empty($project[$key])): ?>
        <h2 class="mt-10 text-xl font-semibold"><?= e($label) ?></h2>
        <div class="rich-content mt-3"><?= rich_html($project[$key]) ?></div>
      <?php endif; ?>
    <?php endforeach; ?>
  </div>
</section>
