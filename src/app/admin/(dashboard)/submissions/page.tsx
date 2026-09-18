import { AdminShell } from "@/components/admin/admin-shell";
import { getFormSubmissions } from "@/lib/data";

export default async function AdminSubmissionsPage() {
  const submissions = await getFormSubmissions();

  return (
    <AdminShell title="Form submissions">
      <div className="space-y-4">
        {submissions.length === 0 ? (
          <p className="text-sm text-slate-400">No submissions yet.</p>
        ) : (
          submissions.map((s) => (
            <article key={s._id} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <p className="font-medium">
                  {s.name} · {s.email}
                </p>
                <p className="text-slate-400">{new Date(s.submittedAt).toLocaleString()}</p>
              </div>
              <p className="mt-2 text-slate-300">
                {s.projectType} · {s.budget} · {s.timeline}
                {s.source ? ` · ${s.source}` : ""}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-slate-200">{s.details}</p>
            </article>
          ))
        )}
      </div>
    </AdminShell>
  );
}
