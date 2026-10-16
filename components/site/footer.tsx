import Link from "next/link";
import { Prose } from "@/components/site/chrome";
import { SafeImage } from "@/components/site/safe-image";
import { whatsappHref } from "@/lib/contact";
import type { NavItem, ServiceNode, Settings, SocialLink } from "@/lib/types";

export function Footer({
  settings,
  services,
  links,
  social,
}: {
  settings: Settings;
  services: ServiceNode[];
  links: NavItem[];
  social: SocialLink[];
}) {
  const company = links.length
    ? links
    : [
        { id: "about", href: "/about", label: "About Us", location: "footer", sortOrder: 1, published: true },
        { id: "contact", href: "/contact", label: "Contact Us", location: "footer", sortOrder: 2, published: true },
      ];
  return (
    <footer className="bg-black text-[#f3f3f1]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <SafeImage
            src={settings.logoUrl === "/brand/appo-matrix-mark.png" ? "/brand/appo-matrix-logo-on-dark.png" : settings.logoUrl || "/brand/appo-matrix-logo-on-dark.png"}
            alt={settings.logoAlt || settings.siteName}
            className="h-auto w-44 max-w-full object-contain"
          />
          <Prose text={settings.footerNote || settings.tagline} className="mt-5 max-w-sm text-sm text-white/60" />
        </div>
        <div className="md:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">Company</p>
          <ul className="mt-4 space-y-2 text-sm">
            {company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/75 hover:text-white">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">Studio</p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>{settings.address}</li>
            <li><a className="hover:text-white" href={`mailto:${settings.email}`}>{settings.email}</a></li>
            <li><a className="hover:text-white" href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a></li>
            {whatsappHref(settings.whatsappNumber, settings.whatsappMessage) ? (
              <li>
                <a className="hover:text-white" href={whatsappHref(settings.whatsappNumber, settings.whatsappMessage)} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            ) : null}
          </ul>
          {social.length ? (
            <ul className="mt-6 space-y-2 text-sm">
              {social.map((link) => (
                <li key={link.id}>
                  <a className="text-white/75 hover:text-white" href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="mt-6 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.id}>
                <Link href={`/services/${service.slug}`} className="text-white/75 hover:text-white">{service.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>{settings.copyrightText || `© ${new Date().getFullYear()} ${settings.siteName}`}</p>
          <Link href="/admin" className="hover:text-white">Admin studio</Link>
        </div>
      </div>
    </footer>
  );
}
