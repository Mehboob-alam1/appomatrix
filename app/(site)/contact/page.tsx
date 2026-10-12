import type { Metadata } from "next";
import { Container, PageHero } from "@/components/site/chrome";
import { ContactForm } from "@/components/site/contact-form";
import { whatsappHref } from "@/lib/contact";
import { getSettings, listServices } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: "Start a project, a career application, or a scholarship inquiry with Appo Matrix. We reply within one business day.",
  path: "/contact",
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  const settings = getSettings();
  const services = listServices(true);
  const topics = [
    "General inquiry",
    ...services.map((service) => service.title),
    "Career application",
    "Scholarship",
  ];
  const defaultTopic = topics.includes(topic || "") ? topic : topic || topics[0];

  return (
    <>
      <PageHero
        kicker="Contact Us"
        title="Tell us what you are building"
        lead="A project, a role, or a scholarship. We reply within one business day with a clear next step."
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ContactForm topics={topics} defaultTopic={defaultTopic} />
        </div>
        <aside className="space-y-8 lg:col-span-5">
          <div className="border-t border-black/10 pt-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">{settings.city}</p>
            <p className="mt-3 text-lg">{settings.address}</p>
            <p className="mt-4">
              <a className="underline decoration-black/20 underline-offset-4 hover:decoration-brand" href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
            <p className="mt-1">
              <a className="underline decoration-black/20 underline-offset-4 hover:decoration-brand" href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {whatsappHref(settings.whatsappNumber, settings.whatsappMessage) ? (
              <a
                href={whatsappHref(settings.whatsappNumber, settings.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center bg-[#25D366] px-4 text-sm font-medium text-white"
              >
                WhatsApp the team
              </a>
            ) : null}
            {settings.calendlyUrl ? (
              <a href={settings.calendlyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center border border-black px-4 text-sm">
                Book a call
              </a>
            ) : null}
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-black/55">
            Inquiries land in the studio CRM. Nothing is scheduled or billed until you confirm the scope in writing.
          </p>
        </aside>
      </Container>
    </>
  );
}
