import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { getProjects } from "@/lib/data";
import { deleteProject } from "@/lib/admin/actions";

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <AdminShell title="Case studies">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-400">{projects.length} projects</p>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white"
        >
          Add project
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} className="border-t border-white/10">
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3 text-slate-400">{p.category}</td>
                <td className="px-4 py-3">{p.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/projects/${p._id}`} className="text-blue-300 hover:underline">
                    Edit
                  </Link>
                  <form action={deleteProject.bind(null, p._id)} className="ml-3 inline">
                    <button type="submit" className="text-red-300 hover:underline">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
