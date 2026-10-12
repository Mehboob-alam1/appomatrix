import type { Metadata } from "next";
import { Container, PageHero } from "@/components/site/chrome";
import { listTeam } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Team",
  description: "The people who design and ship at Appo Matrix in Gilgit-Baltistan.",
  path: "/team",
});

export default function TeamPage() {
  const team = listTeam(true);
  return (
    <>
      <PageHero
        kicker="Team"
        title="The people on the squad"
        lead="Strategy, design, and engineering in one group. You talk to the people who do the work."
      />
      <Container className="grid gap-x-6 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {team.length === 0 ? <p className="text-muted-foreground">Team profiles will appear here once they are published.</p> : null}
        {team.map((person) => (
          <article key={person.id}>
            {person.photo ? (
              <div className="media-card">
                <img src={person.photo} alt={person.photoAlt || person.name} className="aspect-[4/5] w-full object-cover" />
              </div>
            ) : (
              <div className="grid aspect-[4/5] place-items-center bg-black font-display text-6xl text-white">{person.name.slice(0, 1)}</div>
            )}
            <h2 className="mt-4 text-xl tracking-tight">{person.name}</h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">{person.role}</p>
            <p className="mt-2 text-sm leading-relaxed text-black/60">{person.bio}</p>
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
