import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function LeadCtaBlock({
  title = "Want results like this? Let's talk.",
  description = "Book a free consultation and we'll map the fastest path to your goals.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="py-16">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-accent/15 via-accent-pink/10 to-accent-tertiary/15 px-6 py-12 text-center sm:px-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent-tertiary/20 blur-3xl" />
          <div className="relative">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">{title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">{description}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                href="/contact"
                analyticsLabel="Lead CTA — Contact"
                analyticsLocation="cta-block"
              >
                Book a Free Consultation
              </Button>
              <Button
                href="/work"
                variant="secondary"
                analyticsLabel="Lead CTA — Work"
                analyticsLocation="cta-block"
              >
                View Our Work
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
