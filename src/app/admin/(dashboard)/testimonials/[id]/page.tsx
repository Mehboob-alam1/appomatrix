import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-form-styles";
import { saveTestimonial } from "@/lib/admin/actions";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { mapTestimonial } from "@/db/mappers";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminTestimonialEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";
  let item = null;
  if (!isNew) {
    const row = getDb().select().from(schema.testimonials).where(eq(schema.testimonials.id, id)).get();
    item = row ? mapTestimonial(row) : null;
    if (!item) notFound();
  }

  return (
    <AdminShell title={isNew ? "New testimonial" : "Edit testimonial"}>
      <form action={saveTestimonial} className="max-w-2xl space-y-4">
        <input type="hidden" name="id" value={isNew ? "" : item!._id} />
        <label className={adminLabelClass}>
          Client name
          <input name="clientName" required defaultValue={item?.clientName ?? ""} className={adminInputClass} />
        </label>
        <label className={adminLabelClass}>
          Role
          <input name="role" required defaultValue={item?.role ?? ""} className={adminInputClass} />
        </label>
        <label className={adminLabelClass}>
          Company
          <input name="company" required defaultValue={item?.company ?? ""} className={adminInputClass} />
        </label>
        <label className={adminLabelClass}>
          Quote
          <textarea name="quote" required rows={4} defaultValue={item?.quote ?? ""} className={adminInputClass} />
        </label>
        <label className={adminLabelClass}>
          Rating (1-5)
          <input name="rating" type="number" min={1} max={5} defaultValue={item?.rating ?? 5} className={adminInputClass} />
        </label>
        <button type="submit" className="rounded-full bg-blue-500 px-5 py-2.5 text-sm font-medium">
          Save testimonial
        </button>
      </form>
    </AdminShell>
  );
}
