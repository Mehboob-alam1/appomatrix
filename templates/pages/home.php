<section class="relative overflow-hidden border-b py-12 sm:py-20" style="border-color: var(--border)">
  <div class="container grid items-center gap-12 lg:grid-cols-2">
    <div>
      <span class="pill">Gilgit-Baltistan → Global clients</span>
      <h1 class="mt-5 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
        Software that wins <span class="gradient-text">trust & revenue</span>
      </h1>
      <p class="mt-5 max-w-xl text-base text-muted sm:text-lg">Appo Matrix partners with founders and enterprises to design, build, and ship web, mobile, and SaaS products—with clear communication every step.</p>
      <div class="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient w-full justify-center sm:w-auto">Book a Free Consultation</a>
        <a href="<?= e(site_url('/work')) ?>" class="btn-secondary w-full justify-center sm:w-auto">View Our Work</a>
      </div>
    </div>
    <div class="glass-panel rounded-2xl p-5 sm:p-7">
      <p class="text-sm font-semibold" style="color: var(--accent)">Why teams choose us</p>
      <ul class="mt-5 space-y-4 text-sm">
        <li class="card p-3">Ship faster — roadmaps you can follow</li>
        <li class="card p-3">Build for reality — low bandwidth when needed</li>
        <li class="card p-3">Talk to builders — meet the people writing code</li>
      </ul>
    </div>
  </div>
</section>
<section class="py-10">
  <div class="container grid grid-cols-2 gap-4 md:grid-cols-4">
    <?php foreach ([['120+','Projects'],['8+','Years'],['15+','Countries'],['94%','Retention']] as [$v,$l]): ?>
      <div class="card rounded-2xl p-4 text-center sm:p-5">
        <p class="text-2xl font-bold sm:text-3xl"><?= e($v) ?></p>
        <p class="mt-1 text-xs text-muted sm:text-sm"><?= e($l) ?></p>
      </div>
    <?php endforeach; ?>
  </div>
</section>
<section class="py-16">
  <div class="container">
    <h2 class="text-2xl font-semibold sm:text-3xl"><span class="gradient-text">Services built for growth</span></h2>
    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <?php foreach ($services as $s): ?>
        <a href="<?= e(site_url('/services/' . $s['slug'])) ?>" class="card block p-5 transition hover:shadow-md">
          <h3 class="font-semibold"><?= e($s['title']) ?></h3>
          <p class="mt-2 text-sm text-muted"><?= e($s['short_description']) ?></p>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<section class="border-y py-16" style="border-color: var(--border); background: color-mix(in srgb, var(--surface) 60%, transparent)">
  <div class="container">
    <h2 class="text-2xl font-semibold">Featured work</h2>
    <div class="mt-10 grid gap-6 md:grid-cols-3">
      <?php foreach (array_slice($projects, 0, 3) as $p): ?>
        <a href="<?= e(site_url('/work/' . $p['slug'])) ?>" class="card overflow-hidden">
          <?php if ($img = image_url($p['cover_image'])): ?>
            <img src="<?= e($img) ?>" alt="<?= e($p['title']) ?>" class="aspect-video w-full object-cover">
          <?php endif; ?>
          <div class="p-5">
            <span class="text-xs font-semibold" style="color: var(--accent-tertiary)"><?= e($p['category']) ?></span>
            <h3 class="mt-1 font-semibold"><?= e($p['title']) ?></h3>
            <p class="mt-2 text-sm text-muted"><?= e($p['excerpt'] ?? '') ?></p>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
