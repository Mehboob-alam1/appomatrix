<section class="border-b py-10 sm:py-16" style="border-color: var(--border)">
  <div class="container">
    <h1 class="text-3xl font-semibold sm:text-4xl">Blog</h1>
    <p class="mt-4 text-muted">Insights on shipping software from Gilgit-Baltistan to global markets.</p>
  </div>
</section>
<section class="py-16">
  <div class="container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <?php foreach ($posts as $post): ?>
      <a href="<?= e(site_url('/blog/' . $post['slug'])) ?>" class="card overflow-hidden">
        <?php if ($img = image_url($post['featured_image'])): ?>
          <img src="<?= e($img) ?>" alt="" class="aspect-video object-cover">
        <?php endif; ?>
        <div class="p-5">
          <span class="text-xs font-semibold" style="color: var(--accent)"><?= e($post['category']) ?></span>
          <h2 class="mt-2 font-semibold"><?= e($post['title']) ?></h2>
          <p class="mt-2 text-sm text-muted line-clamp-2"><?= e($post['excerpt']) ?></p>
        </div>
      </a>
    <?php endforeach; ?>
  </div>
</section>
