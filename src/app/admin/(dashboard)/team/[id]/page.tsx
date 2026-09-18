import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/admin-shell";
import { adminInputClass, adminLabelClass } from "@/components/admin/admin-form-styles";
import { saveTeamMember } from "@/lib/admin/actions";
import { getDb } from "@/db/client";
import * as schema from "@/db/schema";
import { mapTeamMember } from "@/db/mappers";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminTeamEditPage({ params }: PageProps) {
  const { id } = await params;
  const isNew = id === "new";
  let member = null;
  if (!isNew) {
    const row = getDb().select().from(schema.teamMembers).where(eq(schema.teamMembers.id, id)).get();
    member = row ? mapTeamMember(row) : null;
    if (!member) notFound();
  }

  return (
    <AdminShell title={isNew ? "New team member" : "Edit team member"}>
      <form action={saveTeamMember} className="max-w-2xl space-y-4">
        <input type="hidden" name="id" value={isNew ? "" : member!._id} />
        <label className={adminLabelClass}>
          Name
          <input name="name" required defaultValue={member?.name ?? ""} className={adminInputClass} />
        </label>
        <label className={adminLabelClass}>
          Role
          <input name="role" required defaultValue={member?.role ?? ""} className={adminInputClass} />
        </label>
        <label className={adminLabelClass}>
          Bio
          <textarea name="bio" rows={4} defaultValue={member?.bio ?? ""} className={adminInputClass} />
        </label>
        <label className={adminLabelClass}>
          Photo URL
          <input name="photo" defaultValue={member?.photo ?? ""} className={adminInputClass} />
        </label>
        <label className={adminLabelClass}>
          Photo alt
          <input name="photoAlt" defaultValue={member?.photoAlt ?? member?.name ?? ""} className={adminInputClass} />
        </label>
        <button type="submit" className="rounded-full bg-blue-500 px-5 py-2.5 text-sm font-medium">
          Save member
        </button>
      </form>
    </AdminShell>
  );
}
