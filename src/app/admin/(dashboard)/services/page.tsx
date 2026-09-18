import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { getServices } from "@/lib/data";
import { deleteService } from "@/lib/admin/actions";

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <AdminShell title="Services">
      <Link href="/admin/services/new" className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium">
        Add service
      </Link>
      <ul className="mt-6 space-y-3">
        {services.map((s) => (
          <li key={s._id} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
            <span>{s.title}</span>
            <div className="text-sm">
              <Link href={`/admin/services/${s._id}`} className="text-blue-300 hover:underline">
                Edit
              </Link>
              <form action={deleteService.bind(null, s._id)} className="ml-3 inline">
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
