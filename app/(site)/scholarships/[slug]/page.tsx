import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Kicker, PageHero, Prose } from "@/components/site/chrome";
import { formatDate } from "@/lib/format";
import { getScholarship } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = getScholarship(slug);
  if (!item) return { title: "Scholarship" };
  return pageMetadata({
    title: item.title,
    description: item.summary,
    path: `/scholarships/${item.slug}`,
    image: item.coverImage || undefined,
  });
}

export default async function ScholarshipPage({ params }: Params) {
  const { slug } = await params;
  const item = getScholarship(slug);
  if (!item) notFound();
  const applyHref = item.applicationUrl || `/contact?topic=${encodeURIComponent(`Scholarship: ${item.title}`)}`;
  const external = Boolean(item.applicationUrl);

  return (
    <>
      <PageHero
        kicker="Scholarships"
        title={item.title}
        lead={item.summary}
        path={`/scholarships/${item.slug}`}
        ancestors={[{ href: "/scholarships", label: "Scholarships" }]}
      />
      <Container className="grid gap-10 py-14 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          {item.coverImage ? (
            <div className="media-card">
              <img src={item.coverImage} alt={item.title} className="aspect-[16/9] w-full object-cover" />
            </div>
          ) : null}
          <Prose text={item.description} />
        </div>
        <aside className="h-fit space-y-3 bg-black p-6 text-white lg:col-span-5">
          <Kicker>Award</Kicker>
          <p className="font-display text-4xl text-white">{item.award || "See description"}</p>
          {item.eligibility ? (
            <p className="text-sm leading-relaxed text-white/65">{item.eligibility}</p>
          ) : null}
          {item.deadline ? <p className="text-sm text-white/80">Deadline {formatDate(item.deadline)}</p> : null}
          {external ? (
            <a href={applyHref} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center bg-brand px-4 text-sm text-white">
              Apply
            </a>
          ) : (
            <Link href={applyHref} className="inline-flex h-11 items-center bg-brand px-4 text-sm text-white">
              Apply through Contact Us
            </Link>
          )}
        </aside>
      </Container>
    </>
  );
}
