import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { Chip } from "@/components/site/ui";
import { formatDate } from "@/lib/format";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { richTextPlain } from "@/lib/rich-text";
import { getPageMeta, listScholarships } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/scholarships", {
    title: "Scholarships",
    description: "Scholarships and fellowships from Appo Matrix for students in Gilgit-Baltistan and beyond.",
  });
}

function closingSoon(deadline: string) {
  if (!deadline) return false;
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return false;
  const days = (date.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 21;
}

export default async function ScholarshipsPage() {
  const items = await listScholarships(true);
  const seed = pageSeed("/scholarships");
  const copy = pageIntro(await getPageMeta("/scholarships"), {
    kicker: seed?.kicker || "Scholarships",
    heading: seed?.heading || "Time and tuition for people already making things",
    lead: seed?.lead || "",
    body: seed?.body || "",
  });
  return (
    <>
      <PageHero kicker={copy.kicker} title={copy.heading} lead={copy.lead} image={copy.image} imageAlt={copy.imageAlt} />
      <Container className="section-pad">
        {copy.body ? <Prose text={copy.body} className="mb-8 max-w-2xl text-sm text-muted-foreground" /> : null}
        {items.length === 0 ? (
          <p className="text-muted-foreground">No scholarships are open right now. Check back, or write to us.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/scholarships/${item.slug}`}
                className="card-lift group overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="media-card rounded-none border-0">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={`${item.title} cover`} className="aspect-[16/10] w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="grid aspect-[16/10] place-items-center bg-muted text-3xl font-semibold text-muted-foreground">
                      {item.title.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    <Chip className="bg-primary-50 text-primary">
                      {item.deadline ? `Deadline ${formatDate(item.deadline)}` : "Open"}
                    </Chip>
                    {closingSoon(item.deadline) ? <Chip className="border-amber-300 bg-amber-50 text-amber-800">Closing soon</Chip> : null}
                  </div>
                  <h2 className="mt-3 text-xl font-semibold group-hover:text-primary">{item.title}</h2>
                  <p className="mt-2 text-sm font-medium">{item.award}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{richTextPlain(item.summary)}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Apply <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
