import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { getTeam } from "@/lib/data";
import { deleteTeamMember } from "@/lib/admin/actions";

export default async function AdminTeamPage() {
  const team = await getTeam();

  return (
    <AdminShell title="Team">
      <Link href="/admin/team/new" className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium">
        Add member
      </Link>
      <ul className="mt-6 space-y-3">
        {team.map((m) => (
          <li key={m._id} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
            <span>
              {m.name} <span className="text-slate-400">· {m.role}</span>
            </span>
            <div className="text-sm">
              <Link href={`/admin/team/${m._id}`} className="text-blue-300 hover:underline">
                Edit
              </Link>
              <form action={deleteTeamMember.bind(null, m._id)} className="ml-3 inline">
                <button type="submit" className="text-red-300 hover:underline">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
