import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/admin-shell";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SeoFieldGroup } from "@/components/admin/seo-field-group";
import { SlugField } from "@/components/admin/slug-field";
import {
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-styles";
import { saveService } from "@/lib/admin/actions";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { mapService } from "@/db/mappers";

const FORM_ID = "edit-service-form";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminServiceEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";
  let service = null;
  if (!isNew) {
    const row = getDb().select().from(schema.services).where(eq(schema.services.id, id)).get();
    service = row ? mapService(row) : null;
    if (!service) notFound();
  }

  return (
    <AdminShell title={isNew ? "New service" : "Edit service"}>
      <form id={FORM_ID} action={saveService} className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <input type="hidden" name="id" value={isNew ? "" : service!._id} />

        <div className="space-y-6">
          <AdminFormSection title="Service overview">
            <label className={adminLabelClass}>
              Title
              <input name="title" required defaultValue={service?.title ?? ""} className={adminInputClass} />
            </label>
            <SlugField
              formId={FORM_ID}
              defaultSlug={service?.slug ?? ""}
              defaultTitle={service?.title ?? ""}
              pathPrefix="/services/"
            />
            <label className={adminLabelClass}>
              Short description (cards & meta fallback)
              <textarea
                name="shortDescription"
                required
                rows={3}
                defaultValue={service?.shortDescription ?? ""}
                className={adminTextareaClass}
              />
            </label>
            <RichTextEditor
              name="fullDescription"
              label="Full description"
              defaultValue={service?.fullDescription ?? ""}
              minHeight={280}
              hint="Explain outcomes, ideal client, and deliverables."
            />
            <label className={adminLabelClass}>
              Icon key
              <input name="icon" defaultValue={service?.icon ?? "globe"} className={adminInputClass} placeholder="globe, smartphone, layers, compass" />
            </label>
          </AdminFormSection>

          <AdminFormSection title="Process & stack">
            <label className={adminLabelClass}>
              Process steps (title line, blank line, description — repeat)
              <textarea
                name="processSteps"
                rows={6}
                defaultValue={
                  service?.processSteps?.map((s) => `${s.title}\n${s.description}`).join("\n\n") ?? ""
                }
                className={adminTextareaClass}
              />
            </label>
            <label className={adminLabelClass}>
              Tech stack (one per line)
              <textarea
                name="techStack"
                rows={3}
                defaultValue={service?.techStack?.join("\n") ?? ""}
                className={adminTextareaClass}
              />
            </label>
          </AdminFormSection>
        </div>

        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <SeoFieldGroup
            formId={FORM_ID}
            pathPrefix="/services/"
            defaultSeoTitle={service?.seoTitle ?? ""}
            defaultSeoDescription={service?.seoDescription ?? ""}
            defaultSlug={service?.slug ?? ""}
            defaultPageTitle={service?.title ?? ""}
          />
          <button type="submit" className={adminPrimaryButtonClass}>
            Save service
          </button>
        </div>
      </form>
    </AdminShell>
  );
}
