import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { SafeImage } from "@/components/site/safe-image";
import { CtaBand, GradientText, SectionHeader, SiteLinkButton, StatItem } from "@/components/site/ui";
import { parsePairs, parseStats } from "@/lib/format";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { getPageMeta, getSettings, listTeam } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/about", {
    title: "About — A Global Team Building What's Next",
    description:
      "Appo Matrix is a fast-moving software studio in Gilgit-Baltistan designing and shipping AI-powered products for teams worldwide.",
  });
}

export default async function AboutPage() {
  const settings = await getSettings();
  const seed = pageSeed("/about");
  const copy = pageIntro(await getPageMeta("/about"), {
    kicker: seed?.kicker || "About",
    heading: settings.aboutHeadline || "A global team building what's next.",
    lead:
      settings.aboutSecondary ||
      "We are a fast-moving, quality-focused engineering partner — from first concept to live product.",
    body: settings.aboutBody,
    secondaryTitle: seed?.secondaryTitle || "Who you will meet",
  });
  const stats = parseStats(settings.statsText);
  const principles = parsePairs(settings.principlesText);
  const team = await listTeam(true);

  return (
    <>
      <PageHero
        kicker={copy.kicker}
        title={copy.heading}
        lead={copy.lead}
        image={copy.image}
        imageAlt={copy.imageAlt}
        highlight="what's next"
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-400">Our story</p>
          <Prose text={copy.body} className="mt-4" />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:col-span-5 lg:content-start">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-4">
              <StatItem value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>
      </Container>
      {principles.length > 0 ? (
        <section className="border-y border-border bg-secondary/30">
          <Container className="section-pad">
            <SectionHeader
              eyebrow="Values"
              title={
                <>
                  How we <GradientText>work.</GradientText>
                </>
              }
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {principles.map((item, index) => (
                <article key={item.title} className="glass-card rounded-2xl p-5">
                  <p className="text-xs font-semibold text-primary-400">{String(index + 1).padStart(2, "0")}</p>
                  <h2 className="mt-2 text-lg font-semibold">{item.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
      {team.length > 0 ? (
        <Container className="section-pad">
          <SectionHeader eyebrow="Team" title={copy.secondaryTitle} href="/team" linkLabel="Full team" />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((person) => (
              <article key={person.id} className="overflow-hidden rounded-2xl border border-border bg-card/50">
                {person.photo ? (
                  <div className="media-card rounded-none border-0">
                    <SafeImage
                      src={person.photo}
                      alt={person.photoAlt || person.name}
                      className="aspect-[4/5] w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="grid aspect-[4/5] place-items-center bg-muted text-4xl font-semibold text-muted-foreground">
                    {person.name.slice(0, 1)}
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold">{person.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary-400">{person.role}</p>
                </div>
              </article>
            ))}
          </div>
          <SiteLinkButton href="/contact" className="mt-10">
            Start a conversation <ArrowUpRight className="size-4" />
          </SiteLinkButton>
        </Container>
      ) : (
        <Container className="section-pad">
          <Link href="/contact" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary-400">
            Start a conversation <ArrowUpRight className="size-4" />
          </Link>
        </Container>
      )}
      <CtaBand
        title={
          <>
            Let&apos;s build what&apos;s <GradientText>next</GradientText> together.
          </>
        }
        description="From idea to live software — with clear scope and a delivery plan you can trust."
        primaryHref="/contact"
        primaryLabel="Build My Software"
        secondaryHref="/portfolio"
        secondaryLabel="Explore Our Work"
      />
    </>
  );
}
