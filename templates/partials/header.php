<?php
$nav = [
    ['label' => 'Services', 'href' => '/services'],
    ['label' => 'Work', 'href' => '/work'],
    ['label' => 'Blog', 'href' => '/blog'],
    ['label' => 'About', 'href' => '/about'],
    ['label' => 'Testimonials', 'href' => '/testimonials'],
    ['label' => 'Contact', 'href' => '/contact'],
];
$current = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
?>
<header class="sticky top-0 z-40 border-b glass-panel" style="border-color: var(--border)">
  <div class="container flex h-16 items-center justify-between gap-2">
    <a href="<?= e(site_url('/')) ?>" class="flex min-w-0 items-center gap-2 font-semibold">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white" style="background: linear-gradient(135deg, var(--accent), var(--accent-pink))">A</span>
      <span class="truncate"><?= e($siteName) ?></span>
    </a>
    <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
      <?php foreach ($nav as $item): ?>
        <?php $active = $current === $item['href'] || str_starts_with($current, $item['href'] . '/'); ?>
        <a href="<?= e(site_url($item['href'])) ?>" class="rounded-full px-3 py-2 text-sm font-medium <?= $active ? 'text-[var(--accent)]' : 'text-muted' ?>" style="<?= $active ? 'background: color-mix(in srgb, var(--accent) 10%, transparent)' : '' ?>"><?= e($item['label']) ?></a>
      <?php endforeach; ?>
    </nav>
    <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient hidden text-sm md:inline-flex" style="padding: 0.5rem 1rem">Free consultation</a>
    <button type="button" id="menu-toggle" class="rounded-xl border px-3 py-2 text-sm md:hidden" style="border-color: var(--border)">Menu</button>
  </div>
  <div id="mobile-nav" class="hidden border-t md:hidden" style="border-color: var(--border); background: var(--surface)">
    <div class="container flex flex-col gap-1 py-4">
      <?php foreach ($nav as $item): ?>
        <a href="<?= e(site_url($item['href'])) ?>" class="rounded-xl px-3 py-2.5 text-sm font-medium"><?= e($item['label']) ?></a>
      <?php endforeach; ?>
      <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient mt-2 justify-center text-sm">Free consultation</a>
    </div>
  </div>
</header>
<script>
document.getElementById('menu-toggle')?.addEventListener('click', () => {
  document.getElementById('mobile-nav')?.classList.toggle('hidden');
});
</script>
