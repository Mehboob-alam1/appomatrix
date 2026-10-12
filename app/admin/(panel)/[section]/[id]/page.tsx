import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { ContentForm } from "@/components/admin/content-form";
import { getRecord, isSection, listServices, recordToForm } from "@/lib/queries";

const TITLES: Record<string, string> = {
  services: "service",
  portfolio: "portfolio item",
  blog: "post",
  team: "team member",
  testimonials: "testimonial",
  careers: "opening",
  scholarships: "scholarship",
};

export default async function EditorPage({
  params,
}: {
  params: Promise<{ section: string; id: string }>;
}) {
  const { section, id } = await params;
  if (!isSection(section) || section === "inquiries") notFound();
  const record = id === "new" ? undefined : getRecord(section, id);
  if (id !== "new" && !record) notFound();
  const values = record ? recordToForm(section, record) : {};
  const parents =
    section === "services"
      ? listServices(false)
          .filter((service) => !service.parentId)
          .map((service) => ({ id: service.id, title: service.title }))
      : [];
  const noun = TITLES[section];

  return (
    <AdminShell title={id === "new" ? `New ${noun}` : `Edit ${noun}`}>
      <ContentForm section={section} values={values} parents={parents} />
    </AdminShell>
  );
}
