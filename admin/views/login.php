<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin login</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
  <form method="post" class="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
    <h1 class="text-xl font-semibold">Appo Matrix Admin</h1>
    <?php if (!empty($error)): ?>
      <p class="mt-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300"><?= e($error) ?></p>
    <?php endif; ?>
    <label class="mt-6 block text-sm">Username
      <input name="username" required class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2">
    </label>
    <label class="mt-4 block text-sm">Password
      <input name="password" type="password" required class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2">
    </label>
    <button type="submit" class="mt-6 w-full rounded-lg bg-indigo-600 py-2.5 font-medium hover:bg-indigo-500">Sign in</button>
  </form>
</body>
</html>
