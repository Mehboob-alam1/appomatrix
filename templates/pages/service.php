<section class="py-12 sm:py-16">
  <div class="container max-w-3xl">
    <p class="text-sm" style="color: var(--accent)">Service</p>
    <h1 class="mt-2 text-3xl font-semibold sm:text-4xl"><?= e($service['title']) ?></h1>
    <p class="mt-4 text-lg text-muted"><?= e($service['short_description']) ?></p>
    <div class="rich-content mt-8"><?= rich_html($service['full_description'] ?? '') ?></div>
    <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient mt-10 inline-flex">Book a consultation</a>
  </div>
</section>
