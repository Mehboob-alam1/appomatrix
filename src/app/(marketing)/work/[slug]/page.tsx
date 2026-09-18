import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { RichText } from "@/components/content/rich-text";
import { LeadCtaBlock } from "@/components/sections/lead-cta-block";
import { getProjectBySlug, getProjects } from "@/lib/data";
import { resolveImageAlt, resolveImageUrl } from "@/lib/images";
import { buildMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.excerpt,
    path: `/work/${slug}`,
    image: resolveImageUrl(project.coverImage, 1200),
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const all = await getProjects();
  const idx = all.findIndex((p) => p.slug === slug);
  const next = idx >= 0 ? all[(idx + 1) % all.length] : null;
  const hero = resolveImageUrl(project.coverImage, 1600);
  const heroAlt = resolveImageAlt(project.coverImage, project.coverImageAlt, project.title);

  return (
    <>
      <div className="relative aspect-[21/9] max-h-[480px] w-full bg-surface-muted">
        {hero ? (
          <Image src={hero} alt={heroAlt} fill priority className="object-cover" sizes="100vw" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        <Container className="relative flex h-full items-end pb-10">
          <div>
            <p className="text-sm text-accent">
              {project.category} · {project.clientName}
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{project.title}</h1>
          </div>
        </Container>
      </div>

      <Container className="py-12 sm:py-16">
        {project.metrics?.length ? (
          <div className="mb-12 grid gap-4 sm:grid-cols-3">
            {project.metrics.map((m) => (
              <div key={m.label} className="rounded-2xl border border-border bg-surface p-5 text-center">
                <p className="font-display text-2xl font-semibold text-accent">{m.value}</p>
                <p className="mt-1 text-sm text-muted">{m.label}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-3">
          <section className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="font-display text-2xl font-semibold">Problem</h2>
              <div className="mt-3">
                <RichText value={project.problem} />
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">Solution</h2>
              <div className="mt-3">
                <RichText value={project.solution} />
              </div>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">Result</h2>
              <div className="mt-3">
                <RichText value={project.result} />
              </div>
            </div>
          </section>
          <aside>
            {project.techStack?.length ? (
              <>
                <h2 className="text-sm font-medium uppercase tracking-wide text-muted">Tech stack</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.techStack.map((t) => (
                    <li key={t} className="rounded-full border border-border px-3 py-1 text-sm">
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {project.externalLink ? (
              <p className="mt-6">
                <a
                  href={project.externalLink}
                  className="text-sm font-medium text-accent"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit live project →
                </a>
              </p>
            ) : null}
          </aside>
        </div>

        {project.gallery?.length ? (
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {project.gallery.map((img, i) => {
              const src = resolveImageUrl(img.url, 900);
              if (!src) return null;
              return (
                <div key={i} className="relative aspect-video overflow-hidden rounded-2xl border border-border">
                  <Image
                    src={src}
                    alt={resolveImageAlt(img.url, img.alt, `${project.title} gallery ${i + 1}`)}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
              );
            })}
          </div>
        ) : null}

        {next ? (
          <div className="mt-16 border-t border-border pt-8">
            <p className="text-sm text-muted">Next project</p>
            <Link
              href={`/work/${next.slug}`}
              className="mt-1 inline-block font-display text-xl font-semibold text-accent"
            >
              {next.title} →
            </Link>
          </div>
        ) : null}
      </Container>

      <LeadCtaBlock />
    </>
  );
}
