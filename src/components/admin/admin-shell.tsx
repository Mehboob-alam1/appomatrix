import Link from "next/link";
import { logoutAdmin } from "@/lib/admin/logout-action";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/seo", label: "SEO center" },
  { href: "/admin/projects", label: "Case studies" },
  { href: "/admin/posts", label: "Blog posts" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/submissions", label: "Leads" },
  { href: "/admin/settings", label: "Site settings" },
];

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100">
      <header className="border-b border-white/10 bg-[#0a1020]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-sky-400/90">
              Appo Matrix CMS
            </p>
            <h1 className="font-display text-xl font-semibold tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/admin/seo"
              className="hidden rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-sky-200 sm:inline"
            >
              SEO tools
            </Link>
            <Link href="/" className="text-slate-300 hover:text-white">
              View site
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-full border border-white/15 px-3 py-1 text-slate-300 hover:bg-white/5"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[240px_1fr]">
        <nav className="space-y-1 text-sm lg:sticky lg:top-6 lg:self-start">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-xl px-3 py-2.5 text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
