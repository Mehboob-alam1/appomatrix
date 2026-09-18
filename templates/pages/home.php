<?php
$serviceIcons = [
    'globe' => '◎',
    'smartphone' => '▢',
    'layers' => '≡',
    'compass' => '✦',
];
$serviceIconClass = [
    'globe' => 'service-icon--a',
    'smartphone' => 'service-icon--b',
    'layers' => 'service-icon--c',
    'compass' => 'service-icon--d',
];
$processSteps = [
    ['title' => 'Discover', 'body' => 'Problem, users, and constraints'],
    ['title' => 'Design', 'body' => 'Options, scope, and trade-offs'],
    ['title' => 'Deliver', 'body' => 'Milestones you can track'],
    ['title' => 'Operate', 'body' => 'Handover, access, and support'],
];
$industries = [
    ['title' => 'Travel & tourism', 'body' => 'Booking flows, maps, offline-ready UX, local payments'],
    ['title' => 'Logistics & ops', 'body' => 'Dashboards, tracking, integrations, field tools'],
    ['title' => 'Health & services', 'body' => 'Patient-facing apps, privacy-aware workflows, content'],
    ['title' => 'SaaS & commerce', 'body' => 'Subscriptions, admin panels, analytics, growth loops'],
];
$whyUs = [
    ['title' => 'Remote-first, timezone-friendly', 'body' => 'We align with US, EU, and MENA teams without big-city agency overhead.'],
    ['title' => 'Product + engineering in one squad', 'body' => 'You talk directly to the people designing and shipping your product.'],
    ['title' => 'Built for real networks', 'body' => 'Performance patterns that work when bandwidth is limited.'],
];
$brand = trim($settings['site_name'] ?? '') ?: $siteName;
?>
<section class="hero hero--home hero--enterprise">
  <div class="hero-blob hero-blob-a" aria-hidden="true"></div>
  <div class="hero-blob hero-blob-b" aria-hidden="true"></div>
  <div class="container">
    <div class="hero-enterprise reveal">
      <p class="section-kicker">Software delivery</p>
      <h1 class="hero-title font-display">Build, modernize, and ship <span class="gradient-text">digital products</span></h1>
      <p class="lead hero-lead-wide"><?= e($brand) ?> helps founders and teams across web, mobile, and SaaS—from discovery through launch. Scope, timeline, and ownership are agreed before build starts.</p>
      <div class="btn-row">
        <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient">Plan a project</a>
        <a href="<?= e(site_url('/work')) ?>" class="btn-secondary">Review our work</a>
      </div>
    </div>
    <ol class="process-strip reveal" aria-label="How we work">
      <?php foreach ($processSteps as $i => $step): ?>
        <li class="process-step">
          <span class="process-step-num"><?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?></span>
          <div>
            <p class="process-step-title"><?= e($step['title']) ?></p>
            <p class="process-step-body"><?= e($step['body']) ?></p>
          </div>
        </li>
      <?php endforeach; ?>
    </ol>
  </div>
</section>

