import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { formatDate } from "@/lib/format";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { getPageMeta, listCareers } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/career-development", {
    title: "Career Development",
    description: "Roles, internships, and apprenticeship programs at Appo Matrix in Gilgit-Baltistan.",
  });
}

export default async function CareersPage() {
  const careers = await listCareers(true);
  const seed = pageSeed("/career-development");
  const copy = pageIntro(await getPageMeta("/career-development"), {
    kicker: seed?.kicker || "Career Development",
    heading: seed?.heading || "Serious work, without leaving the mountains",
    lead: seed?.lead || "",
    body: seed?.body || "",
  });
  return (
    <>
      <PageHero kicker={copy.kicker} title={copy.heading} lead={copy.lead} image={copy.image} imageAlt={copy.imageAlt} />
      <Container className="grid gap-10 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          {copy.body ? <Prose text={copy.body} /> : null}
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
