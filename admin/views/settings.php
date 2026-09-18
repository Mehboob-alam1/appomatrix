<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Site settings</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-zinc-950 text-zinc-100">
  <div class="mx-auto max-w-3xl px-4 py-10">
    <?php require __DIR__ . '/_nav.php'; ?>
    <?php if (!empty($saved)): ?>
      <p class="mb-4 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">Settings saved.</p>
    <?php endif; ?>
    <h1 class="text-2xl font-semibold">Site settings</h1>
    <form method="post" action="<?= e(site_url('/admin/settings')) ?>" class="mt-8 space-y-6">
      <fieldset class="space-y-3 rounded-xl border border-zinc-800 p-4">
        <legend class="px-1 text-sm font-semibold text-indigo-300">Contact details</legend>
        <label class="block text-sm">Email <input name="contact_email" value="<?= e($settings['contact_email'] ?? $contact['email']) ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Phone <input name="contact_phone" value="<?= e($settings['contact_phone'] ?? $contact['phone']) ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">WhatsApp (digits) <input name="contact_whatsapp" value="<?= e($settings['contact_whatsapp'] ?? $contact['whatsapp']) ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
        <label class="block text-sm">Address <textarea name="contact_address" rows="2" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"><?= e($settings['contact_address'] ?? $contact['address']) ?></textarea></label>
        <label class="block text-sm">Calendly URL <input name="calendly_url" value="<?= e($settings['calendly_url'] ?? '') ?>" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"></label>
      </fieldset>
      <label class="block text-sm">Announcement bar (HTML) <textarea name="announcement_html" rows="2" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2"><?= e($settings['announcement_html'] ?? '') ?></textarea></label>
      <label class="block text-sm">Head HTML <textarea name="head_html" rows="4" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs"><?= e($settings['head_html'] ?? '') ?></textarea></label>
      <label class="block text-sm">Body start HTML <textarea name="body_start_html" rows="3" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs"><?= e($settings['body_start_html'] ?? '') ?></textarea></label>
      <label class="block text-sm">Body end HTML <textarea name="body_end_html" rows="3" class="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs"><?= e($settings['body_end_html'] ?? '') ?></textarea></label>
      <button type="submit" class="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium">Save settings</button>
    </form>
  </div>
</body>
</html>
