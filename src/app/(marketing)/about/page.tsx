import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { Button } from "@/components/ui/button";
import { getTeam } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildMetadata({
  title: "About",
  description:
    "Meet Appo Matrix — a software agency rooted in Gilgit-Baltistan, partnering with teams worldwide.",
  path: "/about",
});

const teamAccents = [
  "from-accent/20 to-accent/5",
  "from-accent-tertiary/20 to-accent-tertiary/5",
  "from-accent-secondary/20 to-accent-secondary/5",
  "from-accent-pink/20 to-accent-pink/5",
];

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Built in the mountains, trusted worldwide"
        description="Product strategy, design, and engineering from Gilgit-Baltistan—for founders and enterprises who need clarity and reliable delivery."
      />
      <Container className="py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              We started Appo Matrix in Gilgit-Baltistan because world-class software shouldn&apos;t
              require world-class rent. Our team combines product strategy, design, and engineering to
              help founders and enterprises ship platforms that hold up in production.
            </p>
            <p>
              From logistics SaaS to tourism booking engines, we&apos;ve learned that great delivery
              is mostly clarity: honest timelines, measurable outcomes, and communication you can
              forward to your board without editing.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold">Mission</h2>
            <p className="mt-3 text-sm text-muted">
              Expand opportunity in mountain communities by doing exceptional remote work for global
              clients—and bring that same rigor to every product we touch.
            </p>
            <h2 className="mt-6 font-display text-xl font-semibold">Global reach</h2>
            <p className="mt-3 text-sm text-muted">
              Based in {siteConfig.contact.address}, collaborating across US, UK, EU, and MENA
              timezones with async-friendly rituals and weekly live checkpoints.
            </p>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-3xl font-semibold">
            <span className="gradient-text">Team</span>
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, i) => (
              <article
                key={member._id}
                className={`card-interactive rounded-2xl border border-border bg-gradient-to-br p-5 ${teamAccents[i % teamAccents.length]}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 font-display text-lg font-semibold text-accent shadow-sm">
                  {member.name.charAt(0)}
                </div>
                <h3 className="mt-4 font-medium">{member.name}</h3>
                <p className="text-sm font-medium text-accent">{member.role}</p>
                {member.bio ? <p className="mt-2 text-sm text-muted">{member.bio}</p> : null}
              </article>
            ))}
          </div>
        </section>

        <div className="mt-12">
          <Button href="/contact" analyticsLabel="About CTA" analyticsLocation="about">
            Work with us
          </Button>
        </div>
      </Container>
    </>
  );
}
