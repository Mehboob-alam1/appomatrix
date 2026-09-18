<section class="border-b py-10 sm:py-16" style="border-color: var(--border)">
  <div class="container">
    <span class="pill">About us</span>
    <h1 class="mt-4 text-3xl font-semibold"><span class="gradient-text">Built in the mountains, trusted worldwide</span></h1>
  </div>
</section>
<section class="py-16">
  <div class="container grid gap-10 lg:grid-cols-2">
    <div class="space-y-4 text-muted leading-relaxed">
      <p>We started Appo Matrix in Gilgit-Baltistan because world-class software shouldn't require world-class rent.</p>
      <p>From logistics SaaS to tourism booking engines, we focus on clarity: honest timelines and communication you can forward to your board.</p>
    </div>
    <div class="glass-panel rounded-2xl p-6">
      <h2 class="font-semibold">Global reach</h2>
      <p class="mt-3 text-sm text-muted">Based in <?= e($contact['address']) ?>, collaborating across US, UK, EU, and MENA timezones.</p>
    </div>
  </div>
  <div class="container mt-16">
    <h2 class="text-2xl font-semibold">Team</h2>
    <div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <?php foreach ($team as $m): ?>
        <div class="card p-5">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl font-semibold" style="background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent)"><?= e(mb_substr($m['name'], 0, 1)) ?></div>
          <h3 class="mt-4 font-medium"><?= e($m['name']) ?></h3>
          <p class="text-sm" style="color: var(--accent)"><?= e($m['role']) ?></p>
          <?php if ($m['bio']): ?><p class="mt-2 text-sm text-muted"><?= e($m['bio']) ?></p><?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
