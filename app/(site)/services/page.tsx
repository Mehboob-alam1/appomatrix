import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { ServiceIcon } from "@/components/site/service-icon";
import { Chip } from "@/components/site/ui";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { richTextPlain } from "@/lib/rich-text";
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
      <Container className="section-pad">
        {copy.body ? <Prose text={copy.body} className="mb-8 max-w-2xl" /> : null}
        <div className="grid gap-4">
          {groups.map((group) => (
            <section key={group.id} className="rounded-xl border border-border bg-card p-5 md:p-6">
              <div className="grid gap-5 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="flex items-start gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary-50 text-primary">
                      <ServiceIcon name={group.icon} className="size-5" />
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold">
                        <Link href={`/services/${group.slug}`} className="hover:text-primary">
                          {group.title}
                        </Link>
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {richTextPlain(group.shortDescription)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2 lg:col-span-8">
                  {(group.children.length > 0 ? group.children : [group]).map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="card-lift group flex items-start justify-between gap-3 rounded-xl border border-border bg-background p-4"
                    >
                      <span>
                        <span className="block font-semibold group-hover:text-primary">{service.title}</span>
                        <span className="mt-1 block line-clamp-2 text-sm text-muted-foreground">
                          {richTextPlain(service.shortDescription)}
                        </span>
                      </span>
                      <ArrowUpRight className="mt-1 size-4 shrink-0 text-primary" />
                    </Link>
                  ))}
                </div>
              </div>
              {group.children.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {group.children.map((child) => (
                    <Chip key={child.id}>{child.title}</Chip>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
