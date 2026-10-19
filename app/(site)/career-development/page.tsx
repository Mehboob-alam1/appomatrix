import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { Chip } from "@/components/site/ui";
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
      <Container className="grid gap-8 py-7 lg:grid-cols-12 lg:py-9">
        <div className="lg:col-span-4">{copy.body ? <Prose text={copy.body} className="text-sm text-muted-foreground" /> : null}</div>
        <div className="grid gap-3 lg:col-span-8">
          {careers.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border bg-card p-6 text-muted-foreground">
              No openings are published right now. Send a note through Contact Us and we will keep it on file.
            </p>
          ) : (
            careers.map((career) => (
              <Link
                key={career.id}
                href={`/career-development/${career.slug}`}
                className="card-lift group grid gap-3 rounded-xl border border-border bg-card p-5 md:grid-cols-12 md:items-start"
              >
                <div className="md:col-span-3">
                  <Chip className="bg-primary-50 text-primary">{career.kind}</Chip>
                  <p className="mt-2 text-sm text-muted-foreground">{career.location}</p>
                </div>
                <div className="md:col-span-8">
                  <h2 className="text-xl font-semibold group-hover:text-primary">{career.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{richTextPlain(career.summary)}</p>
                  {career.deadline ? (
                    <p className="mt-3 text-xs font-medium text-muted-foreground">Apply by {formatDate(career.deadline)}</p>
                  ) : null}
                </div>
                <ArrowUpRight className="hidden size-5 text-primary md:col-span-1 md:block md:justify-self-end" />
              </Link>
            ))
          )}
        </div>
      </Container>
    </>
  );
}
