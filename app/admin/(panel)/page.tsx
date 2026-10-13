import Link from "next/link";
import { AdminShell } from "@/components/admin/shell";
import { dashboardCounts, listInquiries } from "@/lib/queries";
import { formatDate } from "@/lib/format";

const CARDS = [
  ["services", "Services", "/admin/services"],
  ["projects", "Portfolio", "/admin/portfolio"],
  ["posts", "Blog", "/admin/blog"],
  ["team", "Team", "/admin/team"],
  ["testimonials", "Testimonials", "/admin/testimonials"],
  ["careers", "Careers", "/admin/careers"],
  ["scholarships", "Scholarships", "/admin/scholarships"],
  ["categories", "Categories", "/admin/categories"],
  ["navigation", "Navigation", "/admin/navigation"],
  ["sections", "Homepage", "/admin/sections"],
  ["media", "Media", "/admin/media"],
  ["inquiries", "CRM inquiries", "/admin/inquiries"],
] as const;

export default async function DashboardPage() {
  const counts = await dashboardCounts();
  const recent = (await listInquiries()).slice(0, 5);
  return (
    <AdminShell
      title="Overview"
      description="Everything on the public site is edited here. New contact messages arrive in CRM."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map(([key, label, href]) => (
          <Link key={key} href={href} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-display mt-1 text-3xl">{counts[key]}</p>
            {key === "inquiries" && counts.newInquiries > 0 ? (
              <p className="text-xs text-primary">{counts.newInquiries} new</p>
            ) : null}
          </Link>
        ))}
      </div>
      <section className="mt-8">
        <h2 className="font-display text-2xl">Recent inquiries</h2>
        <div className="mt-3 space-y-2">
          {recent.length === 0 ? <p className="text-sm text-muted-foreground">No messages yet.</p> : null}
          {recent.map((inquiry) => (
            <Link key={inquiry.id} href="/admin/inquiries" className="block rounded-xl border border-border bg-card px-4 py-3">
              <span className="font-medium">{inquiry.name}</span>
              <span className="text-sm text-muted-foreground"> · {inquiry.topic || "General"} · {formatDate(inquiry.submittedAt)} · {inquiry.status}</span>
            </Link>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
