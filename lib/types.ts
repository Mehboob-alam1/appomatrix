export type GalleryImage = {
  url: string;
  alt: string;
  caption: string;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  parentId: string | null;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  image: string;
  imageAlt: string;
  processText: string;
  techStack: string;
  sortOrder: number;
  published: boolean;
};

export type ServiceNode = Service & {
  children: Service[];
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  category: string;
  excerpt: string;
  coverImage: string;
  coverImageAlt: string;
  gallery: GalleryImage[];
  problem: string;
  solution: string;
  result: string;
  metricsText: string;
  techStack: string;
  externalLink: string;
  featured: boolean;
  sortOrder: number;
  published: boolean;
  createdAt: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: string;
  category: string;
  publishedAt: string;
  readingTimeMinutes: number;
  published: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  bio: string;
  linkedin: string;
  sortOrder: number;
  published: boolean;
};

export type Testimonial = {
  id: string;
  clientName: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  sortOrder: number;
  published: boolean;
};

export type Career = {
  id: string;
  slug: string;
  title: string;
  kind: string;
  location: string;
  department: string;
  summary: string;
  description: string;
  requirements: string;
  deadline: string;
  sortOrder: number;
  published: boolean;
};

export type Scholarship = {
  id: string;
  slug: string;
  title: string;
  award: string;
  eligibility: string;
  deadline: string;
  summary: string;
  description: string;
  coverImage: string;
  coverImageAlt: string;
  applicationUrl: string;
  sortOrder: number;
  published: boolean;
};

export type PostCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  published: boolean;
};

export type NavItem = {
  id: string;
  location: string;
  label: string;
  href: string;
  sortOrder: number;
  published: boolean;
};

export type SocialLink = {
  id: string;
  label: string;
  url: string;
  sortOrder: number;
  published: boolean;
};

export type HomeSection = {
  id: string;
  sectionKey: string;
  kicker: string;
  title: string;
  body: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  sortOrder: number;
  published: boolean;
};

export type PageMeta = {
  id: string;
  path: string;
  title: string;
  description: string;
  kicker: string;
  heading: string;
  lead: string;
  body: string;
  secondaryTitle: string;
  image: string;
  imageAlt: string;
  sortOrder: number;
  published: boolean;
};

export type MediaAsset = {
  id: string;
  filename: string;
  originalName: string;
  mime: string;
  sizeBytes: number;
  alt: string;
  url: string;
  createdAt: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  topic: string;
  budget: string;
  message: string;
  status: string;
  submittedAt: string;
};

export type Settings = {
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  heroKicker: string;
  heroTitle: string;
  heroHighlight: string;
  heroLead: string;
  aboutHeadline: string;
  aboutBody: string;
  aboutSecondary: string;
  statsText: string;
  processText: string;
  industriesText: string;
  principlesText: string;
  calendlyUrl: string;
  linkedinUrl: string;
  whatsappNumber: string;
  whatsappMessage: string;
  logoUrl: string;
  logoAlt: string;
  faviconUrl: string;
  footerNote: string;
  copyrightText: string;
  seoTitle: string;
  seoDescription: string;
  seoImage: string;
  seoImageAlt: string;
  heroImage: string;
  heroImageAlt: string;
  heroCaption: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
};

export type Pair = { title: string; body: string };
export type Stat = { value: string; label: string };

export type ActionResult = { ok: true } | { ok: false; error: string };
