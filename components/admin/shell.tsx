"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/actions";
import { csrfTokenFromDocument } from "@/lib/csrf-client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/navigation", label: "Navigation" },
  { href: "/admin/social", label: "Social links" },
  { href: "/admin/sections", label: "Homepage" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/portfolio", label: "Portfolio" },
  { href: "/admin/categories", label: "Blog categories" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/careers", label: "Career development" },
  { href: "/admin/scholarships", label: "Scholarships" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/inquiries", label: "CRM inquiries" },
];

export function AdminShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-muted/50 md:grid md:grid-cols-[230px_1fr]">
      <aside className="border-b border-border bg-card md:min-h-screen md:border-r md:border-b-0">
        <div className="px-4 py-4">
          <Link href="/admin" className="font-display text-xl tracking-tight">
            Studio
          </Link>
          <p className="text-xs text-muted-foreground">Appo Matrix CMS</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:px-2">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "shrink-0 rounded-lg px-3 py-2 text-sm whitespace-nowrap",
                  active ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button type="button" className="hidden px-5 pb-4 text-sm text-muted-foreground hover:text-foreground md:block" onClick={() => logout(csrfTokenFromDocument())}>
          Sign out
        </button>
      </aside>
      <div>
        <header className="flex flex-col gap-3 border-b border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl tracking-tight">{title}</h1>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-primary">
              View site
            </Link>
            <button type="button" className="text-sm text-muted-foreground md:hidden" onClick={() => logout(csrfTokenFromDocument())}>
              Sign out
            </button>
          </div>
        </header>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
