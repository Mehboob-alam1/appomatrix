export const projectFields = `
  _id,
  _type,
  title,
  "slug": slug.current,
  clientName,
  category,
  excerpt,
  coverImage,
  gallery,
  problem,
  solution,
  result,
  metrics,
  techStack,
  externalLink,
  featured,
  seoTitle,
  seoDescription
`;

export const postFields = `
  _id,
  _type,
  title,
  "slug": slug.current,
  locale,
  excerpt,
  content,
  seoTitle,
  seoDescription,
  featuredImage,
  author,
  category,
  publishedAt,
  readingTimeMinutes
`;

export const allProjectsQuery = `*[_type == "project"] | order(_createdAt desc) { ${projectFields} }`;
export const featuredProjectsQuery = `*[_type == "project" && featured == true] | order(_createdAt desc)[0...4] { ${projectFields} }`;
export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug][0] { ${projectFields} }`;
export const projectsByCategoryQuery = `*[_type == "project" && category == $category] | order(_createdAt desc) { ${projectFields} }`;

export const allPostsQuery = `*[_type == "post"] | order(publishedAt desc) { ${postFields} }`;
export const latestPostsQuery = `*[_type == "post"] | order(publishedAt desc)[0...3] { ${postFields} }`;
export const postBySlugQuery = `*[_type == "post" && slug.current == $slug][0] { ${postFields} }`;

export const allTestimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc) {
  _id, _type, clientName, role, company, quote, photo, rating
}`;

export const allServicesQuery = `*[_type == "service"] | order(title asc) {
  _id, _type, title, "slug": slug.current, shortDescription, icon, image, techStack, seoTitle, seoDescription
}`;

export const serviceBySlugQuery = `*[_type == "service" && slug.current == $slug][0] {
  _id, _type, title, "slug": slug.current, shortDescription, fullDescription, icon, image,
  processSteps, techStack, seoTitle, seoDescription,
  "relatedProjects": relatedProjects[]-> { ${projectFields} }
}`;

export const allTeamQuery = `*[_type == "teamMember"] | order(name asc) {
  _id, _type, name, role, photo, bio, social
}`;
