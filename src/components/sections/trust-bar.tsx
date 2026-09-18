import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";

const accents = [
  "from-accent/20 to-accent/5",
  "from-accent-tertiary/20 to-accent-tertiary/5",
  "from-accent-secondary/20 to-accent-secondary/5",
  "from-accent-pink/20 to-accent-pink/5",
];

export function TrustBar() {
  return (
    <section aria-label="Trust indicators" className="py-10">
      <Container>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {siteConfig.stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`rounded-2xl border border-border bg-gradient-to-br p-5 ${accents[i % accents.length]}`}
            >
              <p className="font-display text-3xl font-bold">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
