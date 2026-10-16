import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { getPageMeta, serviceTree } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/services", {
    title: "Services",
    description: "Web, mobile, SaaS, design, cloud, and applied AI from Appo Matrix in Gilgit-Baltistan.",
  });
}

export default async function ServicesPage() {
  const groups = await serviceTree(true);
  const seed = pageSeed("/services");
  const copy = pageIntro(await getPageMeta("/services"), {
    kicker: seed?.kicker || "Services",
    heading: seed?.heading || "Everything required to ship",
    lead: seed?.lead || "",
    body: seed?.body || "",
  });
  return (
    <>
      <PageHero kicker={copy.kicker} title={copy.heading} lead={copy.lead} image={copy.image} imageAlt={copy.imageAlt} />
      <Container className="py-10">
        {copy.body ? <Prose text={copy.body} className="mb-10 max-w-2xl" /> : null}
        {groups.map((group) => (
          <section key={group.id} className="border-t border-black/10 py-10">
            <div className="grid gap-4 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="font-display text-3xl">
                  <Link href={`/services/${group.slug}`}>{group.title}</Link>
                </h2>
                <Prose text={group.shortDescription} className="mt-2 text-sm text-black/60" />
              </div>
              <div className="divide-y divide-black/10 border-y border-black/10 md:col-span-8">
                {(group.children.length > 0 ? group.children : [group]).map((service) => (
                  <Link key={service.id} href={`/services/${service.slug}`} className="group flex items-start justify-between gap-4 py-4">
                    <span>
                      <span className="block text-lg">{service.title}</span>
                      <Prose text={service.shortDescription} className="mt-1 text-sm text-black/55" />
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
