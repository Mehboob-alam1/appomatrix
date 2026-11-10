import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { Chip, SectionHeader, SiteLinkButton } from "@/components/site/ui";
import { formatDate } from "@/lib/format";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { richTextPlain } from "@/lib/rich-text";
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

      {copy.body ? (
        <section className="border-b border-border">
          <Container className="grid items-start gap-6 py-8 lg:grid-cols-12 lg:py-10">
            <div className="lg:col-span-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-400">Overview</p>
              <h2 className="font-display mt-2 text-2xl">Why build with us</h2>
            </div>
            <div className="lg:col-span-8 lg:col-start-5">
              <Prose text={copy.body} className="prose-width text-sm text-muted-foreground md:text-base" />
            </div>
          </Container>
        </section>
      ) : null}

      <Container className="section-pad">
        <SectionHeader
          eyebrow="Opportunities"
          title="Open roles and programs"
          description="Content-driven listings — apply through Contact Us with the role in the topic."
        />
        <div className="mt-6 grid items-start gap-3">
          {careers.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card/40 p-5 text-sm text-muted-foreground">
              No openings are published right now. Send a note through Contact Us and we will keep it on file.
            </p>
          ) : (
            careers.map((career) => (
              <Link
                key={career.id}
                href={`/career-development/${career.slug}`}
                className="card-lift group grid items-start gap-3 rounded-2xl border border-border bg-card/50 p-4 sm:p-5 md:grid-cols-[8rem_1fr_auto]"
              >
                <div>
                  <Chip className="bg-primary/10 text-primary-300">{career.kind}</Chip>
                  <p className="mt-2 text-xs text-muted-foreground">{career.location}</p>
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold group-hover:text-primary-300">{career.title}</h2>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{richTextPlain(career.summary)}</p>
                  {career.deadline ? (
                    <p className="mt-2 text-xs font-medium text-muted-foreground">Apply by {formatDate(career.deadline)}</p>
                  ) : null}
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-400 md:pt-1">
                  View <ArrowUpRight className="size-4" />
                </span>
              </Link>
            ))
          )}
        </div>
        <SiteLinkButton href="/contact?topic=Career%20application" className="mt-6" variant="outline">
          Send an open application
        </SiteLinkButton>
      </Container>
    </>
  );
}
