<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Admin login · Appo Matrix</title>
  <link rel="stylesheet" href="<?= e(asset('admin.css')) ?>">
</head>
<body class="admin-body admin-login">
  <form method="post" class="admin-login-card">
    <h1>Appo Matrix Admin</h1>
    <p class="admin-lead">Sign in to manage content, contact info, and site settings.</p>
    <?php if (!empty($error)): ?>
      <p class="admin-alert admin-alert--error" style="margin-top:1rem"><?= e($error) ?></p>
    <?php endif; ?>
    <label class="admin-field" style="margin-top:1.25rem">Username
      <input name="username" required autocomplete="username" class="admin-input">
    </label>
    <label class="admin-field">Password
      <input name="password" type="password" required autocomplete="current-password" class="admin-input">
    </label>
    <button type="submit" class="admin-btn admin-btn--primary" style="width:100%;margin-top:0.5rem">Sign in</button>
    <p class="admin-hint">Set <code>admin_password</code> in <code>config.local.php</code> or <code>ADMIN_PASSWORD</code> in <code>.env</code> on the server.</p>
  </form>
</body>
</html>
