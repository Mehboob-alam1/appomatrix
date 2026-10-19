import type { Metadata } from "next";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { ContactForm } from "@/components/site/contact-form";
import { SiteLinkButton } from "@/components/site/ui";
import { whatsappHref } from "@/lib/contact";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { getPageMeta, getSettings, listServices } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/contact", {
    title: "Contact Us",
    description: "Start a project, a career application, or a scholarship inquiry with Appo Matrix. We reply within one business day.",
  });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const settings = await getSettings();
  const seed = pageSeed("/contact");
  const copy = pageIntro(await getPageMeta("/contact"), {
    kicker: seed?.kicker || "Contact Us",
    heading: seed?.heading || "Tell us what you are building",
    lead: seed?.lead || "",
    body: seed?.body || "",
  });
  const services = await listServices(true);
  const topics = [
    "General inquiry",
    ...services.map((service) => service.title),
    "Career application",
    "Scholarship",
  ];
  const defaultTopic = topics.includes(topic || "") ? topic : topic || topics[0];
  const whatsapp = whatsappHref(settings.whatsappNumber, settings.whatsappMessage);

  return (
    <>
      <PageHero kicker={copy.kicker} title={copy.heading} lead={copy.lead} image={copy.image} imageAlt={copy.imageAlt} />
      <Container className="grid gap-8 py-10 lg:grid-cols-12 lg:gap-6 lg:py-9">
        <div className="rounded-xl border border-border bg-card p-5 md:p-6 lg:col-span-7">
          <ContactForm topics={topics} defaultTopic={defaultTopic} />
        </div>
        <aside className="space-y-4 lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">{settings.city}</p>
            <p className="mt-3 text-base font-medium">{settings.address}</p>
            <p className="mt-4">
              <a className="font-medium text-foreground underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
            <p className="mt-2">
              <a className="font-medium text-foreground underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary" href={`tel:${settings.phone.replace(/\s/g, "")}`}>
                {settings.phone}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-[10px] bg-[#25D366] px-4 text-sm font-semibold text-white"
              >
                WhatsApp the team
              </a>
            ) : null}
            {settings.calendlyUrl ? (
              <a
                href={settings.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-[10px] border border-border px-4 text-sm font-semibold hover:border-primary hover:text-primary"
              >
                Book a call
              </a>
            ) : null}
          </div>
          {copy.body ? <Prose text={copy.body} className="text-sm text-muted-foreground" /> : null}
          <SiteLinkButton href="/portfolio" variant="outline" className="w-full">
            See the work
          </SiteLinkButton>
        </aside>
      </Container>
    </>
  );
}
