<footer class="mt-auto border-t" style="border-color: var(--border)">
  <div style="background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 10%, transparent), color-mix(in srgb, var(--accent-pink) 10%, transparent))">
    <div class="container flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-lg font-semibold">Ready to build something great?</p>
        <p class="mt-1 text-sm text-muted">Free consultation · Clear roadmap · Global delivery</p>
      </div>
      <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient w-full justify-center sm:w-auto">Book a Free Consultation</a>
    </div>
  </div>
  <div class="container grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 md:grid-cols-4">
    <div class="sm:col-span-2">
      <p class="font-semibold"><?= e($siteName) ?></p>
      <p class="mt-2 max-w-md text-sm text-muted">Software development agency in Gilgit-Baltistan, building web, mobile, and SaaS products for global clients.</p>
      <p class="mt-4 text-sm text-muted"><?= e($contact['address']) ?></p>
    </div>
    <div>
      <p class="text-sm font-semibold">Explore</p>
      <ul class="mt-3 space-y-2 text-sm text-muted">
        <li><a href="<?= e(site_url('/services')) ?>">Services</a></li>
        <li><a href="<?= e(site_url('/work')) ?>">Work</a></li>
        <li><a href="<?= e(site_url('/blog')) ?>">Blog</a></li>
        <li><a href="<?= e(site_url('/contact')) ?>">Contact</a></li>
      </ul>
    </div>
    <div>
      <p class="text-sm font-semibold">Contact</p>
      <ul class="mt-3 space-y-2 text-sm text-muted">
        <li><a href="mailto:<?= e($contact['email']) ?>"><?= e($contact['email']) ?></a></li>
        <li><a href="tel:<?= e(preg_replace('/\s/', '', $contact['phone'])) ?>"><?= e($contact['phone']) ?></a></li>
      </ul>
    </div>
  </div>
  <div class="border-t py-4 text-center text-xs text-muted" style="border-color: var(--border)">
    © <?= date('Y') ?> <?= e($siteName) ?>. Built in Gilgit-Baltistan, serving clients worldwide.
  </div>
</footer>
<a href="https://wa.me/<?= e($contact['whatsapp']) ?>?text=<?= urlencode("Hi Appo Matrix — I'd like to discuss a project.") ?>" target="_blank" rel="noopener" aria-label="WhatsApp" class="fixed z-50 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white shadow-lg" style="background:#25D366; bottom: max(1rem, env(safe-area-inset-bottom)); right: max(1rem, env(safe-area-inset-right))">✆</a>
