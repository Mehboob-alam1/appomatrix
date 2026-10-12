import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import { SupportDock } from "@/components/site/support-dock";
import { getSettings, serviceTree } from "@/lib/queries";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = getSettings();
  const services = serviceTree(true);
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={organizationJsonLd(settings)} />
      <JsonLd data={websiteJsonLd(settings)} />
      <Header siteName={settings.siteName} services={services} />
      <main id="content" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} services={services} />
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
