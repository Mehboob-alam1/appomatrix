<?php
$footerName = trim($settings['site_name'] ?? '') ?: $siteName;
?>
<footer class="site-footer">
  <div class="footer-cta">
    <div class="container footer-cta-inner">
      <div>
        <p class="footer-cta-title">Ready to build something great?</p>
        <p class="footer-cta-sub">Free consultation · Clear roadmap · Global delivery</p>
      </div>
      <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient">Book a Free Consultation</a>
    </div>
  </div>
  <div class="container footer-grid">
    <div>
      <?php require __DIR__ . '/logo.php'; ?>
      <p class="card-text" style="-webkit-line-clamp:unset;margin-top:0.65rem">Software agency in Gilgit-Baltistan — web, mobile, and SaaS for global clients.</p>
      <p class="card-text" style="-webkit-line-clamp:unset"><?= e($contact['address']) ?></p>
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
  <div class="footer-copy">© <?= date('Y') ?> <?= e($footerName) ?> · Gilgit-Baltistan → worldwide</div>
</footer>
<a href="https://wa.me/<?= e($contact['whatsapp']) ?>?text=<?= urlencode("Hi — I'd like to discuss a project.") ?>" target="_blank" rel="noopener" aria-label="WhatsApp" class="wa-fab">✆</a>
