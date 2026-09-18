<?php
$eyebrow = 'Contact';
$title = "Let's talk about your product";
$description = 'Share your project or book a call—we meet you where you are.';
require __DIR__ . '/../partials/page-hero.php';
?>
<section class="section section--flush-top">
  <div class="container split-2">
    <div class="glass-panel card-pad reveal">
      <h2 class="card-title">Reach us</h2>
      <ul class="footer-links" style="margin-top:0.65rem">
        <li><strong>Email</strong><br><a href="mailto:<?= e($contact['email']) ?>" style="color:var(--accent)"><?= e($contact['email']) ?></a></li>
        <li style="margin-top:0.5rem"><strong>Phone</strong><br><a href="tel:<?= e(preg_replace('/\s/', '', $contact['phone'])) ?>" style="color:var(--accent)"><?= e($contact['phone']) ?></a></li>
        <li style="margin-top:0.5rem"><strong>Office</strong><br><span class="text-muted"><?= e($contact['address']) ?></span></li>
      </ul>
      <?php
        $cal = calendly_embed_url($settings['calendly_url'] ?? '') ?: calendly_embed_url((string) config('calendly_url', ''));
      ?>
      <?php if ($cal): ?>
        <h2 class="card-title" style="margin-top:var(--space-4)">Book a call</h2>
        <iframe title="Calendly" src="<?= e($cal) ?>" style="margin-top:0.5rem;width:100%;min-height:340px;height:50dvh;border:1px solid var(--border);border-radius:var(--radius)"></iframe>
      <?php endif; ?>
    </div>
    <div class="reveal">
      <h2 class="card-title">Project inquiry</h2>
      <?php if (!empty($success)): ?>
        <p class="card-text" style="-webkit-line-clamp:unset;color:var(--accent);margin-top:0.65rem">Thank you! We'll reply within one business day.</p>
      <?php else: ?>
        <form method="post" action="<?= e(site_url('/contact')) ?>" class="glass-panel form-stack card-pad">
          <input type="hidden" name="_contact" value="1">
          <label>Name<input required name="name"></label>
          <label>Email<input required type="email" name="email"></label>
          <label>Phone (optional)<input name="phone"></label>
          <label>Project type
            <select required name="project_type">
              <option value="web">Web development</option>
              <option value="mobile">Mobile app</option>
              <option value="saas">SaaS</option>
              <option value="consulting">Consulting</option>
            </select>
          </label>
          <label>Budget
            <select required name="budget">
              <option value="under-10k">Under $10k</option>
              <option value="10k-25k">$10k – $25k</option>
              <option value="25k-50k">$25k – $50k</option>
              <option value="50k-plus">$50k+</option>
            </select>
          </label>
          <label>Timeline
            <select required name="timeline">
              <option value="asap">ASAP</option>
              <option value="1-3-months">1–3 months</option>
              <option value="3-6-months">3–6 months</option>
              <option value="flexible">Flexible</option>
            </select>
          </label>
          <label>Details<textarea required name="details" rows="3"></textarea></label>
          <button type="submit" class="btn-gradient">Submit inquiry</button>
        </form>
      <?php endif; ?>
    </div>
  </div>
</section>
