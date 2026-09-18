<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Site settings</title>
  <link rel="stylesheet" href="<?= e(asset('site.css')) ?>">
  <style>
    body { background: #0c0f1a; color: #e8eaf4; min-height: 100vh; }
    .admin-card { background: #141929; border: 1px solid #2a3148; border-radius: 1rem; padding: 1.25rem; }
    .admin-input { width: 100%; margin-top: 0.35rem; border-radius: 0.65rem; border: 1px solid #2a3148; background: #0c0f1a; padding: 0.55rem 0.75rem; color: inherit; font-family: inherit; font-size: 0.875rem; }
    .admin-label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.75rem; }
    .admin-nav a { border-radius: 0.5rem; padding: 0.4rem 0.75rem; background: #1c2238; font-size: 0.8rem; text-decoration: none; color: #c5cae8; }
    .admin-nav a:hover { background: #5046e5; color: #fff; }
    .btn-save { background: linear-gradient(120deg, #5046e5, #7c3aed); color: #fff; border: none; border-radius: 9999px; padding: 0.65rem 1.25rem; font-weight: 600; cursor: pointer; font-family: inherit; }
    .preview-logo { max-height: 48px; max-width: 160px; object-fit: contain; margin-top: 0.5rem; border-radius: 0.5rem; background: #0c0f1a; padding: 0.35rem; }
  </style>
</head>
<body>
  <div class="container" style="padding-top: 2rem; padding-bottom: 2rem; max-width: 42rem;">
    <nav class="admin-nav" style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.5rem">
      <a href="<?= e(site_url('/admin')) ?>">Dashboard</a>
      <a href="<?= e(site_url('/admin/settings')) ?>">Settings</a>
      <a href="<?= e(site_url('/admin/logout')) ?>">Logout</a>
    </nav>
    <?php if (!empty($saved)): ?>
      <p class="mb-4 rounded-lg px-3 py-2 text-sm" style="background: color-mix(in srgb, #10b981 15%, transparent); color: #6ee7b7">Settings saved.</p>
    <?php endif; ?>
    <h1 class="text-2xl font-bold tracking-tight">Site settings</h1>
    <form method="post" action="<?= e(site_url('/admin/settings')) ?>" enctype="multipart/form-data" class="mt-6 space-y-5">
      <fieldset class="admin-card space-y-3">
        <legend class="px-1 text-sm font-bold" style="color: #a5b4fc">Brand & logo</legend>
        <label class="admin-label">Site name (header & footer)
          <input name="site_name" value="<?= e($settings['site_name'] ?? $repo->getBrandName()) ?>" class="admin-input" placeholder="Appo Matrix">
        </label>
        <label class="admin-label">Logo URL (optional — or upload below)
          <input name="logo_url" value="<?= e($settings['logo_url'] ?? '') ?>" class="admin-input" placeholder="/uploads/logo.png or https://…">
        </label>
        <?php if (!empty($settings['logo_url'])): ?>
          <img src="<?= e(image_url($settings['logo_url']) ?? '') ?>" alt="Current logo" class="preview-logo">
        <?php endif; ?>
        <label class="admin-label">Upload logo (PNG, SVG, WebP)
          <input type="file" name="logo_file" accept="image/*" class="admin-input">
        </label>
      </fieldset>
      <fieldset class="admin-card space-y-3">
        <legend class="px-1 text-sm font-bold" style="color: #a5b4fc">Contact</legend>
        <label class="admin-label">Email <input name="contact_email" value="<?= e($settings['contact_email'] ?? $contact['email']) ?>" class="admin-input"></label>
        <label class="admin-label">Phone <input name="contact_phone" value="<?= e($settings['contact_phone'] ?? $contact['phone']) ?>" class="admin-input"></label>
        <label class="admin-label">WhatsApp (digits) <input name="contact_whatsapp" value="<?= e($settings['contact_whatsapp'] ?? $contact['whatsapp']) ?>" class="admin-input"></label>
        <label class="admin-label">Address <textarea name="contact_address" rows="2" class="admin-input"><?= e($settings['contact_address'] ?? $contact['address']) ?></textarea></label>
        <label class="admin-label">Calendly URL <input name="calendly_url" value="<?= e($settings['calendly_url'] ?? '') ?>" class="admin-input"></label>
      </fieldset>
      <fieldset class="admin-card space-y-3">
        <legend class="px-1 text-sm font-bold" style="color: #a5b4fc">Scripts</legend>
        <label class="admin-label">Announcement (HTML) <textarea name="announcement_html" rows="2" class="admin-input"><?= e($settings['announcement_html'] ?? '') ?></textarea></label>
        <label class="admin-label">Head HTML <textarea name="head_html" rows="3" class="admin-input font-mono text-xs"><?= e($settings['head_html'] ?? '') ?></textarea></label>
        <label class="admin-label">Body start <textarea name="body_start_html" rows="2" class="admin-input font-mono text-xs"><?= e($settings['body_start_html'] ?? '') ?></textarea></label>
        <label class="admin-label">Body end <textarea name="body_end_html" rows="2" class="admin-input font-mono text-xs"><?= e($settings['body_end_html'] ?? '') ?></textarea></label>
      </fieldset>
      <button type="submit" class="btn-save">Save settings</button>
    </form>
  </div>
</body>
</html>
