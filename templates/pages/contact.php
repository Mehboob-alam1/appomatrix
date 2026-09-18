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
        <div class="glass-panel card-pad">
          <?php require __DIR__ . '/../partials/inquiry-form.php'; ?>
        </div>
      <?php endif; ?>
    </div>
  </div>
</section>
