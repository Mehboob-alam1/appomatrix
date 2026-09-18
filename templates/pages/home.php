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
$heroFeatures = [
    ['t' => 'Ship faster', 'd' => 'Roadmaps you can actually follow'],
    ['t' => 'Build for reality', 'd' => 'Low bandwidth & offline-ready when needed'],
    ['t' => 'Talk to builders', 'd' => 'No handoffs—meet the people writing code'],
];
$whyUs = [
    ['title' => 'Remote-first, timezone-friendly', 'body' => 'We align with US, EU, and MENA teams without big-city agency overhead.'],
    ['title' => 'Product + engineering in one squad', 'body' => 'You talk directly to the people designing and shipping your product.'],
    ['title' => 'Optimized for real networks', 'body' => 'Performance and offline patterns that help users everywhere.'],
];
$brand = trim($settings['site_name'] ?? '') ?: $siteName;
?>
<section class="hero hero--home">
  <div class="hero-blob hero-blob-a" aria-hidden="true"></div>
  <div class="hero-blob hero-blob-b" aria-hidden="true"></div>
  <div class="hero-blob hero-blob-c" aria-hidden="true"></div>
  <div class="container hero-grid">
    <div class="reveal">
      <span class="pill">Gilgit-Baltistan → Global clients</span>
      <h1 class="hero-title font-display">Software that wins <span class="gradient-text">trust & revenue</span></h1>
      <p class="lead"><?= e($brand) ?> partners with founders and enterprises to design, build, and ship web, mobile, and SaaS—with clear communication every step.</p>
      <div class="btn-row">
        <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient">Book a Free Consultation</a>
        <a href="<?= e(site_url('/work')) ?>" class="btn-secondary">View Our Work</a>
      </div>
    </div>
    <div class="glass-panel card-pad-lg card-interactive reveal">
      <p class="card-meta card-meta--accent">Why teams choose us</p>
      <ul class="feature-list">
        <?php foreach ($heroFeatures as $item): ?>
          <li class="feature-item">
            <span class="feature-dot" aria-hidden="true"></span>
            <div>
              <p class="feature-title"><?= e($item['t']) ?></p>
              <p class="feature-desc"><?= e($item['d']) ?></p>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </div>
</section>

<section class="section section--trust" aria-label="Trust indicators">
  <div class="container grid grid-4">
    <?php foreach ([['120+','Projects'],['8+','Years'],['15+','Countries'],['94%','Retention']] as $i => [$v, $l]): ?>
      <div class="stat-card card card-hover reveal stat-card--<?= $i ?>">
        <p class="stat-value font-display"><?= e($v) ?></p>
        <p class="stat-label"><?= e($l) ?></p>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <div class="section-head-text">
        <span class="pill">What we do</span>
        <h2 class="font-display"><span class="gradient-text">Services built for growth</span></h2>
        <p class="section-desc">Web, mobile, SaaS, and transformation—one squad from idea to launch.</p>
      </div>
    </div>
    <div class="grid grid-sm-2 grid-lg-4">
      <?php foreach ($services as $s): ?>
        <?php
          $iconKey = $s['icon'] ?? 'globe';
          $iconChar = $serviceIcons[$iconKey] ?? $serviceIcons['globe'];
          $iconCls = $serviceIconClass[$iconKey] ?? $serviceIconClass['globe'];
        ?>
        <a href="<?= e(site_url('/services/' . $s['slug'])) ?>" class="card card-hover card-pad service-card reveal">
          <span class="service-icon <?= e($iconCls) ?>" aria-hidden="true"><?= e($iconChar) ?></span>
          <h3 class="card-title font-display"><?= e($s['title']) ?></h3>
          <p class="card-text card-text--grow"><?= e($s['short_description']) ?></p>
          <span class="card-link">Learn more <span aria-hidden="true">→</span></span>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="section-head reveal">
      <div class="section-head-text">
        <span class="pill">Portfolio</span>
        <h2 class="font-display">Featured work</h2>
        <p class="section-desc">Real outcomes across logistics, tourism, and health.</p>
      </div>
      <a href="<?= e(site_url('/work')) ?>" class="btn-secondary">All case studies</a>
    </div>
    <div class="grid grid-md-3">
      <?php foreach (array_slice($projects, 0, 3) as $p): ?>
        <a href="<?= e(site_url('/work/' . $p['slug'])) ?>" class="card card-hover project-card reveal">
          <?php if ($img = image_url($p['cover_image'])): ?>
            <div class="project-card-media">
              <img src="<?= e($img) ?>" alt="<?= e($p['title']) ?>" class="media-16-10" loading="lazy">
            </div>
          <?php endif; ?>
          <div class="card-pad">
            <p class="card-meta"><?= e($p['category']) ?></p>
            <h3 class="card-title font-display"><?= e($p['title']) ?></h3>
            <p class="card-text"><?= e($p['excerpt'] ?? '') ?></p>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section">
  <div class="container split-2 split-2--loose">
    <div class="reveal">
      <span class="pill">Why us</span>
      <h2 class="font-display section-title">Rooted in the mountains. Built for the world.</h2>
      <ul class="why-list">
        <?php foreach ($whyUs as $item): ?>
          <li class="why-item card card-pad-sm">
            <p class="why-item-title"><?= e($item['title']) ?></p>
            <p class="why-item-body"><?= e($item['body']) ?></p>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
    <?php if (!empty($testimonials)): ?>
      <div class="testimonial-panel card-pad-lg reveal" id="testimonials-home">
        <h3 class="font-display testimonial-heading">Client love</h3>
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
      </div>
    <?php endif; ?>
  </div>
</section>

<?php if (!empty($posts)): ?>
<section class="section section--alt">
  <div class="container">
    <div class="section-head reveal">
      <div class="section-head-text">
        <span class="pill">Blog</span>
        <h2 class="font-display">Ideas worth sharing</h2>
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

<section class="section section--cta">
  <div class="container split-2 split-2--loose">
    <div class="reveal">
      <span class="pill">Get started</span>
      <h2 class="font-display section-title">Start your project in minutes</h2>
      <p class="section-desc">Tell us about your goals—we reply within one business day with clear next steps.</p>
    </div>
    <div class="glass-panel card-pad-lg card-interactive reveal">
      <?php $formSource = 'home-final-cta'; require __DIR__ . '/../partials/inquiry-form.php'; ?>
    </div>
  </div>
</section>
