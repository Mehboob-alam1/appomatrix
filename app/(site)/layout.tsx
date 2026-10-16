import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { JsonLd } from "@/components/site/json-ld";
import { SupportDock } from "@/components/site/support-dock";
import { databaseHint } from "@/lib/db-status";
import { defaultSettings } from "@/lib/defaults";
import { getSettings, listNavigation, listSocial, serviceTree } from "@/lib/queries";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  try {
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
  } catch (error) {
    console.error(error);
    const settings = defaultSettings;
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f7f9] px-5 py-16">
        <div className="w-full max-w-lg border border-black/10 bg-white p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand">{settings.siteName}</p>
          <h1 className="font-display mt-3 text-4xl">Site is reconnecting</h1>
          <p className="mt-4 text-sm leading-relaxed text-black/65">{databaseHint(error)}</p>
          <p className="mt-4 text-sm text-black/55">
            Open Hostinger → Environment variables and confirm <code>DB_HOST</code>, <code>DB_USER</code>,{" "}
            <code>DB_PASSWORD</code>, and <code>DB_NAME</code>. Then restart the Node.js app and check{" "}
            <a className="underline" href="/api/health">
              /api/health
            </a>
            .
          </p>
        </div>
      </div>
    );
  }
}
