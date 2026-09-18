<?php $adminTitle = $title . ' — Admin'; require __DIR__ . '/_head.php'; ?>

<div class="admin-actions">
  <div>
    <h1 class="admin-h1"><?= e($title) ?></h1>
    <p class="admin-lead">Add, edit, or remove items shown on the marketing site.</p>
  </div>
  <a href="<?= e(site_url('/admin/edit?entity=' . urlencode($entity))) ?>" class="admin-btn admin-btn--primary">Add new</a>
</div>

<ul class="admin-list">
  <?php foreach ($items as $row): ?>
    <li class="admin-list-item">
      <span><?= e($row['title'] ?? $row['name'] ?? $row['client_name'] ?? $row['id']) ?></span>
      <a href="<?= e(site_url('/admin/edit?entity=' . urlencode($entity) . '&id=' . urlencode($row['id']))) ?>" class="admin-link">Edit</a>
    </li>
  <?php endforeach; ?>
</ul>
<?php if (!$items): ?>
  <p class="admin-empty">No items yet. Click “Add new” to create one.</p>
<?php endif; ?>

<?php require __DIR__ . '/_foot.php'; ?>
