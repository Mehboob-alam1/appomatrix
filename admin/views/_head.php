<?php
/** @var string $adminTitle */
$adminTitle = $adminTitle ?? 'Admin';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title><?= e($adminTitle) ?> · Appo Matrix</title>
  <link rel="stylesheet" href="<?= e(asset('admin.css')) ?>">
</head>
<body class="admin-body">
<div class="admin-shell<?= !empty($adminNarrow) ? ' admin-shell--narrow' : '' ?>">
  <div class="admin-topbar">
    <div class="admin-brand">Appo Matrix <span>CMS</span></div>
    <?php require __DIR__ . '/_nav.php'; ?>
  </div>
  <main class="admin-main">
