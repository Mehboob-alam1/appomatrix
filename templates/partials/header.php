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
<header class="site-header">
  <div class="container header-inner">
    <?php require __DIR__ . '/logo.php'; ?>
    <nav class="nav-desktop" aria-label="Main">
      <?php foreach ($nav as $item): ?>
        <?php $active = $current === $item['href'] || str_starts_with($current, $item['href'] . '/'); ?>
        <a href="<?= e(site_url($item['href'])) ?>" class="nav-link<?= $active ? ' is-active' : '' ?>"><?= e($item['label']) ?></a>
      <?php endforeach; ?>
    </nav>
    <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient header-cta">Talk to an expert</a>
    <button type="button" class="menu-btn" id="menu-toggle" aria-expanded="false">Menu</button>
  </div>
  <div id="mobile-nav" class="mobile-nav">
    <div class="container mobile-nav-inner">
      <?php foreach ($nav as $item): ?>
        <a href="<?= e(site_url($item['href'])) ?>" class="nav-link"><?= e($item['label']) ?></a>
      <?php endforeach; ?>
      <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient" style="margin-top:0.35rem">Talk to an expert</a>
    </div>
  </div>
</header>
<script>
document.getElementById("menu-toggle")?.addEventListener("click", () => {
  const nav = document.getElementById("mobile-nav");
  const open = nav?.classList.toggle("is-open");
  document.getElementById("menu-toggle")?.setAttribute("aria-expanded", open ? "true" : "false");
});
</script>
