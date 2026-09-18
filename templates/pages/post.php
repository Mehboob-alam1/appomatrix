<article class="page-block">
  <div class="container content-narrow reveal">
    <nav class="breadcrumb"><a href="<?= e(site_url('/blog')) ?>">Blog</a> / <?= e($post['category']) ?></nav>
    <h1 class="page-title" style="margin-top:var(--space-3)"><?= e($post['title']) ?></h1>
    <p class="card-text" style="-webkit-line-clamp:unset"><?= e(date('F j, Y', strtotime($post['published_at']))) ?> · <?= e($post['author'] ?? $siteName) ?></p>
    <?php if ($img = image_url($post['featured_image'])): ?>
      <img src="<?= e($img) ?>" alt="" class="media-16-10" style="margin-top:var(--space-3);border-radius:var(--radius)">
    <?php endif; ?>
    <div class="rich-content" style="margin-top:var(--space-4)"><?= rich_html($post['content'] ?? $post['excerpt']) ?></div>
  </div>
</article>
