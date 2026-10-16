import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { InquiryTable } from "@/components/admin/inquiry-table";
import { RecordActions } from "@/components/admin/record-actions";
import {
  isSection,
  listCareers,
  listCategories,
  listInquiries,
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
  type SectionKey,
} from "@/lib/queries";

const META: Record<SectionKey, { title: string; description: string; columns: string[] }> = {
  services: {
    title: "Services",
    description: "Top-level groups appear in the Services menu. Nested services expand underneath them.",
    columns: ["Title", "Group", "Status"],
  },
  portfolio: {
    title: "Portfolio",
    description: "Products with cover images, a gallery, written case notes, and a live backlink.",
    columns: ["Title", "Client", "Status"],
  },
  blog: {
    title: "Blog",
    description: "Posts with a rich text editor, featured image, and category.",
    columns: ["Title", "Category", "Status"],
  },
  team: {
    title: "Team",
    description: "Upload portraits and edit bios with headings, lists, and highlight.",
    columns: ["Name", "Role", "Status"],
  },
  testimonials: {
    title: "Testimonials",
    description: "Quotes on the homepage.",
    columns: ["Client", "Company", "Status"],
  },
  careers: {
    title: "Career development",
    description: "Roles, internships, and programs.",
    columns: ["Title", "Kind", "Status"],
  },
  scholarships: {
    title: "Scholarships",
    description: "Awards and fellowships.",
    columns: ["Title", "Award", "Status"],
  },
  inquiries: {
    title: "CRM inquiries",
    description: "Messages from Contact Us, career applications, and scholarship notes. Use Reply by email to answer in your mail app, then track status here.",
    columns: [],
  },
  categories: {
    title: "Blog categories",
    description: "Categories used by posts and the public blog filter.",
    columns: ["Name", "Slug", "Status"],
  },
  navigation: {
    title: "Navigation",
    description: "Header links, the header button, and footer links. The Services menu still comes from published services.",
    columns: ["Label", "Placement", "Status"],
  },
  social: {
    title: "Social links",
    description: "Profiles shown in the footer and structured data.",
    columns: ["Label", "URL", "Status"],
  },
  sections: {
    title: "Homepage sections",
    description: "Headings, extra copy, images, buttons, and visibility for the homepage blocks. Unpublish a section to hide it.",
    columns: ["Section", "Title", "Status"],
  },
  pages: {
    title: "Pages",
    description: "Edit the heading, introduction, extra copy, and image for each public page. Individual services, projects, posts, people, careers, and scholarships are edited in their own sections.",
    columns: ["Path", "Heading", "Status"],
  },
};

async function rows(section: SectionKey) {
  const state = (published: boolean) => (published ? "Published" : "Draft");
  if (section === "services") {
    const services = await listServices(false);
    const name = (id: string | null) => services.find((item) => item.id === id)?.title || "Top level";
    return services.map((item) => ({ id: item.id, label: item.title, published: item.published, cells: [item.title, name(item.parentId), state(item.published)] }));
  }
  if (section === "portfolio") {
    return (await listProjects(false)).map((item) => ({ id: item.id, label: item.title, published: item.published, cells: [item.title, item.clientName, state(item.published)] }));
  }
  if (section === "blog") {
    return (await listPosts(false)).map((item) => ({ id: item.id, label: item.title, published: item.published, cells: [item.title, item.category, state(item.published)] }));
  }
  if (section === "categories") {
    return (await listCategories(false)).map((item) => ({ id: item.id, label: item.name, published: item.published, cells: [item.name, item.slug, state(item.published)] }));
  }
  if (section === "team") {
    return (await listTeam(false)).map((item) => ({ id: item.id, label: item.name, published: item.published, cells: [item.name, item.role, state(item.published)] }));
  }
  if (section === "testimonials") {
    return (await listTestimonials(false)).map((item) => ({ id: item.id, label: item.clientName, published: item.published, cells: [item.clientName, item.company, state(item.published)] }));
  }
  if (section === "careers") {
    return (await listCareers(false)).map((item) => ({ id: item.id, label: item.title, published: item.published, cells: [item.title, item.kind, state(item.published)] }));
  }
  if (section === "scholarships") {
    return (await listScholarships(false)).map((item) => ({ id: item.id, label: item.title, published: item.published, cells: [item.title, item.award, state(item.published)] }));
  }
  if (section === "navigation") {
    return (await listNavigation(false)).map((item) => ({ id: item.id, label: item.label, published: item.published, cells: [item.label, item.location, state(item.published)] }));
  }
  if (section === "social") {
    return (await listSocial(false)).map((item) => ({ id: item.id, label: item.label, published: item.published, cells: [item.label, item.url, state(item.published)] }));
  }
  if (section === "sections") {
    return (await listSections(false)).map((item) => ({ id: item.id, label: item.title || item.sectionKey, published: item.published, cells: [item.sectionKey, item.title, state(item.published)] }));
  }
  if (section === "pages") {
    return (await listPageMeta(false)).map((item) => ({ id: item.id, label: item.path, published: item.published, cells: [item.path, item.heading || item.title, state(item.published)] }));
  }
  return [];
}

export default async function SectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { section } = await params;
  const { saved } = await searchParams;
  if (!isSection(section)) notFound();
  const meta = META[section];
  const items = section === "inquiries" ? [] : await rows(section);

  return (
    <AdminShell title={meta.title} description={meta.description}>
      {section === "inquiries" ? (
        <InquiryTable inquiries={await listInquiries()} />
      ) : (
        <>
          {saved ? <p className="mb-4 text-sm text-primary" role="status">Saved.</p> : null}
          <div className="mb-4">
            <Link href={`/admin/${section}/new`} className="inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground">
              Add new
            </Link>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[36rem] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  {meta.columns.map((column) => (
                    <th key={column} className="px-4 py-3 font-medium">{column}</th>
                  ))}
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    {row.cells.map((cell, index) => (
                      <td key={`${row.id}-${index}`} className="px-4 py-3">{cell}</td>
                    ))}
                    <td className="px-4 py-3">
                      <RecordActions section={section} id={row.id} label={row.label} published={row.published} />
                    </td>
                  </tr>
                ))}
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={meta.columns.length + 1} className="px-4 py-8 text-muted-foreground">
                      Nothing here yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
