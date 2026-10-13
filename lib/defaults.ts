import type { Settings } from "@/lib/types";

export const defaultSettings: Settings = {
  siteName: "Appo Matrix",
  tagline:
    "Software studio in Gilgit-Baltistan — web, mobile, and SaaS for global clients.",
  email: "hello@appomatrix.com",
  phone: "+92 300 0000000",
  address: "Gilgit, Gilgit-Baltistan, Pakistan",
  city: "Gilgit-Baltistan",
  heroKicker: "Software delivery",
  heroTitle: "Build, modernize, and ship",
  heroHighlight: "digital products",
  heroLead:
    "Appo Matrix helps founders and teams across web, mobile, and SaaS — from discovery through launch. Scope, timeline, and ownership are agreed before build starts.",
  aboutHeadline: "Built in the mountains, trusted worldwide",
  aboutBody:
    "We started Appo Matrix because world-class software should not require world-class rent. From Gilgit-Baltistan we design, build, and run products for teams in the US, UK, EU, and MENA.\n\nFrom logistics platforms to tourism booking and clinic tools, the work stays the same: a clear brief, a squad you can talk to, and software that still behaves when the network does not.",
  aboutSecondary:
    "Product strategy, design, and engineering sit in one squad. You talk to the people who ship the work — not a layer of account managers.",
  statsText: `120+|Projects delivered
8+|Years shipping
15+|Countries served
94%|Client retention`,
  processText: `Discover|Problem, users, and constraints
Design|Options, scope, and trade-offs
Deliver|Milestones you can track
Operate|Handover, access, and support`,
  industriesText: `Travel & tourism|Booking flows, maps, offline-ready UX, and local payments
Logistics & operations|Dashboards, tracking, integrations, and field tools
Health & services|Patient-facing apps, privacy-aware workflows, and content
SaaS & commerce|Subscriptions, admin panels, analytics, and growth loops`,
  principlesText: `Remote-first, timezone-friendly|We align with US, EU, and MENA teams without big-city agency overhead.
Product and engineering together|You talk directly to the people designing and shipping your product.
Built for real networks|Performance and offline patterns that hold up when bandwidth is limited.`,
  calendlyUrl: "",
  linkedinUrl: "https://www.linkedin.com/company/appomatrix",
  whatsappNumber: "923000000000",
  whatsappMessage: "Hello Appo Matrix, I would like to talk with the team.",
  logoUrl: "/brand/appo-matrix-mark.png",
  logoAlt: "Appo Matrix",
  faviconUrl: "/brand/appo-matrix-favicon.png",
  footerNote: "",
  copyrightText: "",
  seoTitle: "Appo Matrix — Software studio in Gilgit-Baltistan",
  seoDescription:
    "Appo Matrix is a software studio in Gilgit-Baltistan. Web, mobile, and SaaS for teams worldwide, plus careers, scholarships, and a public portfolio.",
  seoImage: "",
  seoImageAlt: "Appo Matrix",
  heroImage:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
  heroImageAlt: "High mountain ridge above the clouds",
  heroCaption: "Shipping worldwide",
  ctaPrimaryLabel: "Plan a project",
  ctaPrimaryHref: "/contact",
  ctaSecondaryLabel: "See the work",
  ctaSecondaryHref: "/portfolio",
};

export const STARTER_USERNAME = process.env.ADMIN_USERNAME || "admin";
export const STARTER_PASSWORD = process.env.ADMIN_PASSWORD || "admin";