<section class="trust-band" aria-label="Track record">
  <div class="container trust-band-inner reveal">
    <p class="section-kicker section-kicker--on-dark">Delivery track record</p>
    <div class="grid grid-4 trust-stats">
      <?php foreach ([['120+','Projects delivered'],['8+','Years shipping'],['15+','Countries served'],['94%','Client retention']] as [$v, $l]): ?>
        <div class="trust-stat">
          <p class="stat-value font-display"><?= e($v) ?></p>
          <p class="stat-label"><?= e($l) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <div class="section-head-text">
        <p class="section-kicker">Possible delivery areas</p>
        <h2 class="font-display section-title">Choose the problem, then shape the solution</h2>
        <p class="section-desc">Each engagement can be discovery-only, a defined build, or ongoing delivery. Final scope follows a technical review.</p>
      </div>
      <a href="<?= e(site_url('/services')) ?>" class="btn-secondary">All services</a>
    </div>
    <div class="grid grid-sm-2">
      <?php foreach ($services as $s): ?>
        <?php
          $iconKey = $s['icon'] ?? 'globe';
          $iconChar = $serviceIcons[$iconKey] ?? $serviceIcons['globe'];
          $iconCls = $serviceIconClass[$iconKey] ?? $serviceIconClass['globe'];
        ?>
        <a href="<?= e(site_url('/services/' . $s['slug'])) ?>" class="card card-hover enterprise-service reveal">
          <span class="service-icon <?= e($iconCls) ?>" aria-hidden="true"><?= e($iconChar) ?></span>
          <div class="enterprise-service-body">
            <h3 class="card-title font-display"><?= e($s['title']) ?></h3>
            <p class="card-text card-text--grow"><?= e($s['short_description']) ?></p>
            <span class="card-link">Explore this service <span aria-hidden="true">→</span></span>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="section-head reveal">
      <div class="section-head-text">
        <p class="section-kicker">Public portfolio</p>
        <h2 class="font-display section-title">Selected products and projects</h2>
        <p class="section-desc">Case studies across tourism, logistics, and health—open any record for outcomes and context.</p>
      </div>
      <a href="<?= e(site_url('/work')) ?>" class="btn-secondary">Complete portfolio</a>
    </div>
    <div class="grid grid-md-3">
      <?php foreach (array_slice($projects, 0, 6) as $p): ?>
        <?php $initial = mb_strtoupper(mb_substr($p['title'], 0, 1)); ?>
        <a href="<?= e(site_url('/work/' . $p['slug'])) ?>" class="card card-hover project-card project-card--enterprise reveal">
          <?php if ($img = image_url($p['cover_image'])): ?>
            <div class="project-card-media">
              <img src="<?= e($img) ?>" alt="<?= e($p['title']) ?>" class="media-16-10" loading="lazy">
            </div>
          <?php else: ?>
            <div class="project-card-fallback" aria-hidden="true"><?= e($initial) ?></div>
          <?php endif; ?>
          <div class="card-pad">
            <p class="card-meta"><?= e($p['category']) ?></p>
            <h3 class="card-title font-display"><?= e($p['title']) ?></h3>
            <p class="card-text"><?= e($p['excerpt'] ?? '') ?></p>
            <span class="card-link">View record <span aria-hidden="true">→</span></span>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <div class="section-head-text">
        <p class="section-kicker">Context first</p>
        <h2 class="font-display section-title">Different industries need different controls</h2>
        <p class="section-desc">Privacy, performance, audit, and operational requirements vary by sector—we assess fit during discovery.</p>
      </div>
      <a href="<?= e(site_url('/contact')) ?>" class="btn-secondary">Describe your constraints</a>
    </div>
    <div class="grid grid-sm-2">
      <?php foreach ($industries as $item): ?>
        <article class="card card-pad industry-card reveal">
          <h3 class="card-title font-display"><?= e($item['title']) ?></h3>
          <p class="card-text card-text--grow" style="-webkit-line-clamp:unset"><?= e($item['body']) ?></p>
        </article>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container split-2 split-2--loose">
    <div class="reveal">
      <p class="section-kicker">Why teams choose us</p>
      <h2 class="font-display section-title">Rooted in Gilgit-Baltistan. Built for global clients.</h2>
      <ul class="why-list">
        <?php foreach ($whyUs as $item): ?>
          <li class="why-item card card-pad-sm">
            <p class="why-item-title"><?= e($item['title']) ?></p>
            <p class="why-item-body"><?= e($item['body']) ?></p>
          </li>
        <?php endforeach; ?>
      </ul>
      <p style="margin-top:var(--space-4)"><a href="<?= e(site_url('/about')) ?>" class="card-link">About <?= e($brand) ?> →</a></p>
    </div>
    <?php if (!empty($testimonials)): ?>
      <div class="testimonial-panel card-pad-lg reveal" id="testimonials-home">
        <p class="section-kicker">Client feedback</p>
        <h3 class="font-display testimonial-heading">What partners say</h3>
        <div class="testimonial-viewport">
          <?php foreach ($testimonials as $i => $t): ?>
            <blockquote class="testimonial-slide<?= $i === 0 ? ' is-active' : '' ?>" data-index="<?= (int) $i ?>">
              <p class="quote-mark">“</p>
              <p class="quote-body"><?= e($t['quote']) ?></p>
              <footer class="quote-foot">
                <p class="card-title" style="font-size:0.9rem"><?= e($t['client_name']) ?></p>
                <p class="card-meta" style="margin-top:0.15rem"><?= e($t['role']) ?><?= ($t['company'] ?? '') !== '' ? ', ' . e($t['company']) : '' ?></p>
              </footer>
            </blockquote>
          <?php endforeach; ?>
        </div>
        <?php if (count($testimonials) > 1): ?>
          <div class="testimonial-dots" role="tablist" aria-label="Testimonials">
            <?php foreach ($testimonials as $i => $t): ?>
              <button type="button" class="testimonial-dot<?= $i === 0 ? ' is-active' : '' ?>" data-slide="<?= (int) $i ?>" aria-label="Testimonial <?= (int) $i + 1 ?>"></button>
            <?php endforeach; ?>
          </div>
        <?php endif; ?>
        <p style="margin-top:var(--space-3)"><a href="<?= e(site_url('/testimonials')) ?>" class="card-link">All testimonials →</a></p>
      </div>
    <?php endif; ?>
  </div>
