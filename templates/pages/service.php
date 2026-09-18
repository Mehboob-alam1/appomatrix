<section class="page-block">
  <div class="container content-narrow reveal">
    <span class="pill">Service</span>
    <h1 class="page-title"><?= e($service['title']) ?></h1>
    <p class="lead"><?= e($service['short_description']) ?></p>
    <div class="rich-content"><?= rich_html($service['full_description'] ?? '') ?></div>
    <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient" style="margin-top:var(--space-4)">Book a consultation</a>
  </div>
</section>
