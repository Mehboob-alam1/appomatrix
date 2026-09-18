export type Project = {
  _id: string;
  title: string;
  slug: string;
  clientName: string;
  category: string;
  excerpt?: string;
  coverImage?: string;
  coverImageAlt?: string;
  gallery?: { url: string; alt: string }[];
  problem?: string;
  solution?: string;
  result?: string;
  metrics?: { label: string; value: string }[];
  techStack?: string[];
  externalLink?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  locale?: string;
  excerpt: string;
  content?: string;
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  author?: string;
  category: string;
  publishedAt: string;
  readingTimeMinutes?: number;
};

export type Testimonial = {
  _id: string;
  clientName: string;
  role: string;
  company: string;
  quote: string;
  photo?: string;
  photoAlt?: string;
  rating?: number;
};

export type Service = {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  icon?: string;
  image?: string;
  imageAlt?: string;
  processSteps?: { title: string; description: string }[];
  techStack?: string[];
  relatedProjects?: Project[];
  seoTitle?: string;
  seoDescription?: string;
};

export type TeamMember = {
  _id: string;
  name: string;
  role: string;
  photo?: string;
  photoAlt?: string;
  bio?: string;
  social?: { platform: string; url: string }[];
};

export type FormSubmission = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budget: string;
  timeline: string;
  details: string;
  source?: string;
  submittedAt: string;
};
