import type { PortableTextBlock } from "@portabletext/types";

export type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
};

export type SanitySlug = { current: string; _type: "slug" };

export type Project = {
  _id: string;
  _type: "project";
  title: string;
  slug: SanitySlug | string;
  clientName: string;
  category: string;
  excerpt?: string;
  coverImage?: SanityImage | string;
  gallery?: (SanityImage | string)[];
  problem?: PortableTextBlock[] | string;
  solution?: PortableTextBlock[] | string;
  result?: PortableTextBlock[] | string;
  metrics?: { label: string; value: string }[];
  techStack?: string[];
  externalLink?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type BlogPost = {
  _id: string;
  _type: "post";
  title: string;
  slug: SanitySlug | string;
  locale?: string;
  excerpt: string;
  content?: PortableTextBlock[] | string;
  seoTitle?: string;
  seoDescription?: string;
  featuredImage?: SanityImage | string;
  author?: string;
  category: string;
  publishedAt: string;
  readingTimeMinutes?: number;
};

export type Testimonial = {
  _id: string;
  _type: "testimonial";
  clientName: string;
  role: string;
  company: string;
  quote: string;
  photo?: SanityImage | string;
  rating?: number;
};

export type Service = {
  _id: string;
  _type: "service";
  title: string;
  slug: SanitySlug | string;
  shortDescription: string;
  fullDescription?: PortableTextBlock[] | string;
  icon?: string;
  image?: SanityImage | string;
  processSteps?: { title: string; description: string }[];
  techStack?: string[];
  relatedProjects?: Project[];
  seoTitle?: string;
  seoDescription?: string;
};

export type TeamMember = {
  _id: string;
  _type: "teamMember";
  name: string;
  role: string;
  photo?: SanityImage | string;
  bio?: string;
  social?: { platform: string; url: string }[];
};

export type FormSubmissionPayload = {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budget: string;
  timeline: string;
  details: string;
  source?: string;
};
