<section class="hero">
  <div class="hero-blob hero-blob-a" aria-hidden="true"></div>
  <div class="hero-blob hero-blob-b" aria-hidden="true"></div>
  <div class="container hero-grid">
    <div class="reveal">
      <span class="pill">Gilgit-Baltistan → Global</span>
      <h1 class="hero-title">Software that wins <span class="gradient-text">trust & revenue</span></h1>
      <p class="lead">We design, build, and ship web, mobile, and SaaS—with clear communication every step.</p>
      <div class="btn-row">
        <a href="<?= e(site_url('/contact')) ?>" class="btn-gradient">Book a Free Consultation</a>
        <a href="<?= e(site_url('/work')) ?>" class="btn-secondary">View Our Work</a>
      </div>
    </div>
    <div class="glass-panel card-pad reveal">
      <p class="card-meta card-meta--accent">Why teams choose us</p>
      <ul class="bullet-list">
        <li class="card card-pad-sm">Ship faster — roadmaps you can follow</li>
        <li class="card card-pad-sm">Build for reality — low bandwidth when needed</li>
        <li class="card card-pad-sm">Talk to builders — meet the people writing code</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--flush-top">
  <div class="container grid grid-4">
    <?php foreach ([['120+','Projects'],['8+','Years'],['15+','Countries'],['94%','Retention']] as [$v,$l]): ?>
      <div class="stat-card card card-hover reveal">
        <p class="stat-value"><?= e($v) ?></p>
        <p class="stat-label"><?= e($l) ?></p>
      </div>
    <?php endforeach; ?>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <span class="pill">What we do</span>
        <h2><span class="gradient-text">Services built for growth</span></h2>
      </div>
    </div>
    <div class="grid grid-sm-2 grid-lg-4">
      <?php foreach ($services as $s): ?>
        <a href="<?= e(site_url('/services/' . $s['slug'])) ?>" class="card card-hover card-pad reveal">
          <h3 class="card-title"><?= e($s['title']) ?></h3>
          <p class="card-text"><?= e($s['short_description']) ?></p>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="container">
    <div class="section-head reveal">
      <div>
        <span class="pill">Portfolio</span>
        <h2>Featured work</h2>
      </div>
      <a href="<?= e(site_url('/work')) ?>" class="btn-secondary">All case studies</a>
    </div>
    <div class="grid grid-md-3">
      <?php foreach (array_slice($projects, 0, 3) as $p): ?>
        <a href="<?= e(site_url('/work/' . $p['slug'])) ?>" class="card card-hover reveal" style="overflow:hidden">
          <?php if ($img = image_url($p['cover_image'])): ?>
            <img src="<?= e($img) ?>" alt="<?= e($p['title']) ?>" class="media-16-10" loading="lazy">
          <?php endif; ?>
          <div class="card-pad">
            <p class="card-meta"><?= e($p['category']) ?></p>
            <h3 class="card-title"><?= e($p['title']) ?></h3>
            <p class="card-text"><?= e($p['excerpt'] ?? '') ?></p>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
