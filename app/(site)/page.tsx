import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Kicker, Prose } from "@/components/site/chrome";
import { parsePairs, parseStats, formatDate } from "@/lib/format";
import {
  getSettings,
  listCareers,
  listPosts,
  listProjects,
  listScholarships,
  listTestimonials,
  serviceTree,
} from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Software studio in Gilgit-Baltistan",
  description:
    "Appo Matrix designs and ships web, mobile, and SaaS products from Gilgit-Baltistan for teams worldwide. See the work, services, careers, and scholarships.",
  path: "/",
});

export default function HomePage() {
  const settings = getSettings();
  const services = serviceTree(true);
  const projects = listProjects(true);
  const featured = projects.filter((project) => project.featured);
  const shown = (featured.length > 0 ? featured : projects).slice(0, 3);
  const posts = listPosts(true).slice(0, 3);
  const quotes = listTestimonials(true);
  const careers = listCareers(true).slice(0, 3);
  const scholarships = listScholarships(true).slice(0, 3);
  const stats = parseStats(settings.statsText);
  const process = parsePairs(settings.processText);
  const industries = parsePairs(settings.industriesText);
  const principles = parsePairs(settings.principlesText);
  const marquee = services.flatMap((group) => [group.title, ...group.children.map((child) => child.title)]);

  return (
    <>
      <section className="overflow-hidden">
        <Container className="grid items-end gap-8 pt-10 pb-8 md:grid-cols-12 md:pt-14 md:pb-10">
          <div className="md:col-span-8">
            <div className="flex items-center justify-between gap-4">
              <Kicker>{settings.heroKicker}</Kicker>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-black/40">{settings.city}</p>
            </div>
            <h1 className="font-display mt-6 text-[12vw] md:text-[5.6rem]">
              {settings.heroTitle}
              <span className="mt-1 block text-brand">{settings.heroHighlight}</span>
            </h1>
          </div>
          <div className="md:col-span-4 md:pb-2">
            <p className="text-lg leading-relaxed text-black/65">{settings.heroLead}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="inline-flex h-12 items-center gap-2 bg-brand px-5 text-sm font-medium text-white">
                Plan a project <ArrowUpRight className="size-4" />
              </Link>
              <Link href="/portfolio" className="inline-flex h-12 items-center border border-black px-5 text-sm">
                See the work
              </Link>
            </div>
          </div>
        </Container>
        <div className="overflow-hidden border-y border-black/10 bg-white">
          <div className="marquee-track py-3.5">
            {[...marquee, ...marquee].map((item, index) => (
              <span key={`${item}-${index}`} className="mx-5 font-mono text-[11px] uppercase tracking-[0.22em] text-black/50">
                {item} <span className="text-brand">/</span>
              </span>
            ))}
          </div>
        </div>
        <figure className="relative">
          <img
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80"
            alt="High mountain ridge above the clouds"
            className="h-[62vh] min-h-[380px] w-full object-cover"
          />
          <figcaption className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/70 to-transparent px-5 py-6 font-mono text-[11px] uppercase tracking-[0.18em] text-white md:px-10">
            <span>{settings.city}</span>
            <span>Shipping worldwide</span>
          </figcaption>
        </figure>
      </section>

      <section className="border-y border-black/10">
        <Container className="grid md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.label} className={`px-0 py-8 md:px-6 ${index > 0 ? "md:border-l md:border-black/10" : ""}`}>
              <p className="font-display text-5xl md:text-6xl">{stat.value}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-black/45">{stat.label}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="flex items-end justify-between gap-6">
            <div>
              <Kicker>Services</Kicker>
              <h2 className="font-display mt-3 max-w-xl text-4xl md:text-6xl">What we actually ship</h2>
            </div>
            <Link href="/services" className="hidden items-center gap-1 text-sm md:inline-flex">
              All services <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 border-b border-black/10">
            {services.map((service, index) => (
              <article key={service.id} className="group grid gap-4 border-t border-black/10 px-0 py-8 transition-colors hover:bg-brand-soft md:grid-cols-12 md:items-start md:px-6">
                <p className="font-mono text-xs text-brand md:col-span-1">{String(index + 1).padStart(2, "0")}</p>
                <div className="md:col-span-4">
                  <h3 className="font-display text-3xl">
                    <Link href={`/services/${service.slug}`} className="hover:text-brand">{service.title}</Link>
                  </h3>
                  <p className="mt-2 text-sm text-black/60">{service.shortDescription}</p>
                </div>
                <ul className="grid gap-1 md:col-span-7 md:grid-cols-2">
                  {service.children.map((child) => (
                    <li key={child.id}>
                      <Link href={`/services/${child.slug}`} className="inline-flex items-center gap-2 py-1 text-sm hover:text-brand">
                        <ArrowUpRight className="size-3.5 text-brand" />
                        {child.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <Kicker>Portfolio</Kicker>
              <h2 className="font-display mt-3 text-4xl md:text-6xl">Selected products</h2>
            </div>
            <Link href="/portfolio" className="inline-flex items-center gap-1 text-sm">
              Complete portfolio <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="space-y-12">
            {shown.map((project, index) => (
              <Link key={project.id} href={`/portfolio/${project.slug}`} className="group grid items-center gap-6 md:grid-cols-12">
                <div className={index % 2 === 0 ? "md:col-span-7" : "md:order-2 md:col-span-7"}>
                  <div className="media-card">
                    {project.coverImage ? (
                      <img src={project.coverImage} alt={project.coverImageAlt || project.title} className="aspect-[16/10] w-full object-cover" />
                    ) : null}
                  </div>
                </div>
                <div className="md:col-span-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">{project.category}</p>
                  <h3 className="font-display mt-2 text-4xl">{project.title}</h3>
                  <p className="mt-3 text-black/60">{project.excerpt}</p>
                  <p className="mt-4 text-sm">{project.clientName}</p>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-black/10 py-8">
        <Container className="grid gap-6 md:grid-cols-4">
          {process.map((step, index) => (
            <div key={step.title}>
              <p className="font-mono text-xs text-brand">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-medium">{step.title}</p>
              <p className="mt-1 text-sm text-black/55">{step.body}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Kicker>Industries</Kicker>
            <h2 className="font-display mt-3 text-4xl">Different controls for different work</h2>
          </div>
          <div className="divide-y divide-black/10 border-y border-black/10 lg:col-span-8">
            {industries.map((industry) => (
              <div key={industry.title} className="grid gap-2 py-5 md:grid-cols-2">
                <h3 className="font-display text-2xl">{industry.title}</h3>
                <p className="text-sm leading-relaxed text-black/60">{industry.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="ink py-16 md:py-24">
        <Container className="grid gap-12 lg:grid-cols-2">
          <div>
            <Kicker light>About</Kicker>
            <h2 className="font-display mt-3 text-4xl text-white md:text-6xl">{settings.aboutHeadline}</h2>
            <Prose text={settings.aboutBody} className="mt-6 text-white/70" />
            <Link href="/about" className="mt-8 inline-flex h-11 items-center bg-white px-5 text-sm text-black">
              About Us
            </Link>
          </div>
          <div className="divide-y divide-white/15 border-y border-white/15">
            {principles.map((item) => (
              <div key={item.title} className="py-5">
                <h3 className="text-lg text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <Kicker>Clients</Kicker>
          <div className="mt-8 grid gap-10 md:grid-cols-2">
            {quotes.map((quote) => (
              <figure key={quote.id} className="border-t border-black/10 pt-6">
                <blockquote className="font-display text-3xl leading-tight">“{quote.quote}”</blockquote>
                <figcaption className="mt-5 text-sm text-black/55">
                  {quote.clientName} · {quote.role}, {quote.company}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-black/10 bg-white">
        <Container className="grid md:grid-cols-2">
          <div className="border-black/10 py-12 md:border-r md:pr-10">
            <Kicker>Career Development</Kicker>
            <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
              {careers.map((career) => (
                <li key={career.id}>
                  <Link href={`/career-development/${career.slug}`} className="flex items-center justify-between py-4">
                    <span>
                      <span className="block text-lg">{career.title}</span>
                      <span className="text-sm text-black/50">{career.kind} · {career.location}</span>
                    </span>
                    <ArrowUpRight className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="py-12 md:pl-10">
            <Kicker>Scholarships</Kicker>
            <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
              {scholarships.map((item) => (
                <li key={item.id}>
                  <Link href={`/scholarships/${item.slug}`} className="flex items-center justify-between py-4">
                    <span>
                      <span className="block text-lg">{item.title}</span>
                      <span className="text-sm text-black/50">{item.award}</span>
                    </span>
                    <ArrowUpRight className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-4xl md:text-6xl">Notes</h2>
            <Link href="/blog" className="text-sm">All posts</Link>
          </div>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                {post.featuredImage ? (
                  <div className="media-card">
                    <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} className="aspect-[4/3] w-full object-cover" />
                  </div>
                ) : null}
                <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-black/45">{post.category} · {formatDate(post.publishedAt)}</p>
                <h3 className="mt-2 text-2xl tracking-tight group-hover:text-brand">{post.title}</h3>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand">
        <Container className="flex flex-col justify-between gap-8 py-20 md:flex-row md:items-end">
          <h2 className="font-display max-w-xl text-5xl text-white md:text-7xl">Start with a written brief.</h2>
          <Link href="/contact" className="inline-flex h-12 items-center gap-2 bg-white px-6 text-sm font-medium text-brand">
            Contact Us <ArrowUpRight className="size-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}
