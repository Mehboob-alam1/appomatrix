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
        <Container className="pt-8">
          <Prose text={copy.body} className="max-w-2xl text-sm text-muted-foreground" />
        </Container>
      ) : null}
      <Container className="grid gap-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">
        {team.length === 0 ? <p className="text-muted-foreground">Team profiles will appear here once they are published.</p> : null}
        {team.map((person) => (
          <article key={person.id} className="group overflow-hidden rounded-xl border border-border bg-card">
            {person.photo ? (
              <div className="media-card rounded-none border-0">
                <SafeImage src={person.photo} alt={person.photoAlt || person.name} className="aspect-[4/5] w-full object-cover" />
              </div>
            ) : (
              <div className="grid aspect-[4/5] place-items-center bg-muted text-5xl font-semibold text-muted-foreground">
                {person.name.slice(0, 1)}
              </div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold">{person.name}</h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{person.role}</p>
              {person.bio ? <Prose text={person.bio} className="mt-2 line-clamp-3 text-sm text-muted-foreground" /> : null}
              {person.linkedin ? (
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100"
                >
                  LinkedIn
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </Container>
    </>
  );
}
