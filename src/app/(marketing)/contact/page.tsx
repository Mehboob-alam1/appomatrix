import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { MultiStepContactForm } from "@/components/forms/multi-step-contact-form";
import { CalendlyEmbed } from "@/components/contact/calendly-embed";
import { siteConfig } from "@/lib/site-config";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Book a consultation or send a project inquiry to Appo Matrix.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's talk about your product"
        description="Share your project details or book a call—we'll meet you where you are in the process."
      />
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold">Reach us</h2>
              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <span className="font-medium text-foreground">Email</span>
                  <br />
                  <a
                    className="text-accent hover:underline"
                    href={`mailto:${siteConfig.contact.email}`}
                  >
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li>
                  <span className="font-medium text-foreground">Phone</span>
                  <br />
                  <a className="text-accent hover:underline" href={`tel:${siteConfig.contact.phone}`}>
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li>
                  <span className="font-medium text-foreground">Office</span>
                  <br />
                  <span className="text-muted">{siteConfig.contact.address}</span>
                </li>
              </ul>
            </div>
            <div className="mt-10">
              <h2 className="font-display text-xl font-semibold">Book a call</h2>
              <p className="mt-2 text-sm text-muted">Pick a time that works for you.</p>
              <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                <CalendlyEmbed />
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold">Project inquiry</h2>
            <p className="mt-2 text-sm text-muted">Four quick steps—we reply within one business day.</p>
            <div className="mt-4">
              <MultiStepContactForm source="contact-page" />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
