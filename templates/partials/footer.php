<?php
$footerName = trim($settings['site_name'] ?? '') ?: $siteName;
?>
<footer class="site-footer">
  <div class="footer-cta">
    <div class="container footer-cta-inner">
      <div>
        <p class="footer-cta-title">Plan your next digital product</p>
        <p class="footer-cta-sub">Discovery · Defined builds · Long-term operation</p>
      </div>
      <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient">Get a quote</a>
    </div>
  </div>
  <div class="container footer-grid">
    <div>
      <?php require __DIR__ . '/logo.php'; ?>
      <p class="footer-tagline">Web, mobile, and SaaS—from Gilgit-Baltistan to global clients.</p>
      <p class="footer-office"><strong>Gilgit-Baltistan</strong><br><?= e($contact['address']) ?></p>
    </div>
    <div>
      <p class="footer-col-title">Explore</p>
      <ul class="footer-links">
        <li><a href="<?= e(site_url('/services')) ?>">Services</a></li>
        <li><a href="<?= e(site_url('/work')) ?>">Work</a></li>
        <li><a href="<?= e(site_url('/blog')) ?>">Blog</a></li>
        <li><a href="<?= e(site_url('/contact')) ?>">Contact</a></li>
      </ul>
    </div>
    <div>
      <p class="footer-col-title">Contact</p>
      <ul class="footer-links">
        <li><a href="mailto:<?= e($contact['email']) ?>"><?= e($contact['email']) ?></a></li>
        <li><a href="tel:<?= e(preg_replace('/\s/', '', $contact['phone'])) ?>"><?= e($contact['phone']) ?></a></li>
      </ul>
    </div>
  </div>
  <div class="footer-copy">© <?= date('Y') ?> <?= e($footerName) ?> · Gilgit-Baltistan → worldwide · <a href="<?= e(site_url('/admin/login')) ?>" style="color:inherit;opacity:0.7;text-decoration:none">Admin</a></div>
</footer>
<a href="https://wa.me/<?= e($contact['whatsapp']) ?>?text=<?= urlencode("Hi — I'd like to discuss a project.") ?>" target="_blank" rel="noopener" aria-label="WhatsApp" class="wa-fab">✆</a>
