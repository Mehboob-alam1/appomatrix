<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-zinc-950 text-zinc-100">
  <div class="mx-auto max-w-5xl px-4 py-10">
    <?php require __DIR__ . '/_nav.php'; ?>
    <h1 class="text-2xl font-semibold">Dashboard</h1>
    <p class="mt-2 text-zinc-400">Manage content for the public PHP site.</p>
    <p class="mt-6"><a href="<?= e(site_url('/')) ?>" class="text-indigo-400 hover:underline">View live site →</a></p>
  </div>
</body>
</html>
