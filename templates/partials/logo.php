<?php
/** @var string $siteName */
$logoUrl = trim($settings['logo_url'] ?? '');
$displayName = trim($settings['site_name'] ?? '') ?: $siteName;
$resolvedLogo = $logoUrl !== '' ? image_url($logoUrl) : null;
?>
<a href="<?= e(site_url('/')) ?>" class="logo-link">
  <?php if ($resolvedLogo): ?>
    <img src="<?= e($resolvedLogo) ?>" alt="<?= e($displayName) ?>" class="logo-img" width="120" height="32">
  <?php else: ?>
    <span class="logo-badge" aria-hidden="true"><?= e(mb_strtoupper(mb_substr($displayName, 0, 1))) ?></span>
  <?php endif; ?>
  <span class="logo-text"><?= e($displayName) ?></span>
</a>
