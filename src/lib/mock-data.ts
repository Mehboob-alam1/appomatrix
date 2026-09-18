import type {
  BlogPost,
  Project,
  Service,
  TeamMember,
  Testimonial,
} from "@/types/content";

const img = (path: string) =>
  `https://images.unsplash.com/${path}?auto=format&fit=crop&w=1200&q=80`;

export const mockProjects: Project[] = [
  {
    _id: "p1",
    title: "Alpine Logistics Platform",
    slug: "alpine-logistics-platform",
    clientName: "NorthPeak Freight",
    category: "SaaS",
    excerpt: "Unified dispatch and tracking for regional freight operators.",
    coverImage: img("photo-1586528116311-ad8dd3c8310d"),
    problem:
      "Manual dispatch spreadsheets caused missed loads and poor visibility for drivers in remote valleys.",
    solution:
      "We built a cloud-native SaaS with real-time GPS tracking, automated routing, and offline-first mobile apps for drivers.",
    result:
      "Dispatch time dropped 62% and on-time delivery improved to 97% within three months of launch.",
    metrics: [
      { label: "Dispatch time", value: "-62%" },
      { label: "On-time delivery", value: "97%" },
      { label: "Active drivers", value: "340+" },
    ],
    techStack: ["Next.js", "PostgreSQL", "React Native", "AWS"],
    featured: true,
  },
  {
    _id: "p2",
    title: "Heritage Tourism Booking",
    slug: "heritage-tourism-booking",
    clientName: "Silk Route Experiences",
    category: "Web",
    excerpt: "Direct booking engine replacing third-party OTAs.",
    coverImage: img("photo-1469854523086-bd94bbe22747"),
    problem:
      "High OTA commissions and no control over guest experience on mobile networks.",
    solution:
      "Custom booking site with multi-currency payments, itinerary builder, and CMS-managed content.",
    result:
      "Direct bookings grew 4× and average order value increased 28% in the first season.",
    metrics: [
      { label: "Direct bookings", value: "4×" },
      { label: "AOV lift", value: "+28%" },
    ],
    techStack: ["Next.js", "Stripe", "Sanity", "Vercel"],
    featured: true,
  },
  {
    _id: "p3",
    title: "Field Health Records",
    slug: "field-health-records",
    clientName: "Summit Care NGO",
    category: "Mobile",
    excerpt: "Offline-capable patient records for rural clinics.",
    coverImage: img("photo-1576091160399-112ba8d25d1d"),
    problem:
      "Clinics lacked reliable connectivity and paper records were error-prone.",
    solution:
      "Cross-platform mobile app with encrypted local storage and background sync when online.",
    result:
      "Data entry errors fell 45% and follow-up visit compliance reached 91%.",
    metrics: [
      { label: "Data errors", value: "-45%" },
      { label: "Follow-up compliance", value: "91%" },
    ],
    techStack: ["Flutter", "Firebase", "Node.js"],
    featured: true,
  },
  {
    _id: "p4",
    title: "Retail Analytics Dashboard",
    slug: "retail-analytics-dashboard",
    clientName: "Bazaar Metrics",
    category: "Digital Transformation",
    excerpt: "Single source of truth for 80+ franchise locations.",
    coverImage: img("photo-1556155092-4902895f6dfa"),
    problem:
      "Franchisees reported sales in inconsistent formats, delaying decisions.",
    solution:
      "ETL pipelines, executive dashboard, and automated weekly PDF reports per region.",
    result:
      "Leadership cut reporting cycles from 2 weeks to 24 hours.",
    metrics: [{ label: "Reporting cycle", value: "24h" }],
    techStack: ["Python", "dbt", "React", "BigQuery"],
    featured: false,
  },
];

export const mockPosts: BlogPost[] = [
  {
    _id: "b1",
    title: "How to Scope a SaaS MVP Without Overbuilding",
    slug: "scope-saas-mvp",
    excerpt:
      "A practical framework we use with founders to ship a testable product in 90 days.",
    category: "Product",
    author: "Sana Karim",
    publishedAt: "2026-03-01T10:00:00.000Z",
    readingTimeMinutes: 7,
    featuredImage: img("photo-1555066931-4365d14bab8c"),
    content:
      "Founders often confuse a demo with a product. Start with one painful workflow, one user role, and one measurable outcome.",
  },
  {
    _id: "b2",
    title: "Building for Low-Bandwidth Regions",
    slug: "low-bandwidth-ux",
    excerpt:
      "Performance and offline patterns that matter when your users are on 3G at altitude.",
    category: "Engineering",
    author: "Ahmed Raza",
    publishedAt: "2026-02-12T10:00:00.000Z",
    readingTimeMinutes: 6,
    featuredImage: img("photo-1517694712202-d8f47886f668"),
    content:
      "Optimize images, defer non-critical JS, and design optimistic UI with clear sync states.",
  },
  {
    _id: "b3",
    title: "Why We Pair Discovery Calls With Written Briefs",
    slug: "discovery-briefs",
    excerpt:
      "Clear briefs reduce rework and help both sides align on success metrics early.",
    category: "Process",
    author: "Sana Karim",
    publishedAt: "2026-01-20T10:00:00.000Z",
    readingTimeMinutes: 5,
    featuredImage: img("photo-1522071820081-009f0129c71c"),
    content:
      "Every engagement starts with outcomes, constraints, and a phased roadmap—not a feature laundry list.",
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    _id: "t1",
    clientName: "Elena Morris",
    role: "COO",
    company: "NorthPeak Freight",
    quote:
      "Appo Matrix felt like an extension of our team. They shipped on schedule despite tight connectivity constraints in the field.",
    rating: 5,
  },
  {
    _id: "t2",
    clientName: "James Okonkwo",
    role: "Founder",
    company: "Bazaar Metrics",
    quote:
      "Clear communication, strong engineering, and zero fluff. Our dashboard is now the first tab our leadership opens every morning.",
    rating: 5,
  },
  {
    _id: "t3",
    clientName: "Priya Nair",
    role: "Product Lead",
    company: "Silk Route Experiences",
    quote:
      "They translated vague tourism ideas into a booking flow that converts. Direct revenue impact within weeks of launch.",
    rating: 5,
  },
  {
    _id: "t4",
    clientName: "Dr. Hassan Ali",
    role: "Program Director",
    company: "Summit Care NGO",
    quote:
      "The mobile app works offline when we need it most. Training clinic staff was smooth thanks to thoughtful UX.",
    rating: 5,
  },
];

