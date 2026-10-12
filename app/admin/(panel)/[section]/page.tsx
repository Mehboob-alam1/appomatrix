import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { DeleteButton } from "@/components/admin/delete-button";
import { InquiryTable } from "@/components/admin/inquiry-table";
import {
  isSection,
  listCareers,
  listInquiries,
  listPosts,
  listProjects,
  listScholarships,
  listServices,
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
    description: "Posts on the public blog and the homepage.",
    columns: ["Title", "Category", "Status"],
  },
  team: {
    title: "Team",
    description: "People shown on the team and about pages.",
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
    description: "Messages from Contact Us, career applications, and scholarship notes.",
    columns: [],
  },
};

function rows(section: SectionKey) {
  const state = (published: boolean) => (published ? "Published" : "Draft");
  if (section === "services") {
    const services = listServices(false);
    const name = (id: string | null) => services.find((item) => item.id === id)?.title || "Top level";
    return services.map((item) => ({ id: item.id, label: item.title, cells: [item.title, name(item.parentId), state(item.published)] }));
  }
  if (section === "portfolio") {
    return listProjects(false).map((item) => ({ id: item.id, label: item.title, cells: [item.title, item.clientName, state(item.published)] }));
  }
  if (section === "blog") {
    return listPosts(false).map((item) => ({ id: item.id, label: item.title, cells: [item.title, item.category, state(item.published)] }));
  }
  if (section === "team") {
    return listTeam(false).map((item) => ({ id: item.id, label: item.name, cells: [item.name, item.role, state(item.published)] }));
  }
  if (section === "testimonials") {
    return listTestimonials(false).map((item) => ({ id: item.id, label: item.clientName, cells: [item.clientName, item.company, state(item.published)] }));
  }
  if (section === "careers") {
    return listCareers(false).map((item) => ({ id: item.id, label: item.title, cells: [item.title, item.kind, state(item.published)] }));
  }
  if (section === "scholarships") {
    return listScholarships(false).map((item) => ({ id: item.id, label: item.title, cells: [item.title, item.award, state(item.published)] }));
  }
  return [];
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  const meta = META[section];
  const items = section === "inquiries" ? [] : rows(section);

  return (
    <AdminShell title={meta.title} description={meta.description}>
      {section === "inquiries" ? (
        <InquiryTable inquiries={listInquiries()} />
      ) : (
        <>
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
                      <div className="flex gap-2">
                        <Link href={`/admin/${section}/${row.id}`} className="inline-flex h-7 items-center rounded-lg border border-border px-2 text-xs">
                          Edit
                        </Link>
                        <DeleteButton section={section} id={row.id} label={row.label} />
                      </div>
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
