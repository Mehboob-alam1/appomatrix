import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { getSiteContact } from "@/lib/site-settings-db";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const contact = getSiteContact();

  return (
    <div className="mesh-bg flex min-h-full min-w-0 flex-col overflow-x-clip">
      <SiteHeader />
      <main className="min-w-0 flex-1 pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:pb-0">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppButton whatsapp={contact.whatsapp} />
    </div>
  );
}
