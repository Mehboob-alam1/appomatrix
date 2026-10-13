import type { PageMeta } from "@/lib/types";

type SqlExec = (sql: string, params?: unknown[]) => Promise<unknown>;

export type PageSeed = {
  id: string;
  path: string;
  title: string;
  description: string;
  kicker: string;
  heading: string;
  lead: string;
  body: string;
  secondaryTitle: string;
  sortOrder: number;
};

export const PAGE_SEEDS: PageSeed[] = [
  {
    id: "page-home",
    path: "/",
    title: "Software studio in Gilgit-Baltistan",
    description:
      "Appo Matrix designs and ships web, mobile, and SaaS products from Gilgit-Baltistan for teams worldwide. See the work, services, careers, and scholarships.",
    kicker: "",
    heading: "",
    lead: "",
    body: "",
    secondaryTitle: "",
    sortOrder: 1,
  },
  {
    id: "page-services",
    path: "/services",
    title: "Services",
    description: "Web, mobile, SaaS, design, cloud, and applied AI from Appo Matrix in Gilgit-Baltistan.",
    kicker: "Services",
    heading: "Everything required to ship",
    lead: "Open a practice, or go straight to the service. Each one can stand alone or sit inside a longer squad.",
    body: "",
    secondaryTitle: "",
    sortOrder: 2,
  },
  {
    id: "page-portfolio",
    path: "/portfolio",
    title: "Portfolio",
    description: "Products and client work shipped by Appo Matrix, with galleries and links to the live products.",
    kicker: "Portfolio",
    heading: "Proof over promises",
    lead: "Products we have designed and shipped. Open a record for the problem, the build, the gallery, and a link back to the live product.",
    body: "",
    secondaryTitle: "",
    sortOrder: 3,
  },
  {
    id: "page-blog",
    path: "/blog",
    title: "Blog",
    description: "Notes on product, engineering, and how Appo Matrix works.",
    kicker: "Blog",
    heading: "Notes from the work",
    lead: "Product, engineering, and studio writing. New posts are published from the admin studio.",
    body: "",
    secondaryTitle: "",
    sortOrder: 4,
  },
  {
    id: "page-team",
    path: "/team",
    title: "Team",
    description: "The people who design and ship at Appo Matrix in Gilgit-Baltistan.",
    kicker: "Team",
    heading: "The people on the squad",
    lead: "Strategy, design, and engineering in one group. You talk to the people who do the work.",
    body: "",
    secondaryTitle: "",
    sortOrder: 5,
  },
  {
    id: "page-about",
    path: "/about",
    title: "About Us",
    description: "Appo Matrix is a software studio in Gilgit-Baltistan working with clients worldwide.",
    kicker: "About Us",
    heading: "",
    lead: "",
    body: "",
    secondaryTitle: "Who you will meet",
    sortOrder: 6,
  },
  {
    id: "page-contact",
    path: "/contact",
    title: "Contact Us",
    description: "Start a project, a career application, or a scholarship inquiry with Appo Matrix. We reply within one business day.",
    kicker: "Contact Us",
    heading: "Tell us what you are building",
    lead: "A project, a role, or a scholarship. We reply within one business day with a clear next step.",
    body: "Inquiries land in the studio CRM. Nothing is scheduled or billed until you confirm the scope in writing.",
    secondaryTitle: "",
    sortOrder: 7,
  },
  {
    id: "page-careers",
    path: "/career-development",
    title: "Career Development",
    description: "Roles, internships, and apprenticeship programs at Appo Matrix in Gilgit-Baltistan.",
    kicker: "Career Development",
    heading: "Serious work, without leaving the mountains",
    lead: "Full-time roles, internships, and a delivery apprenticeship for people who want product engineering in Gilgit-Baltistan.",
    body: "Training here is attached to client work. You will write, review, and ship with the same definition of done as the rest of the squad.\n\nOpenings are edited from the admin studio. If nothing listed fits, write to us anyway — we keep a short list for the next cohort.",
    secondaryTitle: "",
    sortOrder: 8,
  },
  {
    id: "page-scholarships",
    path: "/scholarships",
    title: "Scholarships",
    description: "Scholarships and fellowships from Appo Matrix for students in Gilgit-Baltistan and beyond.",
    kicker: "Scholarships",
    heading: "Time and tuition for people already making things",
    lead: "Awards, fellowships, and summer grants. Each one is published from the admin studio, with a deadline and a way to apply.",
    body: "",
    secondaryTitle: "",
    sortOrder: 9,
  },
];

export function pageIntro(
  page: PageMeta | undefined,
  fallback: { kicker: string; heading: string; lead: string; body?: string; secondaryTitle?: string },
) {
  return {
    kicker: page?.kicker || fallback.kicker,
    heading: page?.heading || fallback.heading,
    lead: page?.lead || fallback.lead,
    body: page?.body || fallback.body || "",
    secondaryTitle: page?.secondaryTitle || fallback.secondaryTitle || "",
    image: page?.image || "",
    imageAlt: page?.imageAlt || page?.heading || fallback.heading,
  };
}

export function pageSeed(path: string) {
  return PAGE_SEEDS.find((page) => page.path === path);
}

export async function fillPageCopy(db: SqlExec) {
  for (const page of PAGE_SEEDS) {
    await db(
      `INSERT IGNORE INTO page_meta (
        id, path, title, description, kicker, heading, lead, body, secondary_title, image, image_alt, sort_order, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '', '', ?, 1)`,
      [
        page.id,
        page.path,
        page.title,
        page.description,
        page.kicker,
        page.heading,
        page.lead,
        page.body,
        page.secondaryTitle,
        page.sortOrder,
      ],
    );
    await db(
      `UPDATE page_meta SET
        kicker = IF(kicker = '', ?, kicker),
        heading = IF(heading = '', ?, heading),
        lead = IF(lead = '', ?, lead),
        body = IF(body IS NULL OR body = '', ?, body),
        secondary_title = IF(secondary_title = '', ?, secondary_title)
       WHERE path = ?`,
      [page.kicker, page.heading, page.lead, page.body, page.secondaryTitle, page.path],
    );
  }
}
