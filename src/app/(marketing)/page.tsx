import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { MotionSection } from "@/components/motion/motion-section";
import { FadeIn } from "@/components/motion/fade-in";
import { TrustBar } from "@/components/sections/trust-bar";
import { ServiceCard } from "@/components/cards/service-card";
import { ProjectCard } from "@/components/cards/project-card";
import { BlogCard } from "@/components/cards/blog-card";
import { TestimonialsCarousel } from "@/components/testimonials/testimonials-carousel";
import { MultiStepContactForm } from "@/components/forms/multi-step-contact-form";
import {
  getFeaturedProjects,
  getLatestPosts,
  getServices,
  getTestimonials,
} from "@/lib/data";

export default async function HomePage() {
  const [services, projects, testimonials, posts] = await Promise.all([
    getServices(),
    getFeaturedProjects(),
    getTestimonials(),
    getLatestPosts(),
  ]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border py-16 sm:py-24">
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent-tertiary/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-accent-pink/15 blur-3xl" />
        <Container className="relative grid items-center gap-12 lg:grid-cols-2">
          <FadeIn>
            <span className="pill">Gilgit-Baltistan → Global clients</span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.35rem]">
              Software that wins <span className="gradient-text">trust & revenue</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Appo Matrix partners with founders and enterprises to design, build, and ship web,
              mobile, and SaaS products—with clear communication every step.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href="/contact"
                size="lg"
                analyticsLabel="Book a Free Consultation"
                analyticsLocation="hero"
              >
                Book a Free Consultation
              </Button>
              <Button
                href="/work"
                variant="secondary"
                size="lg"
                analyticsLabel="View Our Work"
                analyticsLocation="hero"
              >
                View Our Work
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="card-interactive glass-panel rounded-3xl p-7 shadow-xl">
              <p className="text-sm font-semibold text-accent">Why teams choose us</p>
              <ul className="mt-5 space-y-4">
                {[
                  { t: "Ship faster", d: "Roadmaps you can actually follow" },
                  { t: "Build for reality", d: "Low bandwidth & offline-ready when needed" },
                  { t: "Talk to builders", d: "No handoffs—meet the people writing code" },
                ].map((item) => (
                  <li
                    key={item.t}
                    className="flex gap-3 rounded-2xl border border-border/80 bg-surface/60 p-3"
                  >
                    <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-accent to-accent-tertiary" />
                    <div>
                      <p className="text-sm font-semibold">{item.t}</p>
                      <p className="text-sm text-muted">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </Container>
      </section>

      <TrustBar />

      <MotionSection className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="What we do"
            title="Services built for growth"
            description="Web, mobile, SaaS, and transformation—one squad from idea to launch."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </Container>
      </MotionSection>

      <MotionSection className="border-y border-border bg-surface/60 py-16 sm:py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Portfolio"
              title="Featured work"
              description="Real outcomes across logistics, tourism, and health."
            />
            <Button href="/work" variant="secondary" analyticsLocation="home-work">
              All case studies
            </Button>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </Container>
      </MotionSection>

      <MotionSection className="py-16 sm:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Why us"
              title="Rooted in the mountains. Built for the world."
            />
            <ul className="mt-8 space-y-5">
              {[
                {
                  title: "Remote-first, timezone-friendly",
                  body: "We align with US, EU, and MENA teams without big-city agency overhead.",
                },
                {
                  title: "Product + engineering in one squad",
                  body: "You talk directly to the people designing and shipping your product.",
                },
                {
                  title: "Optimized for real networks",
                  body: "Performance and offline patterns that help users everywhere.",
                },
              ].map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
                >
                  <p className="font-semibold text-accent">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border bg-gradient-to-br from-surface to-surface-muted p-8 shadow-sm">
            <h3 className="font-display text-xl font-semibold">Client love</h3>
            <div className="mt-6">
              <TestimonialsCarousel items={testimonials} />
            </div>
          </div>
        </Container>
      </MotionSection>

      <MotionSection className="border-t border-border bg-surface/50 py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Blog" title="Ideas worth sharing" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        </Container>
      </MotionSection>

      <MotionSection className="py-16 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Get started"
              title="Start your project in minutes"
              description="Tell us about your goals—we reply within one business day with clear next steps."
            />
          </div>
          <div className="rounded-3xl border border-border bg-surface p-6 shadow-lg sm:p-8">
            <MultiStepContactForm source="home-final-cta" />
          </div>
        </Container>
      </MotionSection>
    </>
  );
}
