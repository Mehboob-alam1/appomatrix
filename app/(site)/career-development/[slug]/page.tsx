import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Kicker, PageHero, Prose } from "@/components/site/chrome";
import { SiteLinkButton } from "@/components/site/ui";
import { formatDate } from "@/lib/format";
import { getCareer } from "@/lib/queries";
import { contentMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) return { title: "Career" };
  return contentMetadata({
    title: career.title,
    description: career.summary,
    path: `/career-development/${career.slug}`,
  });
}

export default async function CareerPage({ params }: Params) {
  const { slug } = await params;
  const career = await getCareer(slug);
  if (!career) notFound();

  return (
    <>
      <PageHero
        kicker="Career Development"
        title={career.title}
        lead={career.summary}
        path={`/career-development/${career.slug}`}
        ancestors={[{ href: "/career-development", label: "Career Development" }]}
      />
      <Container className="grid items-start gap-6 py-6 lg:grid-cols-12 lg:gap-6 lg:py-8">
        <div className="space-y-6 lg:col-span-7">
          <Prose text={career.description} className="prose-width" />
          {career.requirements ? (
            <div>
              <Kicker>What we look for</Kicker>
              <Prose text={career.requirements} className="prose-width mt-3" />
            </div>
          ) : null}
        </div>
        <aside className="glass-card h-fit rounded-2xl p-5 lg:sticky lg:top-24 lg:col-span-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-400">{career.kind}</p>
          {career.department ? <p className="mt-2 text-sm text-muted-foreground">{career.department}</p> : null}
          <p className="mt-3 text-sm text-muted-foreground">{career.location}</p>
          {career.deadline ? <p className="mt-1 text-sm">Apply by {formatDate(career.deadline)}</p> : null}
          <SiteLinkButton
            href={`/contact?topic=${encodeURIComponent(`Career: ${career.title}`)}`}
            className="mt-5 w-full"
          >
            Apply through Contact Us
          </SiteLinkButton>
        </aside>
      </Container>
    </>
  );
}
