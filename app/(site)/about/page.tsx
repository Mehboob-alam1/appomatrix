import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Kicker, PageHero, Prose } from "@/components/site/chrome";
import { parsePairs, parseStats } from "@/lib/format";
import { getSettings, listTeam } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description: "Appo Matrix is a software studio in Gilgit-Baltistan working with clients worldwide.",
  path: "/about",
});

export default function AboutPage() {
  const settings = getSettings();
  const stats = parseStats(settings.statsText);
  const principles = parsePairs(settings.principlesText);
  const team = listTeam(true);

  return (
    <>
      <PageHero kicker="About Us" title={settings.aboutHeadline} lead={settings.aboutSecondary} />
      <Container className="grid gap-12 py-16 lg:grid-cols-12">
        <Prose text={settings.aboutBody} className="lg:col-span-7" />
        <div className="grid grid-cols-2 border-t border-black/10 lg:col-span-5">
          {stats.map((stat) => (
            <div key={stat.label} className="border-b border-black/10 py-5 pr-4">
              <p className="font-display text-4xl">{stat.value}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-black/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
      <Container className="border-t border-black/10">
        <div className="divide-y divide-black/10">
          {principles.map((item, index) => (
            <article key={item.title} className="grid gap-3 py-8 md:grid-cols-12">
              <p className="font-mono text-xs text-brand md:col-span-2">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="font-display text-3xl md:col-span-4">{item.title}</h2>
              <p className="text-sm leading-relaxed text-black/60 md:col-span-6">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
      <Container className="py-16">
        <div className="flex items-end justify-between">
          <div>
            <Kicker>Team</Kicker>
            <h2 className="font-display mt-3 text-4xl">Who you will meet</h2>
          </div>
          <Link href="/team" className="inline-flex items-center gap-1 text-sm">
            Full team <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((person) => (
            <article key={person.id}>
              {person.photo ? (
                <div className="media-card">
                  <img src={person.photo} alt={person.photoAlt || person.name} className="aspect-[4/5] w-full object-cover" />
                </div>
              ) : null}
              <h3 className="mt-4 text-lg">{person.name}</h3>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{person.role}</p>
            </article>
          ))}
        </div>
      </Container>
    </>
  );
}
