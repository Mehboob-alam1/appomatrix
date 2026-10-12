# Appo Matrix

Company site for **Appo Matrix**, a software studio in Gilgit-Baltistan. The public site and every piece of content — services, portfolio, blog, team, testimonials, career development, scholarships, and contact details — are edited from an admin studio.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

## Admin studio

[http://127.0.0.1:3847/admin](http://127.0.0.1:3847/admin)

Starter login (change it in Settings after you sign in):

- Username: `admin`
- Password: `admin`

Override those with `ADMIN_USERNAME` and `ADMIN_PASSWORD` before the database is created. Set `AUTH_SECRET` in production. Set `NEXT_PUBLIC_SITE_URL` to the public domain so canonical URLs, Open Graph cards, and `sitemap.xml` point at the live site. See `.env.example`.

## Technical SEO

Each public page has a unique title, description, and canonical URL. `/sitemap.xml` lists published services, portfolio, posts, careers, and scholarships. `/robots.txt` allows the public site and blocks `/admin` and `/api`. Pages include Organization, WebSite, and breadcrumb structured data. Posts, services, and portfolio records add their own schema. The admin studio is `noindex`.

The database is created at `data/cms.sqlite` on first launch and seeded with sample services, projects, posts, team, careers, and scholarships. Uploaded images are stored in `public/uploads`.

Delete `data/cms.sqlite` to reseed from scratch.

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
| Settings | Homepage copy, stats, industries, contact details, WhatsApp number, booking link, and the admin password. |

## Pages

Home, Services, Portfolio, Career Development, Scholarships, Blog, Team, About Us, and Contact Us.
