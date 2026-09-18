<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($pageTitle) ?></title>
  <meta name="description" content="<?= e($metaDescription) ?>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="<?= e(asset('site.css')) ?>">
  <?= $settings['head_html'] ?? '' ?>
  <?= $settings['global_seo_extra'] ?? '' ?>
</head>
<body class="mesh-bg">
<?= $settings['announcement_html'] ?? '' ?>
<?= $settings['body_start_html'] ?? '' ?>
<?php require __DIR__ . '/partials/header.php'; ?>
<main class="page-main"><?= $content ?></main>
<?php require __DIR__ . '/partials/footer.php'; ?>
<script src="<?= e(asset('site.js')) ?>" defer></script>
<?= $settings['body_end_html'] ?? '' ?>
</body>
</html>
