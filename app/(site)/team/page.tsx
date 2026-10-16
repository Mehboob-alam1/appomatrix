import type { Metadata } from "next";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { SafeImage } from "@/components/site/safe-image";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { getPageMeta, listTeam } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/team", {
    title: "Team",
    description: "The people who design and ship at Appo Matrix in Gilgit-Baltistan.",
  });
}

export default async function TeamPage() {
  const team = await listTeam(true);
  const seed = pageSeed("/team");
  const copy = pageIntro(await getPageMeta("/team"), {
    kicker: seed?.kicker || "Team",
    heading: seed?.heading || "The people on the squad",
    lead: seed?.lead || "",
    body: seed?.body || "",
  });
  return (
    <>
      <PageHero kicker={copy.kicker} title={copy.heading} lead={copy.lead} image={copy.image} imageAlt={copy.imageAlt} />
      {copy.body ? (
        <Container className="pt-12">
          <Prose text={copy.body} className="max-w-2xl" />
        </Container>
      ) : null}
      <Container className="grid gap-x-6 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {team.length === 0 ? <p className="text-muted-foreground">Team profiles will appear here once they are published.</p> : null}
        {team.map((person) => (
          <article key={person.id}>
            {person.photo ? (
              <div className="media-card">
                <SafeImage src={person.photo} alt={person.photoAlt || person.name} className="aspect-[4/5] w-full object-cover" />
              </div>
            ) : (
              <div className="grid aspect-[4/5] place-items-center bg-black font-display text-6xl text-white">{person.name.slice(0, 1)}</div>
            )}
            <h2 className="mt-4 text-xl tracking-tight">{person.name}</h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{person.role}</p>
            {person.bio ? <Prose text={person.bio} className="mt-2 text-sm" /> : null}
            {person.linkedin ? (
              <a href={person.linkedin} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm underline decoration-black/30 underline-offset-4">
                LinkedIn
              </a>
            ) : null}
          </article>
        ))}
      </Container>
    </>
  );
}
