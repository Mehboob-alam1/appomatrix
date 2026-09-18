import { Container } from "@/components/ui/container";
import { FadeIn } from "@/components/motion/fade-in";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-0 mesh-bg opacity-90" />
      <Container className="relative">
        <FadeIn>
          {eyebrow ? <span className="pill">{eyebrow}</span> : null}
          <h1
            className={`max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl ${eyebrow ? "mt-4" : ""}`}
          >
            <span className="gradient-text">{title}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{description}</p>
          {children ? <div className="mt-6">{children}</div> : null}
        </FadeIn>
      </Container>
    </section>
  );
}
