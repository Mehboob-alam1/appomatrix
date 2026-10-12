import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero } from "@/components/site/chrome";
import { formatDate } from "@/lib/format";
import { listCareers } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Career Development",
  description: "Roles, internships, and apprenticeship programs at Appo Matrix in Gilgit-Baltistan.",
  path: "/career-development",
});

export default function CareersPage() {
  const careers = listCareers(true);
  return (
    <>
      <PageHero
        kicker="Career Development"
        title="Serious work, without leaving the mountains"
        lead="Full-time roles, internships, and a delivery apprenticeship for people who want product engineering in Gilgit-Baltistan."
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-12">
        <div className="space-y-4 text-black/70 lg:col-span-4">
          <p>
            Training here is attached to client work. You will write, review, and ship with the same definition of done as the rest of the squad.
          </p>
          <p>
            Openings are edited from the admin studio. If nothing listed fits, write to us anyway — we keep a short list for the next cohort.
          </p>
        </div>
        <div className="border-t border-black/10 lg:col-span-8">
          {careers.length === 0 ? (
            <p className="border-b border-black/10 py-8 text-muted-foreground">
              No openings are published right now. Send a note through Contact Us and we will keep it on file.
            </p>
          ) : (
            careers.map((career) => (
              <Link key={career.id} href={`/career-development/${career.slug}`} className="group grid gap-3 border-b border-black/10 py-6 md:grid-cols-12 md:items-start">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand md:col-span-3">
                  {career.kind}
                  <span className="mt-1 block text-black/45">{career.location}</span>
                </p>
                <div className="md:col-span-8">
                  <h2 className="font-display text-3xl group-hover:text-brand">{career.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-black/60">{career.summary}</p>
                  {career.deadline ? (
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-black/40">Apply by {formatDate(career.deadline)}</p>
                  ) : null}
                </div>
                <ArrowUpRight className="hidden size-5 md:col-span-1 md:block md:justify-self-end" />
              </Link>
            ))
          )}
        </div>
      </Container>
    </>
  );
}
