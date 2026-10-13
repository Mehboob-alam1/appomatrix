# Appo Matrix

Company site for **Appo Matrix**, a software studio in Gilgit-Baltistan. The public site and every piece of content — services, portfolio, blog, team, testimonials, career development, scholarships, and contact details — are edited from an admin studio.

## Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

Put your MySQL settings in `.env`. The database must already exist. On first request the app creates any missing tables and, if the database is empty, loads sample content. It does not drop or overwrite existing rows.

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

## Admin studio

[http://127.0.0.1:3847/admin](http://127.0.0.1:3847/admin)

The first admin user is created only when the users table is empty. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` before that first boot, then change the password in Settings. Set `AUTH_SECRET` in production. Set `NEXT_PUBLIC_SITE_URL` to the public domain so canonical URLs, Open Graph cards, and `sitemap.xml` point at the live site. See `.env.example`.

Hostinger deployment, backups, and uploads: [docs/HOSTINGER.md](docs/HOSTINGER.md).

HTTP API: [docs/API.md](docs/API.md).

## Technical SEO

Each public page has a unique title, description, and canonical URL. `/sitemap.xml` lists published services, portfolio, posts, careers, and scholarships. `/robots.txt` allows the public site and blocks `/admin` and `/api`. Pages include Organization, WebSite, and breadcrumb structured data. Posts, services, and portfolio records add their own schema. The admin studio is `noindex`.

MySQL tables are described in `db/schema.sql`. Uploaded images are stored in `UPLOAD_DIR`, or in `data/uploads` when that variable is empty, and served from `/uploads`.

## What you can edit

| Section | What it changes |
| --- | --- |
| Services | The expandable Services menu, service pages, and homepage groups. Nest a service under a top-level group to show it in the dropdown. |
| Portfolio | Case studies: cover, gallery, problem / solution / result, metrics, and a live-product backlink. |
| Blog | Posts and the homepage notes. |
| Team | Portraits on Team and About. |
| Testimonials | Homepage quotes. |
| Career development | Roles, internships, and programs. |
| Scholarships | Awards, deadlines, and application links. |
| CRM inquiries | Messages from Contact Us, including career and scholarship applications. |
| Blog categories | Names used by posts and the blog filter. |
| Navigation | Header links, the header button, and footer links. |
| Social links | Profiles in the footer. |
| Homepage | Section headings, buttons, and whether a homepage block is published. |
| Pages | Heading, introduction, extra copy, image, and SEO title for each public page. |
| Media | Uploaded images and alt text. |
| Settings | Branding, logo, favicon, contact details, hero and calls to action, stats, SEO defaults, WhatsApp, booking, and the admin password. |

## Pages

Home, Services, Portfolio, Career Development, Scholarships, Blog, Team, About Us, and Contact Us.
