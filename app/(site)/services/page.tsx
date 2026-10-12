import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero } from "@/components/site/chrome";
import { serviceTree } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description: "Web, mobile, SaaS, design, cloud, and applied AI from Appo Matrix in Gilgit-Baltistan.",
  path: "/services",
});

export default function ServicesPage() {
  const groups = serviceTree(true);
  return (
    <>
      <PageHero
        kicker="Services"
        title="Everything required to ship"
        lead="Open a practice, or go straight to the service. Each one can stand alone or sit inside a longer squad."
      />
      <Container className="py-10">
        {groups.map((group) => (
          <section key={group.id} className="border-t border-black/10 py-10">
            <div className="grid gap-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="font-display text-3xl">
                  <Link href={`/services/${group.slug}`}>{group.title}</Link>
                </h2>
                <p className="mt-2 text-sm text-black/60">{group.shortDescription}</p>
              </div>
              <div className="divide-y divide-black/10 border-y border-black/10 md:col-span-8">
                {(group.children.length > 0 ? group.children : [group]).map((service) => (
                  <Link key={service.id} href={`/services/${service.slug}`} className="group flex items-start justify-between gap-4 py-4">
                    <span>
                      <span className="block text-lg">{service.title}</span>
                      <span className="mt-1 block text-sm text-black/55">{service.shortDescription}</span>
                    </span>
                    <ArrowUpRight className="mt-1 size-4 shrink-0 group-hover:text-brand" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}
      </Container>
    </>
  );
}
