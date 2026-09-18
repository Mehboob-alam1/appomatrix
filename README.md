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

## Site not opening (ERR_CONNECTION_TIMED_OUT)

The app can be deployed while the **domain still fails to connect**. That is almost always **Hostinger DNS / CDN**, not PHP code.

1. **hPanel → Websites → Manage** — status must be **Active** (not suspended).
2. **Domains → DNS zone** — use only the records hPanel shows for this website:
   - **A** `@` → hosting IP from the site dashboard (avoid extra/old A records).
   - **CNAME** `www` → Hostinger target (e.g. `www.appomatrix.com.cdn.hstgr.net`) *or* **A** `www` → same IP as `@`.
3. **SSL** — issue certificate for both `appomatrix.com` and `www.appomatrix.com`.
4. If timeouts continue, try **disabling CDN** temporarily (Hostinger → Performance / CDN), wait 15 minutes, test again.
5. On your PC: flush DNS, try **mobile data** or DNS `1.1.1.1` / `8.8.8.8`.

Canonical URL: **https://www.appomatrix.com** (`.htaccess` redirects bare domain when the server is reachable).
