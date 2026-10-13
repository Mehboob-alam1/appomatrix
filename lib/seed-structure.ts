import { fillPageCopy } from "@/lib/page-copy";

export type SqlExec = (sql: string, params?: unknown[]) => Promise<unknown>;

const categories = [
  ["cat-product", "product", "Product", "Product and delivery notes.", 1],
  ["cat-engineering", "engineering", "Engineering", "Engineering notes from client work.", 2],
  ["cat-process", "process", "Process", "How the studio scopes and ships.", 3],
  ["cat-studio", "studio", "Studio", "Hiring, careers, and studio life.", 4],
  ["cat-notes", "notes", "Notes", "General notes.", 5],
];

const navigation = [
  ["nav-home", "header", "Home", "/", 1],
  ["nav-portfolio", "header", "Portfolio", "/portfolio", 2],
  ["nav-careers", "header", "Career Development", "/career-development", 3],
  ["nav-scholarships", "header", "Scholarships", "/scholarships", 4],
  ["nav-blog", "header", "Blog", "/blog", 5],
  ["nav-team", "header", "Team", "/team", 6],
  ["nav-about", "header", "About Us", "/about", 7],
  ["nav-cta", "header_cta", "Contact Us", "/contact", 1],
  ["foot-about", "footer", "About Us", "/about", 1],
  ["foot-team", "footer", "Team", "/team", 2],
  ["foot-portfolio", "footer", "Portfolio", "/portfolio", 3],
  ["foot-blog", "footer", "Blog", "/blog", 4],
  ["foot-careers", "footer", "Career Development", "/career-development", 5],
  ["foot-scholarships", "footer", "Scholarships", "/scholarships", 6],
  ["foot-contact", "footer", "Contact Us", "/contact", 7],
];

const sections = [
  ["sec-services", "services", "Services", "What we actually ship", "", "", "", "", "", 1],
  ["sec-portfolio", "portfolio", "Portfolio", "Selected products", "", "", "", "", "", 2],
  ["sec-industries", "industries", "Industries", "Different controls for different work", "", "", "", "", "", 3],
  ["sec-about", "about", "About", "", "", "", "", "About Us", "/about", 4],
  ["sec-clients", "clients", "Clients", "", "", "", "", "", "", 5],
  ["sec-careers", "careers", "Career Development", "", "", "", "", "", "", 6],
  ["sec-scholarships", "scholarships", "Scholarships", "", "", "", "", "", "", 7],
  ["sec-notes", "notes", "", "Notes", "", "", "", "All posts", "/blog", 8],
  ["sec-closing", "closing", "", "Start with a written brief.", "", "", "", "Contact Us", "/contact", 9],
];

async function insert(db: SqlExec, sql: string, params: unknown[]) {
  await db(sql, params);
}

export async function seedStructure(db: SqlExec) {
  for (const row of categories) {
    await insert(
      db,
      `INSERT IGNORE INTO post_categories (id, slug, name, description, sort_order, published)
       VALUES (?, ?, ?, ?, ?, 1)`,
      row,
    );
  }
  for (const row of navigation) {
    await insert(
      db,
      `INSERT IGNORE INTO nav_items (id, location, label, href, sort_order, published)
       VALUES (?, ?, ?, ?, ?, 1)`,
      row,
    );
  }
  await insert(
    db,
    `INSERT IGNORE INTO social_links (id, label, url, sort_order, published)
     VALUES ('soc-linkedin', 'LinkedIn', 'https://www.linkedin.com/company/appomatrix', 1, 1)`,
    [],
  );
  for (const row of sections) {
    await insert(
      db,
      `INSERT IGNORE INTO homepage_sections (
        id, section_key, kicker, title, body, image, image_alt, cta_label, cta_href, sort_order, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      row,
    );
  }
  await fillPageCopy(db);
}
