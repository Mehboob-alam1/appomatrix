import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { LeadCtaBlock } from "@/components/sections/lead-cta-block";
import { getTestimonials } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Testimonials",
  description: "What clients say about working with Appo Matrix.",
  path: "/testimonials",
});

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Client testimonials"
        description="Long-term partnerships across logistics, retail, tourism, and health."
      />
      <Container className="pb-16 sm:pb-20">
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote
              key={t._id}
              className="card-interactive rounded-2xl border border-border bg-surface p-6 sm:p-8"
            >
              <p className="text-3xl leading-none text-accent/40">&ldquo;</p>
              <p className="mt-2 leading-relaxed text-muted">{t.quote}</p>
              <footer className="mt-6 border-t border-border pt-6">
                <p className="font-medium">{t.clientName}</p>
                <p className="text-sm text-muted">
                  {t.role}, {t.company}
                </p>
                {t.rating ? (
                  <p className="mt-2 text-sm text-accent-secondary" aria-label={`${t.rating} out of 5 stars`}>
                    {"★".repeat(t.rating)}
                    <span className="text-muted/40">{"★".repeat(5 - t.rating)}</span>
                  </p>
                ) : null}
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
      <LeadCtaBlock />
    </>
  );
}
