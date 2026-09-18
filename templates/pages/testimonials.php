<section class="border-b py-10 sm:py-16" style="border-color: var(--border)">
  <div class="container">
    <h1 class="text-3xl font-semibold"><span class="gradient-text">Client testimonials</span></h1>
  </div>
</section>
<section class="py-16">
  <div class="container grid gap-6 md:grid-cols-2">
    <?php foreach ($testimonials as $t): ?>
      <blockquote class="card p-6 sm:p-8">
        <p class="text-muted leading-relaxed"><?= e($t['quote']) ?></p>
        <footer class="mt-6 border-t pt-6" style="border-color: var(--border)">
          <p class="font-medium"><?= e($t['client_name']) ?></p>
          <p class="text-sm text-muted"><?= e($t['role']) ?>, <?= e($t['company']) ?></p>
        </footer>
      </blockquote>
    <?php endforeach; ?>
  </div>
</section>