</section>

<?php if (!empty($posts)): ?>
<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <div class="section-head-text">
        <p class="section-kicker">Insights</p>
        <h2 class="font-display section-title">Ideas worth sharing</h2>
      </div>
      <a href="<?= e(site_url('/blog')) ?>" class="btn-secondary">All posts</a>
    </div>
    <div class="grid grid-md-3">
      <?php foreach (array_slice($posts, 0, 3) as $post): ?>
        <a href="<?= e(site_url('/blog/' . $post['slug'])) ?>" class="card card-hover project-card reveal">
          <?php if ($img = image_url($post['featured_image'])): ?>
            <div class="project-card-media">
              <img src="<?= e($img) ?>" alt="" class="media-16-10" loading="lazy">
            </div>
          <?php endif; ?>
          <div class="card-pad">
            <p class="card-meta card-meta--accent"><?= e($post['category']) ?></p>
            <h3 class="card-title font-display"><?= e($post['title']) ?></h3>
            <p class="card-text"><?= e($post['excerpt']) ?></p>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<section class="section section--cta-band">
  <div class="container reveal">
    <p class="section-kicker section-kicker--on-dark">Get started</p>
    <h2 class="font-display section-title section-title--light">Turn an idea into a reviewable plan</h2>
    <p class="section-desc section-desc--light">Share your goals, integrations, timeline, and budget. We reply within one business day with clear next steps—nothing is approved until you confirm scope.</p>
    <div class="btn-row" style="margin-top:var(--space-4)">
      <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient btn-gradient--light">Start detailed inquiry</a>
      <a href="mailto:<?= e($contact['email']) ?>" class="btn-secondary btn-secondary--light">Email the team</a>
    </div>
  </div>
</section>

<section class="section section--cta">
  <div class="container split-2 split-2--loose">
    <div class="reveal">
      <p class="section-kicker">Project inquiry</p>
      <h2 class="font-display section-title">Tell us what you are building</h2>
      <p class="section-desc">Prefer a form? Submit below—we route it to the delivery team.</p>
    </div>
    <div class="glass-panel card-pad-lg reveal">
      <?php $formSource = 'home-final-cta'; require __DIR__ . '/../partials/inquiry-form.php'; ?>
    </div>
  </div>
</section>
