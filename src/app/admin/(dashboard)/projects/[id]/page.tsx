import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ImageSeoField } from "@/components/admin/image-seo-field";
import { SeoFieldGroup } from "@/components/admin/seo-field-group";
import { SlugField } from "@/components/admin/slug-field";
import {
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-styles";
import { saveProject } from "@/lib/admin/actions";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { mapProject } from "@/db/mappers";

const FORM_ID = "edit-project-form";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminProjectEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";

  let project = null;
  if (!isNew) {
    const row = getDb().select().from(schema.projects).where(eq(schema.projects.id, id)).get();
    project = row ? mapProject(row) : null;
    if (!project) notFound();
  }

  return (
    <AdminShell title={isNew ? "New case study" : "Edit case study"}>
      <form id={FORM_ID} action={saveProject} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <input type="hidden" name="id" value={isNew ? "" : project!._id} />

        <div className="space-y-6">
          <AdminFormSection title="Basics" description="Client-facing title and taxonomy.">
            <label className={adminLabelClass}>
              Title
              <input name="title" required defaultValue={project?.title ?? ""} className={adminInputClass} />
            </label>
            <SlugField
              formId={FORM_ID}
              defaultSlug={project?.slug ?? ""}
              defaultTitle={project?.title ?? ""}
              pathPrefix="/work/"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={adminLabelClass}>
                Client name
                <input name="clientName" required defaultValue={project?.clientName ?? ""} className={adminInputClass} />
              </label>
              <label className={adminLabelClass}>
                Category
                <input name="category" required defaultValue={project?.category ?? ""} className={adminInputClass} placeholder="SaaS, Web, Mobile…" />
              </label>
            </div>
            <label className={adminLabelClass}>
              Card excerpt
              <textarea name="excerpt" rows={2} defaultValue={project?.excerpt ?? ""} className={adminTextareaClass} placeholder="One line result for grids and social fallback." />
            </label>
          </AdminFormSection>

          <AdminFormSection title="Media" description="Cover image powers hero, OG/Twitter, and listings.">
            <ImageSeoField
              label="Cover"
              urlName="coverImage"
              altName="coverImageAlt"
              urlDefault={project?.coverImage ?? ""}
              altDefault={project?.coverImageAlt ?? project?.title ?? ""}
            />
          </AdminFormSection>

          <AdminFormSection title="Story" description="Problem → Solution → Result structure for conversion.">
            <RichTextEditor name="problem" label="Problem" defaultValue={project?.problem ?? ""} minHeight={200} />
            <RichTextEditor name="solution" label="Solution" defaultValue={project?.solution ?? ""} minHeight={200} />
            <RichTextEditor name="result" label="Result" defaultValue={project?.result ?? ""} minHeight={200} />
          </AdminFormSection>

          <AdminFormSection title="Proof & tech">
            <label className={adminLabelClass}>
              Metrics (Label | Value per line)
              <textarea
                name="metrics"
                rows={3}
                defaultValue={project?.metrics?.map((m) => `${m.label} | ${m.value}`).join("\n") ?? ""}
                className={adminTextareaClass}
              />
            </label>
            <label className={adminLabelClass}>
              Tech stack (one per line)
              <textarea
                name="techStack"
                rows={3}
                defaultValue={project?.techStack?.join("\n") ?? ""}
                className={adminTextareaClass}
              />
            </label>
            <label className={adminLabelClass}>
              External link
              <input name="externalLink" defaultValue={project?.externalLink ?? ""} className={adminInputClass} />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" name="featured" defaultChecked={project?.featured} className="rounded" />
              Feature on homepage
            </label>
          </AdminFormSection>
        </div>

        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <SeoFieldGroup
            formId={FORM_ID}
            pathPrefix="/work/"
            defaultSeoTitle={project?.seoTitle ?? ""}
            defaultSeoDescription={project?.seoDescription ?? ""}
            defaultSlug={project?.slug ?? ""}
            defaultPageTitle={project?.title ?? ""}
          />
          <button type="submit" className={adminPrimaryButtonClass}>
            Save case study
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
