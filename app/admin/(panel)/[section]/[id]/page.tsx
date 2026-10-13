import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/shell";
import { ContentForm } from "@/components/admin/content-form";
import { pageSeed } from "@/lib/page-copy";
import { getRecord, getSettings, isSection, listCategories, listServices, recordToForm } from "@/lib/queries";

const TITLES: Record<string, string> = {
  services: "service",
  portfolio: "portfolio item",
  blog: "post",
  categories: "category",
  team: "team member",
  testimonials: "testimonial",
  careers: "opening",
  scholarships: "scholarship",
  navigation: "navigation link",
  social: "social link",
  sections: "homepage section",
  pages: "page",
};

export default async function EditorPage({
  params,
}: {
  params: Promise<{ section: string; id: string }>;
}) {
  const { section, id } = await params;
  if (!isSection(section) || section === "inquiries") notFound();
  const record = id === "new" ? undefined : await getRecord(section, id);
  if (id !== "new" && !record) notFound();
  const values = record ? recordToForm(section, record) : {};
  if (section === "pages") {
    const path = values.path || "";
    const seed = pageSeed(path);
    if (path === "/about") {
      const settings = await getSettings();
      if (!values.kicker) values.kicker = "About Us";
      if (!values.heading) values.heading = settings.aboutHeadline;
      if (!values.lead) values.lead = settings.aboutSecondary;
      if (!values.body) values.body = settings.aboutBody;
      if (!values.secondaryTitle) values.secondaryTitle = seed?.secondaryTitle || "Who you will meet";
    } else if (seed) {
      if (!values.kicker) values.kicker = seed.kicker;
      if (!values.heading) values.heading = seed.heading;
      if (!values.lead) values.lead = seed.lead;
      if (!values.body) values.body = seed.body;
      if (!values.secondaryTitle) values.secondaryTitle = seed.secondaryTitle;
    }
  }
  const categories = section === "blog" ? await listCategories(false) : [];
  if (!values.categoryId && values.category) {
    values.categoryId = categories.find((category) => category.name === values.category)?.id || "";
  }
  const parents =
    section === "services"
      ? (await listServices(false))
          .filter((service) => !service.parentId)
          .map((service) => ({ id: service.id, title: service.title }))
      : [];
  const noun = TITLES[section];

  return (
    <AdminShell title={id === "new" ? `New ${noun}` : `Edit ${noun}`}>
      <ContentForm section={section} values={values} parents={parents} categories={categories.map((category) => ({ id: category.id, name: category.name }))} />
    </AdminShell>
  );
}
