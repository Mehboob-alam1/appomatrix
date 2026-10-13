# HTTP API

All JSON responses use this shape:

```json
{ "ok": true, "data": {} }
{ "ok": false, "error": "What went wrong." }
```

Public routes return published records only. They never return password hashes, unpublished drafts, or contact inquiries.

Write requests from the browser send the `am_csrf` cookie value in the `x-csrf-token` header. The cookie is not httpOnly so the admin UI can copy it into that header. The session cookie `am_session` is httpOnly.

Login is limited to 8 attempts per 15 minutes per IP. The contact form is limited to 5 submissions per 10 minutes per IP.

## Public

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/health` | `{ database: "up" }` or 503. No credentials. |
| GET | `/api/settings` | Public site settings. |
| GET | `/api/services` | Published service tree. |
| GET | `/api/services/:slug` | One published service. |
| GET | `/api/projects` | Published portfolio projects. `portfolio` is an alias. |
| GET | `/api/projects/:slug` | One published project, including its gallery. |
| GET | `/api/posts` | Published posts. `?category=` filters by category slug or name. `blog` is an alias. |
| GET | `/api/posts/:slug` | One published post. |
| GET | `/api/categories` | Published blog categories. |
| GET | `/api/categories/:slug` | One category. |
| GET | `/api/team` | Published team members. |
| GET | `/api/testimonials` | Published quotes. |
| GET | `/api/careers` | Published roles and programs. |
| GET | `/api/careers/:slug` | One career. |
| GET | `/api/scholarships` | Published scholarships. |
| GET | `/api/scholarships/:slug` | One scholarship. |
| GET | `/api/navigation` | Published header, footer, and header-button links. |
| GET | `/api/social` | Published social links. |
| GET | `/api/sections` | Published homepage sections. |
| GET | `/api/sections/:key` | One section, such as `closing`. |
| GET | `/api/pages` | Published page headings, introductions, images, and SEO titles. |
| POST | `/api/contact` | Create an inquiry. 201, 400, 403, or 429. |

Contact JSON:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "phone": "",
  "company": "",
  "topic": "General inquiry",
  "budget": "Not sure yet",
  "message": "We need a booking site.",
  "website": ""
}
```

`website` is a honeypot. If it is filled, the API returns success and stores nothing. `name`, `email`, and `message` are required.

## Authentication

| Method | Path | Auth | Notes |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | CSRF | Body `{ "username", "password" }`. Sets the session cookie. |
| POST | `/api/auth/logout` | CSRF | Clears the session cookie. |
| GET | `/api/auth/me` | Session | `{ username }` or 401. |

## Admin

These routes require the session cookie. Mutations also require `x-csrf-token`.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/admin/settings` | Full settings object. |
| PUT | `/api/admin/settings` | Replace provided settings fields. |
| GET | `/api/admin/content/:section` | Every record, including drafts. |
| POST | `/api/admin/content/:section` | Create. 201. |
| GET | `/api/admin/content/:section/:id` | One record, including drafts. |
| PATCH | `/api/admin/content/:section/:id` | Update. A body of `{ "published": false }` only changes visibility. |
| DELETE | `/api/admin/content/:section/:id` | Delete. |
| POST | `/api/admin/content/:section/reorder` | Body `{ "id", "direction": "up" \| "down" }`. |
| GET | `/api/admin/inquiries` | Private inquiry list. |
| PATCH | `/api/admin/inquiries/:id` | Body `{ "status": "new" \| "reviewed" \| "replied" \| "archived" }`. |
| DELETE | `/api/admin/inquiries/:id` | Delete an inquiry. |
| POST | `/api/admin/upload` | Multipart field `file`. JPG, PNG, WEBP, or GIF, max 5 MB. |
| DELETE | `/api/admin/upload` | Body `{ "url": "/uploads/..." }`. Removes the file and clears references. |
| GET | `/api/admin/media` | Media library. |
| PATCH | `/api/admin/media/:id` | Body `{ "alt": "..." }`. |
| DELETE | `/api/admin/media/:id` | Delete a library file and clear references. |

`:section` is one of `services`, `portfolio`, `blog`, `categories`, `team`, `testimonials`, `careers`, `scholarships`, `navigation`, `social`, `sections`, `pages`.

Create and update bodies use the same field names as the admin forms (`title`, `shortDescription`, `published`, `sortOrder`, `gallery`, and so on). `published` is a boolean. `gallery` is an array of `{ url, alt, caption }`. Omitted fields on PATCH keep their current values, except a lone `published` flag.

The public site and the admin studio call these same MySQL services. Server-rendered pages use the shared query module directly so they do not depend on a second copy of the data.
