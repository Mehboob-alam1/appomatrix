import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";

const sections = [
  { href: "/admin/seo", label: "SEO center", desc: "Scores, issues, and meta previews across pages" },
  { href: "/admin/settings", label: "Site settings", desc: "Head/body scripts, ads, announcement bar" },
  { href: "/admin/projects", label: "Case studies", desc: "Portfolio projects and results" },
  { href: "/admin/posts", label: "Blog posts", desc: "Articles and SEO content" },
  { href: "/admin/services", label: "Services", desc: "Service pages and tech stacks" },
  { href: "/admin/testimonials", label: "Testimonials", desc: "Client quotes" },
  { href: "/admin/team", label: "Team", desc: "About page team members" },
  { href: "/admin/submissions", label: "Form submissions", desc: "Contact & newsletter leads" },
];

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <p className="text-sm text-slate-400">
        All content is stored locally in <code className="text-slate-200">data/cms.sqlite</code>.
        Upload images to <code className="text-slate-200">public/uploads</code> via URL fields or the
        upload API while logged in.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border border-white/10 bg-white/5 p-4 hover:border-blue-400/40"
          >
            <p className="font-medium">{section.label}</p>
            <p className="mt-1 text-sm text-slate-400">{section.desc}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
