import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import { SupportDock } from "@/components/site/support-dock";
import { getSettings, listNavigation, listSocial, serviceTree } from "@/lib/queries";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, services, headerLinks, footerLinks, ctaLinks, social] = await Promise.all([
    getSettings(),
    serviceTree(true),
    listNavigation(true, "header"),
    listNavigation(true, "footer"),
    listNavigation(true, "header_cta"),
    listSocial(true),
  ]);
  const cta = ctaLinks[0] || { href: "/contact", label: "Contact Us" };
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={organizationJsonLd(settings, social.map((link) => link.url))} />
      <JsonLd data={websiteJsonLd(settings)} />
      <Header
        siteName={settings.siteName}
        logoUrl={settings.logoUrl}
        logoAlt={settings.logoAlt}
        services={services}
        links={headerLinks}
        cta={{ href: cta.href, label: cta.label }}
      />
      <main id="content" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} services={services} links={footerLinks} social={social} />
      <SupportDock
        siteName={settings.siteName}
        email={settings.email}
        phone={settings.phone}
        whatsappNumber={settings.whatsappNumber}
        whatsappMessage={settings.whatsappMessage}
      />
    </div>
  );
}
