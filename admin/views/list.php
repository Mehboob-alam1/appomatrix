<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= e($title) ?> — Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-zinc-950 text-zinc-100">
  <div class="mx-auto max-w-5xl px-4 py-10">
    <?php require __DIR__ . '/_nav.php'; ?>
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-2xl font-semibold"><?= e($title) ?></h1>
      <a href="<?= e(site_url('/admin/edit?entity=' . urlencode($entity))) ?>" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium">Add new</a>
    </div>
    <ul class="mt-8 space-y-2">
      <?php foreach ($items as $row): ?>
        <li class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <span><?= e($row['title'] ?? $row['name'] ?? $row['client_name'] ?? $row['id']) ?></span>
          <a href="<?= e(site_url('/admin/edit?entity=' . urlencode($entity) . '&id=' . urlencode($row['id']))) ?>" class="text-sm text-indigo-400">Edit</a>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</body>
</html>
