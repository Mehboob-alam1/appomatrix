# Appo Matrix — Marketing Website

Lead-generation site for **Appo Matrix** (Gilgit-Baltistan). PHP + SQLite for Apache shared hosting (e.g. Hostinger).

## Requirements

- PHP **8.1+** with **PDO SQLite**
- Apache `mod_rewrite` (`.htaccess` included)

## Setup

1. Deploy the repo root as your web root (`public_html`).
2. Configure:
   ```bash
   cp config.example.php config.local.php
   ```
   Set `admin_password`, `site_url` (`https://appomatrix.com`), etc.

   Or use `.env` (see `env.example`) for `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, Calendly, etc.

3. Writable directories:
   - `data/` — SQLite (`cms.sqlite`, auto-created on first visit)
   - `uploads/` — logos and media paths from admin

4. Open the site — migrations in `drizzle/*.sql` run automatically; empty DB is seeded with sample content.

5. **Admin CMS:** [https://yourdomain.com/admin/login](https://appomatrix.com/admin/login)  
   - Set `admin_password` in `config.local.php` (or `ADMIN_PASSWORD` in `.env`) before first login.  
   - Manage **settings** (logo, contact, Calendly), **services**, **projects**, **blog**, **testimonials**, **team**, and **form submissions**.

## Local dev

```bash
php -S localhost:8080 index.php
```

Visit http://localhost:8080

## URLs

| Path | Purpose |
|------|---------|
| `/` | Marketing pages |
| `/admin` | Content admin |
| `/contact` | Inquiry form + Calendly |

## Admin

Manage projects, blog posts, services, testimonials, team, form submissions, and site settings (contact info, logo, Calendly, HTML injections).

## Security

- `data/`, `lib/`, `templates/`, and `drizzle/` are blocked by `.htaccess`
- Do not commit `config.local.php` or `.env` with real secrets
