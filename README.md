# Appo Matrix — Marketing Website

Lead-generation marketing site for **Appo Matrix**, a software development agency in Gilgit-Baltistan, Pakistan.

## Stack

- Next.js (App Router), TypeScript, Tailwind CSS
- **Custom admin** at `/admin` (no Sanity or third-party CMS)
- **SQLite** database at `data/cms.sqlite` (local, on your server)
- Framer Motion, Embla Carousel
- Optional Resend for email notifications
- Deploy-ready on Vercel (see hosting note below)

## Getting started

```bash
npm install
cp env.example .env.local
```

Set admin credentials in `.env.local`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=at-least-16-random-characters
```

```bash
npm run dev
```

- **Site:** http://localhost:3000  
- **Admin:** http://localhost:3000/admin  

On first run, the database is created and seeded with sample content.

## Custom admin

Manage from `/admin`:

- Case studies (projects)
- Blog posts
- Services
- Testimonials
- Team
- Form submissions (contact & newsletter)

Images: use full URLs or upload via `POST /api/admin/upload` while logged in (files go to `public/uploads/`).

## Hosting note

SQLite and uploaded files need a **persistent disk**. That works on a VPS, Docker, or similar. **Vercel serverless** has an ephemeral filesystem—use a VPS/Node host for this “no external CMS” setup, or we can add Postgres later if you deploy on Vercel.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint

## Optional env

See `env.example` for Resend, Calendly, and analytics variables.
