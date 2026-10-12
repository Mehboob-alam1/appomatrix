import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero } from "@/components/site/chrome";
import { formatDate } from "@/lib/format";
import { listScholarships } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Scholarships",
  description: "Scholarships and fellowships from Appo Matrix for students in Gilgit-Baltistan and beyond.",
  path: "/scholarships",
});

export default function ScholarshipsPage() {
  const items = listScholarships(true);
  return (
    <>
      <PageHero
        kicker="Scholarships"
        title="Time and tuition for people already making things"
        lead="Awards, fellowships, and summer grants. Each one is published from the admin studio, with a deadline and a way to apply."
      />
      <Container className="py-8">
        {items.length === 0 ? (
          <p className="text-muted-foreground">No scholarships are open right now. Check back, or write to us.</p>
        ) : (
          <div className="border-t border-black/10">
            {items.map((item) => (
              <Link key={item.id} href={`/scholarships/${item.slug}`} className="group grid items-center gap-6 border-b border-black/10 py-8 md:grid-cols-12">
                <div className="media-card md:col-span-4">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.title} className="aspect-[16/10] w-full object-cover" />
                  ) : (
                    <div className="grid aspect-[16/10] place-items-center bg-black font-display text-4xl text-white">{item.title.slice(0, 1)}</div>
                  )}
                </div>
                <div className="md:col-span-7">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">
                    {item.deadline ? `Deadline ${formatDate(item.deadline)}` : "Open"}
                  </p>
                  <h2 className="font-display mt-2 text-3xl md:text-4xl">{item.title}</h2>
                  <p className="mt-2 text-sm text-black">{item.award}</p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-black/60">{item.summary}</p>
                </div>
                <ArrowUpRight className="hidden size-5 md:col-span-1 md:block md:justify-self-end group-hover:text-brand" />
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
