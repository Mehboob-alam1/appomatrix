import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Kicker, PageHero, Prose } from "@/components/site/chrome";
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
  const requirements = career.requirements.split("\n").map((line) => line.trim()).filter(Boolean);

  return (
    <>
      <PageHero
        kicker="Career Development"
        title={career.title}
        lead={career.summary}
        path={`/career-development/${career.slug}`}
        ancestors={[{ href: "/career-development", label: "Career Development" }]}
      />
      <Container className="grid gap-10 py-14 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <Prose text={career.description} />
          {requirements.length > 0 ? (
            <div>
              <Kicker>What we look for</Kicker>
              <ul className="mt-4 space-y-2">
                {requirements.map((item) => (
                  <li key={item} className="text-foreground/85">{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <aside className="h-fit border border-black bg-black p-6 text-white lg:col-span-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">{career.kind}</p>
          {career.department ? <p className="mt-2 text-sm text-white/70">{career.department}</p> : null}
          <p className="mt-4 text-sm text-white/70">{career.location}</p>
          {career.deadline ? <p className="mt-1 text-sm">Apply by {formatDate(career.deadline)}</p> : null}
          <Link
            href={`/contact?topic=${encodeURIComponent(`Career: ${career.title}`)}`}
            className="mt-6 inline-flex h-11 items-center bg-white px-4 text-sm text-black"
          >
            Apply through Contact Us
          </Link>
        </aside>
      </Container>
    </>
  );
}
