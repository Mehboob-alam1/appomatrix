import { seedStructure, type SqlExec } from "@/lib/seed-structure";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

async function insert(db: SqlExec, sql: string, params: unknown[]) {
  await db(sql, params);
}

export async function seedContent(db: SqlExec, options?: { structureOnly?: boolean }) {
  if (options?.structureOnly) {
    await seedStructure(db);
    return;
  }
  const services: unknown[][] = [
    [
      "svc-engineering",
      "software-engineering",
      "Software Engineering",
      null,
      "Web, mobile, and product engineering from a single delivery squad.",
      "We design and build the software your customers actually use. Engagements can be a defined build, a modernization program, or a squad that stays with the product after launch.\n\nEvery engagement starts with the constraint that matters: timeline, compliance, connectivity, or the workflow that is costing you the most.",
      "layers",
      img("photo-1498050108023-c5249f4df085"),
      "Engineers working on a product",
      "Discover|Map the workflow, users, and constraints\nDesign|Agree the slice we will ship first\nBuild|Deliver against milestones you can review\nHandover|Access, docs, and a support window",
      "TypeScript, React, Node.js, PostgreSQL",
      1,
    ],
    [
      "svc-web",
      "web-development",
      "Web Development",
      "svc-engineering",
      "Marketing sites and web applications built to stay fast and maintainable.",
      "From a company site like this one to customer portals and internal tools, we build for performance, accessibility, and a CMS your team can actually use.\n\nSites ship with clean information architecture, careful typography, and the operational basics: forms, analytics hooks, and an admin path for content.",
      "globe",
      img("photo-1460925895917-afdab827c52f"),
      "Web analytics on a laptop",
      "Structure|Sitemap, content model, and success metrics\nInterface|Design system and key templates\nBuild|Implementation, SEO, and performance\nLaunch|Content handover and measurement",
      "Next.js, React, TypeScript, Tailwind",
      1,
    ],
    [
      "svc-mobile",
      "mobile-app-development",
      "Mobile App Development",
      "svc-engineering",
      "iOS and Android apps with offline-ready architecture when the network is unreliable.",
      "We ship cross-platform and native mobile products for field teams, clinics, drivers, and consumers. Offline storage, sync states, and plain language UX are part of the design, not a later patch.\n\nStore release, analytics, and a support build are included in the handover.",
      "smartphone",
      img("photo-1512941937669-90a1b58e7e9c"),
      "Mobile app on a phone",
      "Flows|The few journeys that have to work offline\nPrototype|Clickable UI on real devices\nBuild|App, API, and sync rules\nRelease|Store submission and staff training",
      "React Native, Flutter, Firebase",
      2,
    ],
    [
      "svc-saas",
      "saas-development",
      "SaaS Development",
      "svc-engineering",
      "Multi-tenant products with billing, auth, and admin tooling from the first release.",
      "Founders come to us with a workflow and a deadline. We scope an MVP that a real customer can pay for, then leave room to grow into roles, plans, and reporting.\n\nAuth, tenancy, audit basics, and a billing path are decided before the first sprint, so you do not rebuild the foundation later.",
      "layers",
      img("photo-1551288049-bebda4e38f71"),
      "SaaS dashboard",
      "Scope|One role, one workflow, one outcome\nFoundation|Auth, tenancy, and billing approach\nMVP|The release a customer can use\nOperate|Metrics, support, and the next slice",
      "Next.js, PostgreSQL, Stripe",
      3,
    ],
    [
      "svc-custom",
      "custom-software",
      "Custom Software",
      "svc-engineering",
      "Internal systems that replace spreadsheets without freezing the business.",
      "When off-the-shelf tools fight your process, we build the narrower system that fits. Typical work includes operations consoles, partner portals, and the integrations between them.\n\nWe phase the rollout so teams keep working while the new system takes over one workflow at a time.",
      "code",
      img("photo-1555066931-4365d14bab8c"),
      "Custom software on screen",
      "Audit|Where time and errors actually go\nSlice|The first workflow to replace\nIntegrate|APIs, imports, and permissions\nAdopt|Training and a measured cutover",
      "TypeScript, Python, PostgreSQL",
      4,
    ],
    [
      "svc-product",
      "product-and-design",
      "Product & Design",
      null,
      "Strategy, interface design, and brand systems that make the product legible.",
      "Design at Appo Matrix is tied to delivery. We shape the offer, the flows, and the visual system, then stay through implementation so the shipped product matches the decisions.\n\nUseful when a team has engineers but no product lead, or a brief that is still a pile of feature requests.",
      "palette",
      img("photo-1522071820081-009f0129c71c"),
      "Product team in discussion",
      "Frame|Users, offer, and constraints\nExplore|Options with trade-offs written down\nSpecify|Flows, UI, and content\nSupport|Design QA during build",
      "Figma, Design systems, UX writing",
      2,
    ],
    [
      "svc-strategy",
      "product-strategy",
      "Product Strategy",
      "svc-product",
      "A written brief, a phased roadmap, and a scope you can approve.",
      "Discovery calls are paired with a written brief: outcomes, constraints, and what we will not build yet. That document is what both sides steer by.\n\nStrategy work can stand alone or open a build engagement.",
      "compass",
      img("photo-1454165804606-c3d57bc86b40"),
      "Strategy workshop",
      "Listen|Stakeholders, users, and current tools\nFrame|Problem statement and success metrics\nRoadmap|Phases, risks, and a first release\nDecide|A scope you can sign",
      "Discovery, Roadmapping, Workshops",
      1,
    ],
    [
      "svc-ux",
      "ui-ux-design",
      "UI/UX Design",
      "svc-product",
      "Interfaces with clear hierarchy, accessible type, and flows people finish.",
      "We design product UI and marketing pages with the same care: readable type, obvious actions, and states for empty, loading, and error. Accessibility is part of the review, not a checklist at the end.\n\nYou receive files your engineers can implement, plus notes on interaction and content.",
      "palette",
      img("photo-1545235617-9465d2a55698"),
      "Interface design",
      "Research|The tasks people repeat\nStructure|Information architecture\nVisual|Type, color, and components\nHandoff|Specs and a review with engineering",
      "Figma, Accessibility, Prototypes",
      2,
    ],
    [
      "svc-brand",
      "brand-and-profiles",
      "Brand & Corporate Profiles",
      "svc-product",
      "Identity and company profiles for teams that need to look as serious as their work.",
      "A tight visual system — mark, type, color, and a small set of templates — so proposals, the website, and product UI feel like one company.\n\nUseful ahead of fundraising, enterprise sales, or a public launch.",
      "pen",
      img("photo-1524758631624-e2822e304c36"),
      "Brand workspace",
      "Audit|How the company shows up today\nDirection|A system you can recognize\nApply|Site, deck, and profile pages\nGuide|Short rules your team can follow",
      "Brand, Art direction, Templates",
      3,
    ],
    [
      "svc-growth",
      "cloud-and-growth",
      "Cloud & Growth",
      null,
      "Modernization, hosting, commerce, and the operational work around a launch.",
      "Shipping the product is half of the job. We also take on the unglamorous pieces: cloud setup, migrations, storefronts, and the performance work that decides whether people stay.\n\nThese services pair with engineering or run as a focused engagement.",
      "cloud",
      img("photo-1451187580459-43490279c0fa"),
      "Network and cloud",
      "Assess|What is fragile, slow, or manual\nPlan|A sequence that does not stop the business\nImplement|The change, with a rollback\nWatch|The signals that tell us it worked",
      "Cloud, SEO, E-commerce",
      3,
    ],
    [
      "svc-transform",
      "digital-transformation",
      "Digital Transformation",
      "svc-growth",
      "Phased modernization of legacy workflows without stopping the business.",
      "We map how work actually happens, pick the steps worth digitizing first, and ship those before touching everything else. Leadership gets a roadmap with owners, not a slide full of platforms.\n\nTypical clients have outgrown spreadsheets or a vendor system they cannot change.",
      "compass",
      img("photo-1552664730-d307ca884978"),
      "Team planning a rollout",
      "Map|Process, tools, and pain\nPrioritize|Quick wins and structural fixes\nPilot|One team, one workflow\nScale|The pattern, once it is proven",
      "Process design, APIs, Cloud migration",
      1,
    ],
    [
      "svc-cloud",
      "cloud-hosting",
      "Cloud, DevOps & Hosting",
      "svc-growth",
      "Environments, deploys, and hosting your team can operate after we leave.",
      "We set up sensible hosting, previews, backups, and a deploy path. The goal is a system your own people can ship to on a Tuesday, with a short runbook rather than a private ritual.\n\nWe also take over existing hosting when a site or app needs a cleaner home.",
      "cloud",
      img("photo-1558494949-ef010cbdcc31"),
      "Server room",
      "Baseline|What you run today and who can access it\nTarget|Environments and a deploy path\nMove|Migration with a rollback plan\nRunbook|The few commands that matter",
      "Vercel, AWS, Docker, CI",
      2,
    ],
    [
      "svc-commerce",
      "ecommerce",
      "E-commerce Solutions",
      "svc-growth",
      "Stores and booking flows that keep the customer relationship on your domain.",
      "Direct checkout, catalogs, and booking engines for teams paying too much to marketplaces or stitching together plugins. Payments, inventory basics, and a content model your staff can edit are in scope.\n\nWe would rather ship a smaller catalog that converts than a theme packed with apps.",
      "shopping",
      img("photo-1556742049-0cfed4f6a45d"),
      "Checkout on a phone",
      "Offer|What is sold and how it is priced\nCheckout|Payments, tax, and confirmation\nCatalog|The content your team maintains\nMeasure|The numbers that show it worked",
      "Stripe, Next.js, Catalog CMS",
      3,
    ],
    [
      "svc-seo",
      "seo-and-performance",
      "SEO & Performance",
      "svc-growth",
      "Technical SEO and speed work so the site is findable and calm on slow networks.",
      "We fix the structural issues that hold a site back: indexation, metadata, image weight, and JavaScript that blocks the first view. Recommendations are tied to pages and templates, not a generic audit PDF.\n\nEspecially relevant for content-heavy sites and customers on limited bandwidth.",
      "chart",
      img("photo-1460925895917-afdab827c52f"),
      "Performance charts",
      "Crawl|What search engines and users actually hit\nFix|Templates, metadata, and assets\nMeasure|Core Web Vitals and index coverage\nKeep|A short checklist for new pages",
      "Technical SEO, Core Web Vitals",
      4,
    ],
    [
      "svc-data",
      "data-and-ai",
      "Data & AI",
      null,
      "Practical analytics and applied AI on top of data you already have.",
      "We do not start with a model. We start with the decision that is slow, inconsistent, or trapped in exports. Then we build the pipeline, the dashboard, or the assistant that shortens it.\n\nUseful for operations leaders who need one view of the business, and product teams adding a narrow AI feature.",
      "sparkles",
      img("photo-1551288049-bebda4e38f71"),
      "Analytics dashboard",
      "Decision|The question the system must answer\nData|Sources, quality, and access\nProduct|Dashboard, pipeline, or assistant\nGuardrails|What it must not invent or expose",
      "Python, SQL, Applied AI",
      4,
    ],
    [
      "svc-ai",
      "applied-ai",
      "Applied AI",
      "svc-data",
      "Narrow assistants and automation grounded in your own content and workflows.",
      "We add AI where it removes a repeated task: sorting requests, drafting from your own documents, or answering with sources attached. The interface shows uncertainty instead of pretending.\n\nNo open-ended chatbots bolted onto a homepage unless that is truly the job.",
      "sparkles",
      img("photo-1677442136019-21780ecad995"),
      "Abstract AI visual",
      "Job|The task a person repeats today\nGround|The documents or records it may use\nInterface|Review, edit, and approve\nEvaluate|A small set of cases we check",
      "LLMs, Retrieval, Review UI",
      1,
    ],
    [
      "svc-analytics",
      "analytics-platforms",
      "Analytics Platforms",
      "svc-data",
      "One source of truth for operators who are tired of reconciling exports.",
      "Pipelines, a leadership dashboard, and scheduled reports. We model the few metrics people already argue about, then make them refresh without a spreadsheet round-trip.\n\nBuilt for franchise, logistics, and multi-site teams.",
      "chart",
      img("photo-1551288049-bebda4e38f71"),
      "Charts on a screen",
      "Metrics|Definitions everyone accepts\nIngest|The sources and their cadence\nSurface|Dashboard and a weekly report\nTrust|Checks when a number looks wrong",
      "Python, BigQuery, React",
      2,
    ],
  ];

  for (const row of services) {
    await insert(
      db,
      `INSERT IGNORE INTO services (
        id, slug, title, parent_id, short_description, full_description, icon, image, image_alt,
        process_text, tech_stack, sort_order, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      row,
    );
  }

  const projects: unknown[][] = [
    [
      "prj-alpine",
      "alpine-logistics-platform",
      "Alpine Logistics Platform",
      "NorthPeak Freight",
      "SaaS",
      "Unified dispatch and tracking for regional freight operators.",
      img("photo-1586528116311-ad8dd3c8310d"),
      "Freight warehouse floor",
      JSON.stringify([
        { url: img("photo-1586528116311-ad8dd3c8310d"), alt: "Warehouse operations", caption: "Dispatch floor the platform replaced spreadsheets for." },
        { url: img("photo-1551288049-bebda4e38f71"), alt: "Operations dashboard", caption: "Live board for loads, delays, and driver status." },
        { url: img("photo-1512941937669-90a1b58e7e9c"), alt: "Driver mobile app", caption: "Offline-first mobile app for drivers in the valleys." },
      ]),
      "Manual dispatch spreadsheets caused missed loads and poor visibility for drivers working through remote valleys.",
      "A cloud SaaS product with real-time tracking, automated routing suggestions, and an offline-first mobile app for drivers. Dispatchers and leadership share one board.",
      "Dispatch time dropped 62% and on-time delivery reached 97% within three months of launch.",
      "Dispatch time|-62%\nOn-time delivery|97%\nSites live|14",
      "Next.js, PostgreSQL, React Native, AWS",
      "https://example.com/alpine-logistics",
      1,
      1,
      "2025-11-02T10:00:00.000Z",
    ],
    [
      "prj-heritage",
      "heritage-tourism-booking",
      "Heritage Tourism Booking",
      "Silk Route Experiences",
      "Web",
      "A direct booking engine that replaced third-party OTAs for a regional travel brand.",
      img("photo-1476514525535-07fb3b4ae5f1"),
      "Travelers on a mountain road",
      JSON.stringify([
        { url: img("photo-1476514525535-07fb3b4ae5f1"), alt: "Mountain travel", caption: "Itineraries the brand sells directly." },
        { url: img("photo-1544735716-392fe2489ffa"), alt: "High mountain landscape", caption: "Destinations featured in the booking gallery." },
        { url: img("photo-1556742049-0cfed4f6a45d"), alt: "Mobile checkout", caption: "Checkout designed for patchy mobile networks." },
      ]),
      "High marketplace commissions and no control over the guest experience, especially on slow mobile connections.",
      "A custom booking site with multi-currency payments, an itinerary builder, and a CMS for departures, stories, and photos.",
      "Direct bookings grew 4× and average order value rose 28% in the first season.",
      "Direct bookings|4×\nOrder value|+28%",
      "Next.js, Stripe, Vercel",
      "https://example.com/heritage-booking",
      1,
      2,
      "2025-09-18T10:00:00.000Z",
    ],
    [
      "prj-health",
      "field-health-records",
      "Field Health Records",
      "Summit Care NGO",
      "Mobile",
      "Offline-capable patient records for rural clinics.",
      img("photo-1576091160399-112ba8d25d1d"),
      "Clinic care",
      JSON.stringify([
        { url: img("photo-1576091160399-112ba8d25d1d"), alt: "Clinical setting", caption: "Records captured where the visit happens." },
        { url: img("photo-1512941937669-90a1b58e7e9c"), alt: "Phone in the field", caption: "The app keeps working when the signal drops." },
        { url: img("photo-1576091160550-2173dba999ef"), alt: "Health professional", caption: "Follow-ups the staff can actually complete." },
      ]),
      "Clinics lacked reliable connectivity, and paper records were slow and easy to misfile.",
      "A cross-platform mobile app with encrypted local storage and background sync when a connection returns. Staff see a clear sync state instead of a spinner.",
      "Data entry errors fell 45% and follow-up compliance reached 91%.",
      "Data errors|-45%\nFollow-up compliance|91%",
      "Flutter, Firebase",
      "https://example.com/field-health",
      1,
      3,
      "2025-08-04T10:00:00.000Z",
    ],
    [
      "prj-bazaar",
      "retail-analytics-dashboard",
      "Retail Analytics Dashboard",
      "Bazaar Metrics",
      "Data",
      "A single source of truth for 80+ franchise locations.",
      img("photo-1551434678-e076c223a692"),
      "Retail analytics workspace",
      JSON.stringify([
        { url: img("photo-1551434678-e076c223a692"), alt: "Analyst at work", caption: "Leadership review moved off email attachments." },
        { url: img("photo-1551288049-bebda4e38f71"), alt: "Dashboard charts", caption: "Regional view of sales, stock, and exceptions." },
        { url: img("photo-1460925895917-afdab827c52f"), alt: "Report on a laptop", caption: "Weekly PDF each region still receives automatically." },
      ]),
      "Franchisees reported sales in inconsistent formats, so decisions waited on someone to reconcile spreadsheets.",
      "ETL pipelines, an executive dashboard, and automated weekly PDF reports per region. Metric definitions were written down before the charts.",
      "Reporting cycles dropped from two weeks to 24 hours.",
      "Reporting cycle|24h\nLocations|80+",
      "Python, React, BigQuery",
      "https://example.com/bazaar-metrics",
      0,
      4,
      "2025-06-12T10:00:00.000Z",
    ],
    [
      "prj-campus",
      "campus-connect",
      "Campus Connect",
      "Northern Colleges Network",
      "Product",
      "A student and faculty portal for notices, fees, and career programs.",
      img("photo-1523240795612-9a054b0db644"),
      "Students collaborating",
      JSON.stringify([
        { url: img("photo-1523240795612-9a054b0db644"), alt: "Students working together", caption: "The portal is the noticeboard students actually open." },
        { url: img("photo-1434030216411-0b793f4b4173"), alt: "Study notes", caption: "Scholarships and career posts live next to coursework." },
        { url: img("photo-1522202176988-66273c2fd55f"), alt: "Mentoring session", caption: "Faculty publish programs without calling IT." },
      ]),
      "Notices, fee status, and scholarship calls were scattered across WhatsApp groups and a website nobody updated.",
      "A role-based portal with an admin for announcements, fee snapshots, and program applications. Staff edit content themselves.",
      "Announcement reach moved from informal groups to a record 86% of enrolled students open weekly.",
      "Weekly active students|86%\nManual posts retired|WhatsApp blasts",
      "Next.js, PostgreSQL",
      "https://example.com/campus-connect",
      0,
      5,
      "2025-04-20T10:00:00.000Z",
    ],
  ];

  for (const row of projects) {
    await insert(
      db,
      `INSERT IGNORE INTO projects (
        id, slug, title, client_name, category, excerpt, cover_image, cover_image_alt, gallery,
        problem, solution, result, metrics_text, tech_stack, external_link, featured, sort_order,
        published, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      row,
    );
  }

  const posts: unknown[][] = [
    [
      "post-mvp",
      "scope-a-saas-mvp",
      "How to scope a SaaS MVP without overbuilding",
      "A practical frame we use with founders who need a product a customer can pay for in about 90 days.",
      "Founders often confuse a demo with a product. A demo proves a screen. A product proves that one person can finish one painful job and that you can tell whether it worked.\n\nStart with a single role, a single workflow, and a single outcome you can count. If the pitch needs three personas to make sense, the MVP is still a pitch.\n\nWrite the brief before the backlog. The brief names the outcome, the constraints, what is explicitly out of scope, and how you will know the release is done. We pair every discovery call with that document so memory is not the spec.\n\nBilling, auth, and a basic admin belong in the first release when the business model depends on them. Decorative dashboards do not. Ship the path a customer walks, then earn the next slice with what you learned.",
      img("photo-1555066931-4365d14bab8c"),
      "Code on a laptop",
      "Sana Karim",
      "Product",
      "2026-03-01T10:00:00.000Z",
      6,
    ],
    [
      "post-bandwidth",
      "building-for-low-bandwidth",
      "Building for low-bandwidth regions",
      "Performance and offline patterns that matter when your users are on a weak connection at altitude.",
      "A product that only works on a fast office connection is a product that fails the people we build for. Clinics, drivers, and travelers in the mountains do not get a second loading state.\n\nTreat the network as optional. Cache the record they just wrote. Show a sync state in plain language. Never block a form on a round trip you could defer.\n\nImages are usually the budget. Serve the size you display, and do not animate what a photograph can say. Defer scripts that are not required for the first action.\n\nTest on a throttled connection before you celebrate Lighthouse on a laptop. The number that matters is whether the task finished.",
      img("photo-1464822759023-fed622ff2c3b"),
      "Mountain ridge",
      "Ahmed Raza",
      "Engineering",
      "2026-02-12T10:00:00.000Z",
      5,
    ],
    [
      "post-briefs",
      "discovery-calls-and-written-briefs",
      "Why we pair discovery calls with written briefs",
      "Clear briefs reduce rework and help both sides agree on success before anyone opens a design file.",
      "A good call feels like alignment. A week later it is often two different memories. We write the brief the same day: problem, users, constraints, phased scope, and what we will not do yet.\n\nThe brief is short on purpose. If it needs a appendix of features, we have skipped the decision. Features come after the outcome is named.\n\nClients use the brief to get internal approval. We use it to keep the build honest. When a new idea appears, it is compared to the brief instead of absorbed quietly.\n\nThat habit is why timelines hold. The work was bounded while everyone was still being polite.",
      img("photo-1522071820081-009f0129c71c"),
      "Team in a working session",
      "Sana Karim",
      "Process",
      "2026-01-20T10:00:00.000Z",
      5,
    ],
    [
      "post-careers",
      "hiring-engineers-in-gilgit-baltistan",
      "Hiring engineers without asking them to leave home",
      "How our career programs and delivery squads are structured for people who want serious work in Gilgit-Baltistan.",
      "The talent is already here. What is scarce is a path into product work that does not require moving to a larger city for the privilege of writing CRUD apps.\n\nOur delivery squads pair a senior engineer with associates and apprentices. The work is client work, with the same reviews and the same definition of done. Training that is disconnected from a shipment does not stick.\n\nScholarships and internships feed that path. They are not a marketing page. A fellow who finishes a program should be able to point at a product and explain their part.\n\nIf you are building a team with the same constraint — keep people rooted, ship for global clients — the pattern travels.",
      img("photo-1522202176988-66273c2fd55f"),
      "Mentoring session",
      "Usman Khan",
      "Studio",
      "2025-12-08T10:00:00.000Z",
      5,
    ],
  ];

  for (const row of posts) {
    await insert(
      db,
      `INSERT IGNORE INTO posts (
        id, slug, title, excerpt, content, featured_image, featured_image_alt, author, category,
        published_at, reading_time_minutes, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      row,
    );
  }

  const team: unknown[][] = [
    ["tm-sana", "Sana Karim", "CEO & Product Strategist", img("photo-1573496359142-b8d87734a5a2"), "Sana Karim", "Former product lead for B2B SaaS in Dubai and Islamabad. She keeps engagements tied to a written outcome.", "https://www.linkedin.com", 1],
    ["tm-ahmed", "Ahmed Raza", "CTO", img("photo-1560250097-0b93528c311a"), "Ahmed Raza", "Full-stack architect with 12+ years shipping fintech and logistics platforms. Still reviews the hard parts himself.", "https://www.linkedin.com", 2],
    ["tm-fatima", "Fatima Noor", "Design Lead", img("photo-1580489944761-15a19d654956"), "Fatima Noor", "Brand and product designer focused on clarity, accessibility, and type that holds up in both English and Urdu layouts.", "https://www.linkedin.com", 3],
    ["tm-usman", "Usman Khan", "Engineering Manager", img("photo-1500648767791-00dcc994a43e"), "Usman Khan", "Leads delivery squads across web and mobile. Known internally for calendars that survive contact with reality.", "https://www.linkedin.com", 4],
  ];

  for (const row of team) {
    await insert(
      db,
      `INSERT IGNORE INTO team_members (id, name, role, photo, photo_alt, bio, linkedin, sort_order, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      row,
    );
  }

  const quotes: unknown[][] = [
    ["t1", "Elena Morris", "COO", "NorthPeak Freight", "Appo Matrix felt like an extension of our team. They shipped on schedule despite tight connectivity constraints in the field.", 5, 1],
    ["t2", "James Okonkwo", "Founder", "Bazaar Metrics", "Clear communication, strong engineering, and no theatre. Our dashboard is now the first tab leadership opens in the morning.", 5, 2],
    ["t3", "Priya Nair", "Product Lead", "Silk Route Experiences", "They translated a vague tourism idea into a booking flow that converts. We saw direct revenue within weeks of launch.", 5, 3],
    ["t4", "Dr. Hassan Ali", "Program Director", "Summit Care NGO", "The mobile app works offline when we need it most. Training clinic staff was calm because the interface was obvious.", 5, 4],
  ];

  for (const row of quotes) {
    await insert(
      db,
      `INSERT IGNORE INTO testimonials (id, client_name, role, company, quote, rating, sort_order, published)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      row,
    );
  }

  const careers: unknown[][] = [
    [
      "car-associate",
      "associate-software-engineer",
      "Associate Software Engineer",
      "Role",
      "Gilgit / Remote",
      "Engineering",
      "A full-time seat on a delivery squad shipping web and mobile products for international clients.",
      "You will pair with a senior engineer, take scoped tickets through to production, and join client reviews once you can explain the trade-off you made.\n\nThe first months are client work, not a separate training sandbox. We expect curiosity, written English for tickets and PRs, and respect for the people who will operate what you ship.",
      "1–3 years building web or mobile software\nComfortable with JavaScript or TypeScript\nYou can explain a bug without blaming the user\nBased in Pakistan, with overlap for EU or Gulf hours",
      "",
      1,
    ],
    [
      "car-design",
      "product-design-internship",
      "Product Design Internship",
      "Internship",
      "Gilgit",
      "Design",
      "A six-month internship inside the design practice, attached to a live engagement.",
      "Interns work on real flows: research notes, UI for one product area, and design QA against the build. You will present to the squad, not only to a mentor.\n\nA small stipend and a written review at the end. Strong interns are first in line for associate roles.",
      "A portfolio of interface or brand work, even if it is academic\nFigma and a point of view about type\nAvailable in Gilgit for the full six months",
      "2026-11-30",
      2,
    ],
    [
      "car-apprentice",
      "delivery-apprenticeship",
      "Delivery Apprenticeship",
      "Program",
      "Gilgit-Baltistan",
      "Career development",
      "A structured year for recent graduates who want product engineering without leaving the region.",
      "The apprenticeship mixes a curriculum we actually use — TypeScript, data modeling, testing, and how a client engagement runs — with billed project work in the second half.\n\nGraduates leave with shipped work, a public write-up, and a reference from the engineer who reviewed them.",
      "A degree or equivalent project experience in computing or design\nWillingness to write every week\nYou can commit to a full year in Gilgit-Baltistan",
      "2026-08-15",
      3,
    ],
  ];

  for (const row of careers) {
    await insert(
      db,
      `INSERT IGNORE INTO careers (
        id, slug, title, kind, location, department, summary, description, requirements, deadline, sort_order, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      row,
    );
  }

  const scholarships: unknown[][] = [
    [
      "sch-mountain",
      "mountain-engineering-scholarship",
      "Mountain Engineering Scholarship",
      "Tuition support for one academic year",
      "Undergraduate students in computing, enrolled at a recognized institution in Gilgit-Baltistan.",
      "2026-07-31",
      "A yearly scholarship for students who are already building things and need the fees to stop being the reason they pause.",
      "The award covers a year of tuition and a small equipment stipend. Recipients join a monthly studio review, publish one technical note on our blog, and may apply to the delivery apprenticeship when they graduate.\n\nSelection looks at a project you have shipped or a course record, a short statement, and a conversation. We are not scoring a perfect GPA in isolation.",
      img("photo-1523240795612-9a054b0db644"),
      "",
      1,
    ],
    [
      "sch-women",
      "women-in-software-fellowship",
      "Women in Software Fellowship",
      "Mentorship, a stipend, and a paid summer build",
      "Women and non-binary students or early-career engineers in Pakistan, with preference for Gilgit-Baltistan.",
      "2026-05-15",
      "A fellowship that pairs you with a senior engineer and ends with a feature you can show, not a certificate alone.",
      "Fellows spend a summer on a scoped product problem inside a client or internal tool. You get a mentor, a stipend, and a public case note if the client agrees.\n\nThe point is a portfolio piece with constraints, reviews, and a user. Apply with something you have made and a note on what you want to be trusted with next.",
      img("photo-1573496359142-b8d87734a5a2"),
      "",
      2,
    ],
    [
      "sch-oss",
      "open-source-summer-grant",
      "Open Source Summer Grant",
      "A grant for a maintained open-source contribution",
      "Students and junior developers who can show a repository they intend to improve over the summer.",
      "2026-06-01",
      "Funding for a summer spent improving a real open-source project, with a reviewer from the studio.",
      "We fund a proposal, not a vague interest in open source. Tell us the project, the maintainer's need, and the change you will land. A studio engineer reviews your pull requests through the summer.\n\nGrants are modest on purpose. They should buy time, not replace a salary.",
      img("photo-1555066931-4365d14bab8c"),
      "",
      3,
    ],
  ];

  for (const row of scholarships) {
    await insert(
      db,
      `INSERT IGNORE INTO scholarships (
        id, slug, title, award, eligibility, deadline, summary, description, cover_image, application_url, sort_order, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      row,
    );
  }

  await seedStructure(db);
  const links: [string, string][] = [
    ["cat-product", "Product"],
    ["cat-engineering", "Engineering"],
    ["cat-process", "Process"],
    ["cat-studio", "Studio"],
  ];
  for (const [id, name] of links) {
    await db(
      "UPDATE posts SET category_id = ? WHERE category = ? AND (category_id IS NULL OR category_id = '')",
      [id, name],
    );
  }
}
