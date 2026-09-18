<section class="border-b py-10 sm:py-16" style="border-color: var(--border)">
  <div class="container">
    <span class="pill">Services</span>
    <h1 class="mt-4 text-3xl font-semibold sm:text-4xl"><span class="gradient-text">Everything you need to ship</span></h1>
    <p class="mt-4 max-w-2xl text-muted">Web, mobile, SaaS, and digital transformation—from discovery to launch.</p>
  </div>
</section>
<section class="py-16">
  <div class="container grid gap-6 sm:grid-cols-2">
    <?php foreach ($services as $s): ?>
      <a href="<?= e(site_url('/services/' . $s['slug'])) ?>" class="card p-6 hover:shadow-md">
        <h2 class="text-xl font-semibold"><?= e($s['title']) ?></h2>
        <p class="mt-2 text-muted"><?= e($s['short_description']) ?></p>
      </a>
    <?php endforeach; ?>
  </div>
</section>
