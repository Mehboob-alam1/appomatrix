import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { getTestimonials } from "@/lib/data";
import { deleteTestimonial } from "@/lib/admin/actions";

export default async function AdminTestimonialsPage() {
  const items = await getTestimonials();

  return (
    <AdminShell title="Testimonials">
      <Link href="/admin/testimonials/new" className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium">
        Add testimonial
      </Link>
      <ul className="mt-6 space-y-3">
        {items.map((t) => (
          <li key={t._id} className="rounded-xl border border-white/10 px-4 py-3">
            <p className="text-sm text-slate-300 line-clamp-2">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-2 flex justify-between text-sm">
              <span>
                {t.clientName}, {t.company}
              </span>
              <div>
                <Link href={`/admin/testimonials/${t._id}`} className="text-blue-300 hover:underline">
                  Edit
                </Link>
                <form action={deleteTestimonial.bind(null, t._id)} className="ml-3 inline">
                  <button type="submit" className="text-red-300 hover:underline">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
