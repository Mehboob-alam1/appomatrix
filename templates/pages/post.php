<article class="py-10 sm:py-14">
  <div class="container max-w-3xl">
    <nav class="text-sm text-muted"><a href="<?= e(site_url('/blog')) ?>">Blog</a> / <?= e($post['category']) ?></nav>
    <h1 class="mt-6 text-3xl font-semibold sm:text-4xl"><?= e($post['title']) ?></h1>
    <p class="mt-4 text-sm text-muted"><?= e(date('F j, Y', strtotime($post['published_at']))) ?> · <?= e($post['author'] ?? $siteName) ?></p>
    <p class="mt-4 text-lg text-muted"><?= e($post['excerpt']) ?></p>
    <?php if ($img = image_url($post['featured_image'])): ?>
      <img src="<?= e($img) ?>" alt="" class="mt-8 aspect-video w-full rounded-2xl object-cover">
    <?php endif; ?>
    <div class="rich-content mt-10"><?= rich_html($post['content'] ?? $post['excerpt']) ?></div>
  </div>
</article>
