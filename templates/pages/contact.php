<section class="border-b py-10 sm:py-16" style="border-color: var(--border)">
  <div class="container">
    <span class="pill">Contact</span>
    <h1 class="mt-4 text-3xl font-semibold"><span class="gradient-text">Let's talk about your product</span></h1>
  </div>
</section>
<section class="py-16">
  <div class="container grid gap-12 lg:grid-cols-2">
    <div class="glass-panel rounded-2xl p-6">
      <h2 class="font-semibold">Reach us</h2>
      <ul class="mt-6 space-y-4 text-sm">
        <li><strong>Email</strong><br><a href="mailto:<?= e($contact['email']) ?>" style="color: var(--accent)"><?= e($contact['email']) ?></a></li>
        <li><strong>Phone</strong><br><a href="tel:<?= e(preg_replace('/\s/', '', $contact['phone'])) ?>" style="color: var(--accent)"><?= e($contact['phone']) ?></a></li>
        <li><strong>Office</strong><br><span class="text-muted"><?= e($contact['address']) ?></span></li>
      </ul>
      <?php
        $cal = calendly_embed_url($settings['calendly_url'] ?? '') ?: calendly_embed_url((string) config('calendly_url', ''));
      ?>
      <?php if ($cal): ?>
        <h2 class="mt-10 font-semibold">Book a call</h2>
        <iframe title="Calendly" src="<?= e($cal) ?>" class="mt-4 w-full rounded-xl border" style="border-color: var(--border); min-height: 420px; height: 70dvh"></iframe>
      <?php endif; ?>
    </div>
    <div>
      <h2 class="font-semibold">Project inquiry</h2>
      <?php if (!empty($success)): ?>
        <p class="mt-4 rounded-xl border p-4 text-sm" style="border-color: var(--accent); color: var(--accent)">Thank you! We received your inquiry and will reply within one business day.</p>
      <?php else: ?>
        <form method="post" action="<?= e(site_url('/contact')) ?>" class="glass-panel mt-4 space-y-4 rounded-2xl p-6">
          <input type="hidden" name="_contact" value="1">
          <div>
            <label class="text-sm font-medium">Name</label>
            <input required name="name" class="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm" style="border-color: var(--border)">
          </div>
          <div>
            <label class="text-sm font-medium">Email</label>
            <input required type="email" name="email" class="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm" style="border-color: var(--border)">
          </div>
          <div>
            <label class="text-sm font-medium">Phone (optional)</label>
            <input name="phone" class="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm" style="border-color: var(--border)">
          </div>
          <div>
            <label class="text-sm font-medium">Project type</label>
            <select required name="project_type" class="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm" style="border-color: var(--border)">
              <option value="web">Web development</option>
              <option value="mobile">Mobile app</option>
              <option value="saas">SaaS product</option>
              <option value="consulting">Consulting</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium">Budget</label>
            <select required name="budget" class="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm" style="border-color: var(--border)">
              <option value="under-10k">Under $10k</option>
              <option value="10k-25k">$10k – $25k</option>
              <option value="25k-50k">$25k – $50k</option>
              <option value="50k-plus">$50k+</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium">Timeline</label>
            <select required name="timeline" class="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm" style="border-color: var(--border)">
              <option value="asap">ASAP</option>
              <option value="1-3-months">1–3 months</option>
              <option value="3-6-months">3–6 months</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>
          <div>
            <label class="text-sm font-medium">Details</label>
            <textarea required name="details" rows="4" class="mt-1 w-full rounded-xl border px-4 py-2.5 text-sm" style="border-color: var(--border)"></textarea>
          </div>
          <button type="submit" class="btn-gradient w-full">Submit inquiry</button>
        </form>
      <?php endif; ?>
    </div>
  </div>
</section>
