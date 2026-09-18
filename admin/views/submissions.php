<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Submissions</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-zinc-950 text-zinc-100">
  <div class="mx-auto max-w-5xl px-4 py-10">
    <?php require __DIR__ . '/_nav.php'; ?>
    <h1 class="text-2xl font-semibold">Form submissions</h1>
    <div class="mt-8 space-y-4">
      <?php foreach ($items as $row): ?>
        <article class="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm">
          <p class="font-medium"><?= e($row['name']) ?> · <?= e($row['email']) ?></p>
          <p class="mt-1 text-zinc-400"><?= e($row['project_type']) ?> · <?= e($row['budget']) ?> · <?= e($row['timeline']) ?></p>
          <p class="mt-2 text-zinc-300"><?= e($row['details']) ?></p>
          <p class="mt-2 text-xs text-zinc-500"><?= e($row['submitted_at']) ?></p>
        </article>
      <?php endforeach; ?>
      <?php if (!$items): ?>
        <p class="text-zinc-500">No submissions yet.</p>
      <?php endif; ?>
    </div>
  </div>
</body>
</html>
