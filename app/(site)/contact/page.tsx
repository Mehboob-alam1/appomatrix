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
    title: "Contact — Let's Build Something Extraordinary",
    description:
      "Tell us your idea, goals, and what you want to launch. Appo Matrix replies with a clear next step.",
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
    kicker: seed?.kicker || "Contact",
    heading: seed?.heading || "Let's build something extraordinary together.",
    lead:
      seed?.lead ||
      "Tell us your idea, your goals, and what you want to launch. We'll help you explore the right approach.",
    body: seed?.body || "",
  });
  const services = await listServices(true);
  const topics = ["General inquiry", ...services.map((service) => service.title), "Career application", "Scholarship"];
  const defaultTopic = topics.includes(topic || "") ? topic : topic || topics[0];
  const whatsapp = whatsappHref(settings.whatsappNumber, settings.whatsappMessage);

  return (
    <>
      <PageHero
        kicker={copy.kicker}
        title={copy.heading}
        lead={copy.lead}
        image={copy.image}
        imageAlt={copy.imageAlt}
        highlight="extraordinary"
      />
      <Container className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
        <div className="glass-card rounded-2xl p-5 md:p-8 lg:col-span-7">
          <ContactForm topics={topics} defaultTopic={defaultTopic} />
        </div>
        <aside className="space-y-4 lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <div className="glass-card rounded-2xl p-6">
            {settings.city ? (
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-400">{settings.city}</p>
            ) : null}
            {settings.address ? <p className="mt-3 text-base font-medium">{settings.address}</p> : null}
            {settings.email ? (
              <p className="mt-4">
                <a
                  className="font-medium text-foreground underline decoration-border underline-offset-4 hover:text-primary-400 hover:decoration-primary"
                  href={`mailto:${settings.email}`}
                >
                  {settings.email}
                </a>
              </p>
            ) : null}
            {settings.phone ? (
              <p className="mt-2">
                <a
                  className="font-medium text-foreground underline decoration-border underline-offset-4 hover:text-primary-400 hover:decoration-primary"
                  href={`tel:${settings.phone.replace(/\s/g, "")}`}
                >
                  {settings.phone}
                </a>
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-3">
            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center rounded-xl bg-[#25D366] px-4 text-sm font-semibold text-white"
              >
                WhatsApp the team
              </a>
            ) : null}
            {settings.calendlyUrl ? (
              <a
                href={settings.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold"
              >
                Book a Free Consultation
              </a>
            ) : null}
          </div>
          {copy.body ? <Prose text={copy.body} className="text-sm text-muted-foreground" /> : null}
          <SiteLinkButton href="/portfolio" variant="outline" className="w-full">
            Explore Our Work
          </SiteLinkButton>
        </aside>
      </Container>
    </>
  );
}
