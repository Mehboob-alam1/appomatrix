<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($pageTitle) ?></title>
  <meta name="description" content="<?= e($metaDescription) ?>">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="<?= e(asset('site.css')) ?>">
  <?= $settings['head_html'] ?? '' ?>
  <?= $settings['global_seo_extra'] ?? '' ?>
</head>
<body class="mesh-bg flex min-h-screen flex-col antialiased">
<?= $settings['announcement_html'] ?? '' ?>
<?= $settings['body_start_html'] ?? '' ?>
<?php require __DIR__ . '/partials/header.php'; ?>
<main class="min-w-0 flex-1 pb-20 sm:pb-0"><?= $content ?></main>
<?php require __DIR__ . '/partials/footer.php'; ?>
<?= $settings['body_end_html'] ?? '' ?>
</body>
</html>
