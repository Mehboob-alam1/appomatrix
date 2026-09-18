<?php
$adminTitle = 'Site settings';
$adminNarrow = true;
require __DIR__ . '/_head.php';
?>

<?php if (!empty($saved)): ?>
  <p class="admin-alert admin-alert--success">Settings saved.</p>
<?php endif; ?>

<h1 class="admin-h1">Site settings</h1>
<p class="admin-lead">Brand, contact details, Calendly, and optional HTML snippets for analytics or announcements.</p>

<form method="post" action="<?= e(site_url('/admin/settings')) ?>" enctype="multipart/form-data" style="margin-top:1.25rem">
  <fieldset class="admin-fieldset">
    <legend>Brand & logo</legend>
    <label class="admin-field">Site name (header & footer)
      <input name="site_name" value="<?= e($settings['site_name'] ?? $repo->getBrandName()) ?>" class="admin-input" placeholder="Appo Matrix">
    </label>
    <label class="admin-field">Logo URL (optional — or upload below)
      <input name="logo_url" value="<?= e($settings['logo_url'] ?? '') ?>" class="admin-input" placeholder="/uploads/logo.png or https://…">
    </label>
    <?php if (!empty($settings['logo_url'])): ?>
      <img src="<?= e(image_url($settings['logo_url']) ?? '') ?>" alt="Current logo" class="admin-preview-logo">
    <?php endif; ?>
    <label class="admin-field">Upload logo (PNG, SVG, WebP, JPG)
      <input type="file" name="logo_file" accept="image/*" class="admin-input">
    </label>
  </fieldset>

  <fieldset class="admin-fieldset">
    <legend>Contact</legend>
    <label class="admin-field">Email
      <input name="contact_email" value="<?= e($settings['contact_email'] ?? $contact['email']) ?>" class="admin-input">
    </label>
    <label class="admin-field">Phone
      <input name="contact_phone" value="<?= e($settings['contact_phone'] ?? $contact['phone']) ?>" class="admin-input">
    </label>
    <label class="admin-field">WhatsApp (digits only, e.g. 923001234567)
      <input name="contact_whatsapp" value="<?= e($settings['contact_whatsapp'] ?? $contact['whatsapp']) ?>" class="admin-input">
    </label>
    <label class="admin-field">Address
      <textarea name="contact_address" rows="2" class="admin-input"><?= e($settings['contact_address'] ?? $contact['address']) ?></textarea>
    </label>
    <label class="admin-field">Calendly URL
      <input name="calendly_url" value="<?= e($settings['calendly_url'] ?? '') ?>" class="admin-input" placeholder="https://calendly.com/…">
    </label>
  </fieldset>

  <fieldset class="admin-fieldset">
    <legend>Scripts & SEO</legend>
    <label class="admin-field">Announcement bar (HTML)
      <textarea name="announcement_html" rows="2" class="admin-input admin-mono"><?= e($settings['announcement_html'] ?? '') ?></textarea>
    </label>
    <label class="admin-field">Extra &lt;head&gt; HTML
      <textarea name="head_html" rows="3" class="admin-input admin-mono"><?= e($settings['head_html'] ?? '') ?></textarea>
    </label>
    <label class="admin-field">Body start HTML
      <textarea name="body_start_html" rows="2" class="admin-input admin-mono"><?= e($settings['body_start_html'] ?? '') ?></textarea>
    </label>
    <label class="admin-field">Body end HTML
      <textarea name="body_end_html" rows="2" class="admin-input admin-mono"><?= e($settings['body_end_html'] ?? '') ?></textarea>
    </label>
    <label class="admin-field">Global SEO extra
      <textarea name="global_seo_extra" rows="2" class="admin-input admin-mono"><?= e($settings['global_seo_extra'] ?? '') ?></textarea>
    </label>
  </fieldset>

  <button type="submit" class="admin-btn admin-btn--primary">Save settings</button>
</form>

<?php require __DIR__ . '/_foot.php'; ?>
