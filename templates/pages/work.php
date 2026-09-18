<section class="border-b py-10 sm:py-16" style="border-color: var(--border)">
  <div class="container">
    <span class="pill">Case studies</span>
    <h1 class="mt-4 text-3xl font-semibold"><span class="gradient-text">Proof over promises</span></h1>
  </div>
</section>
<section class="py-16">
  <div class="container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <?php foreach ($projects as $p): ?>
      <a href="<?= e(site_url('/work/' . $p['slug'])) ?>" class="card overflow-hidden">
        <?php if ($img = image_url($p['cover_image'])): ?>
          <img src="<?= e($img) ?>" alt="" class="aspect-video object-cover">
        <?php endif; ?>
        <div class="p-5">
          <h2 class="font-semibold"><?= e($p['title']) ?></h2>
          <p class="mt-1 text-sm text-muted"><?= e($p['client_name']) ?> · <?= e($p['category']) ?></p>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
</section>