export const mockServices: Service[] = [
  {
    _id: "s1",
    title: "Web Development",
    slug: "web-development",
    shortDescription:
      "Fast, accessible marketing sites and complex web applications built on modern stacks.",
    fullDescription:
      "From high-converting marketing sites to customer portals, we design for performance, SEO, and maintainability.",
    icon: "globe",
    processSteps: [
      {
        title: "Discover",
        description: "Goals, users, and success metrics in a structured workshop.",
      },
      {
        title: "Design & build",
        description: "Iterative sprints with weekly demos and staging previews.",
      },
      {
        title: "Launch & grow",
        description: "Analytics, monitoring, and a clear handoff or retainer plan.",
      },
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js"],
  },
  {
    _id: "s2",
    title: "Mobile App Development",
    slug: "mobile-app-development",
    shortDescription:
      "Native-feel iOS and Android apps with offline-ready architecture when you need it.",
    fullDescription:
      "We ship cross-platform and native mobile products with thoughtful UX for real-world network conditions.",
    icon: "smartphone",
    processSteps: [
      {
        title: "Prototype",
        description: "Clickable flows validated with stakeholders before code.",
      },
      {
        title: "Engineer",
        description: "Testable modules, CI, and device lab QA.",
      },
      {
        title: "Release",
        description: "Store submission support and crash monitoring setup.",
      },
    ],
    techStack: ["React Native", "Flutter", "Swift", "Kotlin"],
  },
  {
    _id: "s3",
    title: "SaaS Development",
    slug: "saas-development",
    shortDescription:
      "Multi-tenant products with billing, auth, and admin tooling from day one.",
    fullDescription:
      "We help you go from MVP to scalable SaaS with secure auth, subscriptions, and observability baked in.",
    icon: "layers",
    processSteps: [
      {
        title: "MVP definition",
        description: "One core workflow, one pricing hypothesis, one metric.",
      },
      {
        title: "Platform foundations",
        description: "Auth, billing, roles, and audit logs.",
      },
      {
        title: "Scale path",
        description: "Performance budgets and roadmap for v2 features.",
      },
    ],
    techStack: ["Next.js", "PostgreSQL", "Stripe", "Redis", "AWS"],
  },
  {
    _id: "s4",
    title: "Digital Transformation Consulting",
    slug: "digital-transformation-consulting",
    shortDescription:
      "Audit legacy workflows and ship phased modernization without stopping the business.",
    fullDescription:
      "We map processes, prioritize quick wins, and align teams on a realistic transformation roadmap.",
    icon: "compass",
    processSteps: [
      {
        title: "Assess",
        description: "Stakeholder interviews and systems inventory.",
      },
      {
        title: "Roadmap",
        description: "Phased plan with ROI estimates per initiative.",
      },
      {
        title: "Execute",
        description: "Embedded squads or vendor oversight—your choice.",
      },
    ],
    techStack: ["Cloud migration", "Data pipelines", "Integration APIs"],
  },
];

export const mockTeam: TeamMember[] = [
  {
    _id: "tm1",
    name: "Sana Karim",
    role: "CEO & Product Strategist",
    bio: "Former product lead for B2B SaaS in Dubai and Islamabad. Focused on outcomes, not slide decks.",
    social: [{ platform: "linkedin", url: "#" }],
  },
  {
    _id: "tm2",
    name: "Ahmed Raza",
    role: "CTO",
    bio: "Full-stack architect with 12+ years shipping fintech and logistics platforms.",
    social: [{ platform: "github", url: "#" }],
  },
  {
    _id: "tm3",
    name: "Fatima Noor",
    role: "Design Lead",
    bio: "Brand and UX designer obsessed with clarity, accessibility, and type.",
    social: [{ platform: "linkedin", url: "#" }],
  },
  {
    _id: "tm4",
    name: "Usman Khan",
    role: "Engineering Manager",
    bio: "Leads delivery squads across web and mobile with a calm, predictable cadence.",
    social: [{ platform: "linkedin", url: "#" }],
  },
];
