import {
  getCareer,
  getCategory,
  getPageMeta,
  getPost,
  getProject,
  getScholarship,
  getSection,
  getService,
  getSettings,
  listCareers,
  listCategories,
  listNavigation,
  listPageMeta,
  listPosts,
  listProjects,
  listScholarships,
  listSections,
  listServices,
  listSocial,
  listTeam,
  listTestimonials,
  serviceTree,
} from "@/lib/queries";

const ALIASES: Record<string, string> = {
  portfolio: "projects",
  blog: "posts",
};

export function canonicalResource(resource: string) {
  return ALIASES[resource] || resource;
}

export async function publicCollection(resource: string, category = "") {
  switch (canonicalResource(resource)) {
    case "services":
      return serviceTree(true);
    case "projects":
      return listProjects(true);
    case "posts":
      return listPosts(true, category);
    case "categories":
      return listCategories(true);
    case "team":
      return listTeam(true);
    case "testimonials":
      return listTestimonials(true);
    case "careers":
      return listCareers(true);
    case "scholarships":
      return listScholarships(true);
    case "navigation":
      return listNavigation(true);
    case "social":
      return listSocial(true);
    case "sections":
      return listSections(true);
    case "pages":
      return listPageMeta(true);
    case "settings":
      return getSettings();
    default:
      return undefined;
  }
}

export async function publicItem(resource: string, slug: string) {
  switch (canonicalResource(resource)) {
    case "services":
      return getService(slug, true);
    case "projects":
      return getProject(slug);
    case "posts":
      return getPost(slug);
    case "categories":
      return getCategory(slug);
    case "careers":
      return getCareer(slug);
    case "scholarships":
      return getScholarship(slug);
    case "sections":
      return getSection(slug, true);
    case "pages":
      return getPageMeta(slug.startsWith("/") ? slug : `/${slug}`);
    default:
      return undefined;
  }
}

export async function adminCollection(resource: string) {
  switch (canonicalResource(resource)) {
    case "services":
      return listServices(false);
    case "projects":
      return listProjects(false);
    case "posts":
      return listPosts(false);
    case "categories":
      return listCategories(false);
    case "team":
      return listTeam(false);
    case "testimonials":
      return listTestimonials(false);
    case "careers":
      return listCareers(false);
    case "scholarships":
      return listScholarships(false);
    case "navigation":
      return listNavigation(false);
    case "social":
      return listSocial(false);
    case "sections":
      return listSections(false);
    case "pages":
      return listPageMeta(false);
    default:
      return undefined;
  }
}
