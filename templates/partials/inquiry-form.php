<form method="post" action="<?= e(site_url('/contact')) ?>" class="form-stack">
  <input type="hidden" name="_contact" value="1">
  <?php if (!empty($formSource)): ?>
    <input type="hidden" name="source" value="<?= e($formSource) ?>">
  <?php endif; ?>
  <label>Name<input required name="name" autocomplete="name"></label>
  <label>Email<input required type="email" name="email" autocomplete="email"></label>
  <label>Phone (optional)<input name="phone" autocomplete="tel"></label>
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
  <label>Details<textarea required name="details" rows="3" placeholder="Goals, users, timeline…"></textarea></label>
  <button type="submit" class="btn-gradient">Submit inquiry</button>
</form>
