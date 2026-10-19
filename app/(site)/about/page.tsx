import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { SafeImage } from "@/components/site/safe-image";
import { SectionHeader, StatItem } from "@/components/site/ui";
import { parsePairs, parseStats } from "@/lib/format";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { getPageMeta, getSettings, listTeam } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/about", {
    title: "About Us",
    description: "Appo Matrix is a software studio in Gilgit-Baltistan working with clients worldwide.",
  });
}

export default async function AboutPage() {
  const settings = await getSettings();
  const seed = pageSeed("/about");
  const copy = pageIntro(await getPageMeta("/about"), {
    kicker: seed?.kicker || "About Us",
    heading: settings.aboutHeadline,
    lead: settings.aboutSecondary,
    body: settings.aboutBody,
    secondaryTitle: seed?.secondaryTitle || "Who you will meet",
  });
  const stats = parseStats(settings.statsText);
  const principles = parsePairs(settings.principlesText);
  const team = await listTeam(true);

  return (
    <>
      <PageHero kicker={copy.kicker} title={copy.heading} lead={copy.lead} image={copy.image} imageAlt={copy.imageAlt} />
      <Container className="grid gap-8 py-7 lg:grid-cols-12 lg:py-9">
        <Prose text={copy.body} className="lg:col-span-7" />
        <div className="grid grid-cols-2 gap-3 lg:col-span-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
              <StatItem value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>
      </Container>
      {principles.length > 0 ? (
        <section className="border-y border-border">
          <Container className="section-pad">
            <SectionHeader eyebrow="Values" title="How we work" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {principles.map((item, index) => (
                <article key={item.title} className="rounded-xl border border-border bg-background p-4">
                  <p className="text-xs font-semibold text-primary">{String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
      <Container className="section-pad">
        <SectionHeader eyebrow="Team" title={copy.secondaryTitle} href="/team" linkLabel="Full team" />
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((person) => (
            <article key={person.id} className="overflow-hidden rounded-xl border border-border bg-card">
              {person.photo ? (
                <div className="media-card rounded-none border-0">
                  <SafeImage src={person.photo} alt={person.photoAlt || person.name} className="aspect-[4/5] w-full object-cover" />
                </div>
              ) : (
                <div className="grid aspect-[4/5] place-items-center bg-muted text-4xl font-semibold text-muted-foreground">
                  {person.name.slice(0, 1)}
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold">{person.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{person.role}</p>
              </div>
            </article>
          ))}
        </div>
        <Link href="/contact" className="mt-8 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary">
          Start a conversation <ArrowUpRight className="size-4" />
        </Link>
      </Container>
    </>
  );
}
