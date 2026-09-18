<?php $adminTitle = 'Form submissions'; require __DIR__ . '/_head.php'; ?>

<h1 class="admin-h1">Form submissions</h1>
<p class="admin-lead">Inquiries from the contact page and homepage form.</p>

<div style="margin-top:1.25rem">
  <?php foreach ($items as $row): ?>
    <article class="admin-submission">
      <p><strong><?= e($row['name']) ?></strong> · <?= e($row['email']) ?><?= !empty($row['phone']) ? ' · ' . e($row['phone']) : '' ?></p>
      <p class="admin-submission-meta"><?= e($row['project_type']) ?> · Budget: <?= e($row['budget']) ?> · <?= e($row['timeline']) ?><?= !empty($row['source']) ? ' · Source: ' . e($row['source']) : '' ?></p>
      <p style="margin:0.65rem 0 0"><?= e($row['details']) ?></p>
      <p class="admin-submission-meta" style="margin-top:0.5rem;font-size:0.75rem"><?= e($row['submitted_at']) ?></p>
    </article>
  <?php endforeach; ?>
  <?php if (!$items): ?>
    <p class="admin-empty">No submissions yet.</p>
  <?php endif; ?>
</div>

<?php require __DIR__ . '/_foot.php'; ?>
