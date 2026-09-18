<?php
/** @var array<string, mixed>|null $item */
/** @var string $entity */
$id = $item['id'] ?? '';
$labels = [
    'posts' => 'Blog post',
    'projects' => 'Project',
    'services' => 'Service',
    'testimonials' => 'Testimonial',
    'team_members' => 'Team member',
];
$label = $labels[$entity] ?? 'Item';
$adminTitle = ($item ? 'Edit' : 'New') . ' ' . $label;
$adminNarrow = true;
require __DIR__ . '/_head.php';
?>

<?php if (!empty($saved)): ?>
  <p class="admin-alert admin-alert--success">Saved.</p>
<?php endif; ?>

<h1 class="admin-h1"><?= $item ? 'Edit' : 'New' ?> <?= e($label) ?></h1>

<form method="post" style="margin-top:1.25rem">
  <input type="hidden" name="entity" value="<?= e($entity) ?>">
  <input type="hidden" name="action" value="save">
  <input type="hidden" name="id" value="<?= e($id) ?>">

  <?php if ($entity === 'posts'): ?>
    <label class="admin-field">Title <input name="title" required value="<?= e($item['title'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Slug <input name="slug" value="<?= e($item['slug'] ?? '') ?>" class="admin-input" placeholder="auto from title if empty"></label>
    <label class="admin-field">Category <input name="category" required value="<?= e($item['category'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Author <input name="author" value="<?= e($item['author'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Excerpt <textarea name="excerpt" rows="2" class="admin-input"><?= e($item['excerpt'] ?? '') ?></textarea></label>
    <label class="admin-field">Content (HTML) <textarea name="content" rows="10" class="admin-input admin-mono"><?= e($item['content'] ?? '') ?></textarea></label>
    <label class="admin-field">Featured image URL <input name="featured_image" value="<?= e($item['featured_image'] ?? '') ?>" class="admin-input" placeholder="/uploads/… or https://…"></label>
  <?php elseif ($entity === 'projects'): ?>
    <label class="admin-field">Title <input name="title" required value="<?= e($item['title'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Slug <input name="slug" value="<?= e($item['slug'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Client <input name="client_name" required value="<?= e($item['client_name'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Category <input name="category" required value="<?= e($item['category'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Excerpt <textarea name="excerpt" rows="2" class="admin-input"><?= e($item['excerpt'] ?? '') ?></textarea></label>
    <label class="admin-field">Cover image URL <input name="cover_image" value="<?= e($item['cover_image'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Problem (HTML) <textarea name="problem" rows="4" class="admin-input"><?= e($item['problem'] ?? '') ?></textarea></label>
    <label class="admin-field">Solution (HTML) <textarea name="solution" rows="4" class="admin-input"><?= e($item['solution'] ?? '') ?></textarea></label>
    <label class="admin-field">Result (HTML) <textarea name="result" rows="4" class="admin-input"><?= e($item['result'] ?? '') ?></textarea></label>
    <label class="admin-field"><input type="checkbox" name="featured" value="1" <?= !empty($item['featured']) ? 'checked' : '' ?>> Show on homepage (featured)</label>
  <?php elseif ($entity === 'services'): ?>
    <label class="admin-field">Title <input name="title" required value="<?= e($item['title'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Slug <input name="slug" value="<?= e($item['slug'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Icon key
      <select name="icon" class="admin-input">
        <?php foreach (['globe', 'smartphone', 'layers', 'compass'] as $icon): ?>
          <option value="<?= e($icon) ?>"<?= ($item['icon'] ?? 'globe') === $icon ? ' selected' : '' ?>><?= e($icon) ?></option>
        <?php endforeach; ?>
      </select>
    </label>
    <label class="admin-field">Short description <textarea name="short_description" required rows="2" class="admin-input"><?= e($item['short_description'] ?? '') ?></textarea></label>
    <label class="admin-field">Full description (HTML) <textarea name="full_description" rows="8" class="admin-input"><?= e($item['full_description'] ?? '') ?></textarea></label>
  <?php elseif ($entity === 'testimonials'): ?>
    <label class="admin-field">Client name <input name="client_name" required value="<?= e($item['client_name'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Role <input name="role" required value="<?= e($item['role'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Company <input name="company" required value="<?= e($item['company'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Quote <textarea name="quote" required rows="4" class="admin-input"><?= e($item['quote'] ?? '') ?></textarea></label>
    <label class="admin-field">Rating (1–5) <input name="rating" type="number" min="1" max="5" value="<?= e((string) ($item['rating'] ?? 5)) ?>" class="admin-input"></label>
  <?php elseif ($entity === 'team_members'): ?>
    <label class="admin-field">Name <input name="name" required value="<?= e($item['name'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Role <input name="role" required value="<?= e($item['role'] ?? '') ?>" class="admin-input"></label>
    <label class="admin-field">Bio <textarea name="bio" rows="4" class="admin-input"><?= e($item['bio'] ?? '') ?></textarea></label>
  <?php endif; ?>

  <button type="submit" class="admin-btn admin-btn--primary">Save</button>
</form>

<?php if ($item): ?>
  <form method="post" style="margin-top:1rem" onsubmit="return confirm('Delete this item?')">
    <input type="hidden" name="entity" value="<?= e($entity) ?>">
    <input type="hidden" name="action" value="delete">
    <input type="hidden" name="id" value="<?= e($id) ?>">
    <button type="submit" class="admin-btn admin-btn--danger">Delete</button>
  </form>
<?php endif; ?>

<?php require __DIR__ . '/_foot.php'; ?>
