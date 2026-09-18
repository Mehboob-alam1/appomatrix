# Appo Matrix — PHP (Hostinger shared hosting)

This repo includes a **PHP version** of the site for Apache shared hosting (fixes 403 when Node.js is not available).

## Requirements

- PHP **8.1+** with **PDO SQLite**
- Apache `mod_rewrite` enabled (`.htaccess` included)

## Setup on Hostinger

1. **Deploy from Git** (or upload files) so the repo root is your site root (`public_html`).
2. Copy configuration:
   ```bash
   cp config.example.php config.local.php
   ```
   Edit `config.local.php`:
   - `admin_password` — strong password for `/admin`
   - `site_url` — `https://appomatrix.com`
3. Ensure folders are writable:
   - `data/` — SQLite database (auto-created)
   - `public/uploads/` — optional uploads
4. Visit `https://yourdomain.com/` — first load runs migrations + seed content.
5. Admin: `https://yourdomain.com/admin/login`

You can also use an existing `.env` file (reads `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, etc.).

## URLs

| Path | Purpose |
|------|---------|
| `/` | Home |
| `/admin` | Content admin |
| `/contact` | Contact form + Calendly |

## Next.js version

The `src/` folder is the original Next.js app (for VPS/Vercel). On Hostinger **shared hosting**, only the **PHP** entry (`index.php`) is used.

## Security

- `data/` and `lib/` are blocked by `.htaccess`
- Never commit `config.local.php` or `.env` with real passwords
