import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSeoAuditReport } from "@/lib/admin/seo-audit";

export default function AdminSeoPage() {
  const rows = getSeoAuditReport();
  const avg =
    rows.length > 0 ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 100;

  return (
    <AdminShell title="SEO center">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Pages tracked</p>
          <p className="mt-1 text-2xl font-semibold">{rows.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Average SEO score</p>
          <p className="mt-1 text-2xl font-semibold text-sky-300">{avg}/100</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-slate-400">Needs attention</p>
          <p className="mt-1 text-2xl font-semibold text-amber-300">
            {rows.filter((r) => r.score < 80).length}
          </p>
        </div>
      </div>

      <p className="mt-6 text-sm text-slate-400">
        Scores reflect meta title, description length, and slug. Edit any row to open the SEO
        sidebar on that content type.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Issues</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.type}-${row.id}`} className="border-t border-white/10">
                <td className="px-4 py-3 font-medium">{row.title}</td>
                <td className="px-4 py-3 capitalize text-slate-400">{row.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      row.score >= 80
                        ? "text-emerald-400"
                        : row.score >= 60
                          ? "text-amber-400"
                          : "text-red-400"
                    }
                  >
                    {row.score}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {row.issues.length ? row.issues.join(" · ") : "Looks good"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={row.editHref} className="text-sky-400 hover:underline">
                    Edit SEO
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
