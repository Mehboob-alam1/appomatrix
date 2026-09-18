<?php
/** @var array<string, mixed>|null $item */
/** @var string $entity */
$id = $item['id'] ?? '';
$labels = [
    'posts' => 'Blog post',
    'projects' => 'Project',
    'services' => 'Service',
    'testimonials' => 'Testimonial',
    'team_members' => 'Team member',
];
$label = $labels[$entity] ?? 'Item';
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Edit <?= e($label) ?></title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-zinc-950 text-zinc-100">
  <div class="mx-auto max-w-3xl px-4 py-10">
    <?php require __DIR__ . '/_nav.php'; ?>
    <?php if (!empty($saved)): ?>
      <p class="mb-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">Saved.</p>
    <?php endif; ?>
    <h1 class="text-2xl font-semibold"><?= $item ? 'Edit' : 'New' ?> <?= e($label) ?></h1>
    <form method="post" class="mt-8 space-y-4">
      <input type="hidden" name="entity" value="<?= e($entity) ?>">
      <input type="hidden" name="action" value="save">
      <input type="hidden" name="id" value="<?= e($id) ?>">

      <?php if ($entity === 'posts'): ?>
        <label class="block text-sm">Title <input name="title" required value="<?= e($item['title'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Slug <input name="slug" value="<?= e($item['slug'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Category <input name="category" required value="<?= e($item['category'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Author <input name="author" value="<?= e($item['author'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Excerpt <textarea name="excerpt" rows="2" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"><?= e($item['excerpt'] ?? '') ?></textarea></label>
        <label class="block text-sm">Content (HTML) <textarea name="content" rows="10" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs"><?= e($item['content'] ?? '') ?></textarea></label>
        <label class="block text-sm">Featured image URL <input name="featured_image" value="<?= e($item['featured_image'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
      <?php elseif ($entity === 'projects'): ?>
        <label class="block text-sm">Title <input name="title" required value="<?= e($item['title'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Slug <input name="slug" value="<?= e($item['slug'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Client <input name="client_name" required value="<?= e($item['client_name'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Category <input name="category" required value="<?= e($item['category'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Excerpt <textarea name="excerpt" rows="2" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"><?= e($item['excerpt'] ?? '') ?></textarea></label>
        <label class="block text-sm">Cover image URL <input name="cover_image" value="<?= e($item['cover_image'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Problem (HTML) <textarea name="problem" rows="4" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"><?= e($item['problem'] ?? '') ?></textarea></label>
        <label class="block text-sm">Solution (HTML) <textarea name="solution" rows="4" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"><?= e($item['solution'] ?? '') ?></textarea></label>
        <label class="block text-sm">Result (HTML) <textarea name="result" rows="4" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"><?= e($item['result'] ?? '') ?></textarea></label>
        <label class="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" <?= !empty($item['featured']) ? 'checked' : '' ?>> Featured</label>
      <?php elseif ($entity === 'services'): ?>
        <label class="block text-sm">Title <input name="title" required value="<?= e($item['title'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Slug <input name="slug" value="<?= e($item['slug'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Short description <textarea name="short_description" required rows="2" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"><?= e($item['short_description'] ?? '') ?></textarea></label>
        <label class="block text-sm">Full description (HTML) <textarea name="full_description" rows="8" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"><?= e($item['full_description'] ?? '') ?></textarea></label>
      <?php elseif ($entity === 'testimonials'): ?>
        <label class="block text-sm">Client name <input name="client_name" required value="<?= e($item['client_name'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Role <input name="role" required value="<?= e($item['role'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Company <input name="company" required value="<?= e($item['company'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Quote <textarea name="quote" required rows="4" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"><?= e($item['quote'] ?? '') ?></textarea></label>
        <label class="block text-sm">Rating (1-5) <input name="rating" type="number" min="1" max="5" value="<?= e((string) ($item['rating'] ?? 5)) ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
      <?php elseif ($entity === 'team_members'): ?>
        <label class="block text-sm">Name <input name="name" required value="<?= e($item['name'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Role <input name="role" required value="<?= e($item['role'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Bio <textarea name="bio" rows="4" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"><?= e($item['bio'] ?? '') ?></textarea></label>
      <?php endif; ?>

      <button type="submit" class="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium">Save</button>
    </form>
    <?php if ($item): ?>
      <form method="post" class="mt-4" onsubmit="return confirm('Delete this item?')">
        <input type="hidden" name="entity" value="<?= e($entity) ?>">
        <input type="hidden" name="action" value="delete">
        <input type="hidden" name="id" value="<?= e($id) ?>">
        <button type="submit" class="rounded-lg border border-red-500/50 px-5 py-2.5 text-sm text-red-300">Delete</button>
      </form>
    <?php endif; ?>
  </div>
</body>
</html>
