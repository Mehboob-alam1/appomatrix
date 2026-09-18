<?php
$eyebrow = 'About us';
$title = 'Built in the mountains, trusted worldwide';
$description = 'Product strategy, design, and engineering from Gilgit-Baltistan.';
require __DIR__ . '/../partials/page-hero.php';
?>
<section class="section section--flush-top">
  <div class="container split-2">
    <div class="reveal text-muted">
      <p style="margin:0 0 0.65rem">We started Appo Matrix because world-class software shouldn't require world-class rent.</p>
      <p style="margin:0">From logistics SaaS to tourism booking—we focus on clarity and honest timelines.</p>
    </div>
    <div class="glass-panel card-pad reveal">
      <h2 class="card-title">Global reach</h2>
      <p class="card-text" style="-webkit-line-clamp:unset">Based in <?= e($contact['address']) ?>, collaborating across US, UK, EU, and MENA.</p>
    </div>
  </div>
  <div class="container" style="margin-top:var(--space-4)">
    <h2 class="card-title reveal">Team</h2>
    <div class="grid grid-sm-2 grid-lg-4" style="margin-top:var(--space-3)">
      <?php foreach ($team as $m): ?>
        <article class="card card-hover card-pad reveal">
          <div class="logo-badge" style="width:2.25rem;height:2.25rem"><?= e(mb_substr($m['name'], 0, 1)) ?></div>
          <h3 class="card-title" style="margin-top:0.65rem"><?= e($m['name']) ?></h3>
          <p class="card-meta card-meta--accent" style="text-transform:none;font-size:0.8125rem"><?= e($m['role']) ?></p>
          <?php if ($m['bio']): ?><p class="card-text"><?= e($m['bio']) ?></p><?php endif; ?>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>
