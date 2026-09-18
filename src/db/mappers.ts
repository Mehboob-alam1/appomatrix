import type {
  projects,
  posts,
  testimonials,
  services,
  teamMembers,
  formSubmissions,
} from "@/db/schema";
import type {
  BlogPost,
  FormSubmission,
  Project,
  Service,
  TeamMember,
  Testimonial,
} from "@/types/content";

type ProjectRow = typeof projects.$inferSelect;
type PostRow = typeof posts.$inferSelect;
type TestimonialRow = typeof testimonials.$inferSelect;
type ServiceRow = typeof services.$inferSelect;
type TeamRow = typeof teamMembers.$inferSelect;
type SubmissionRow = typeof formSubmissions.$inferSelect;

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function mapProject(row: ProjectRow): Project {
  return {
    _id: row.id,
    slug: row.slug,
    title: row.title,
    clientName: row.clientName,
    category: row.category,
    excerpt: row.excerpt ?? undefined,
    coverImage: row.coverImage ?? undefined,
    coverImageAlt: row.coverImageAlt ?? undefined,
    gallery: parseJson(row.gallery, [] as { url: string; alt: string }[]),
    problem: row.problem ?? undefined,
    solution: row.solution ?? undefined,
    result: row.result ?? undefined,
    metrics: parseJson(row.metrics, [] as { label: string; value: string }[]),
    techStack: parseJson(row.techStack, [] as string[]),
    externalLink: row.externalLink ?? undefined,
    featured: row.featured ?? false,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
  };
}

export function mapPost(row: PostRow): BlogPost {
  return {
    _id: row.id,
    slug: row.slug,
    title: row.title,
    locale: row.locale ?? undefined,
    excerpt: row.excerpt,
    content: row.content ?? undefined,
    featuredImage: row.featuredImage ?? undefined,
    featuredImageAlt: row.featuredImageAlt ?? undefined,
    author: row.author ?? undefined,
    category: row.category,
    publishedAt: row.publishedAt,
    readingTimeMinutes: row.readingTimeMinutes ?? undefined,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
  };
}

export function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    _id: row.id,
    clientName: row.clientName,
    role: row.role,
    company: row.company,
    quote: row.quote,
    photo: row.photo ?? undefined,
    photoAlt: row.photoAlt ?? undefined,
    rating: row.rating ?? undefined,
  };
}

export function mapService(row: ServiceRow, relatedProjects: Project[] = []): Service {
  return {
    _id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.shortDescription,
    fullDescription: row.fullDescription ?? undefined,
    icon: row.icon ?? undefined,
    image: row.image ?? undefined,
    imageAlt: row.imageAlt ?? undefined,
    processSteps: parseJson(row.processSteps, [] as { title: string; description: string }[]),
    techStack: parseJson(row.techStack, [] as string[]),
    relatedProjects,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
  };
}

export function mapTeamMember(row: TeamRow): TeamMember {
  return {
    _id: row.id,
    name: row.name,
    role: row.role,
    photo: row.photo ?? undefined,
    photoAlt: row.photoAlt ?? undefined,
    bio: row.bio ?? undefined,
    social: parseJson(row.social, [] as { platform: string; url: string }[]),
  };
}

export function mapSubmission(row: SubmissionRow): FormSubmission {
  return {
    _id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    projectType: row.projectType,
    budget: row.budget,
    timeline: row.timeline,
    details: row.details,
    source: row.source ?? undefined,
    submittedAt: row.submittedAt,
  };
}
