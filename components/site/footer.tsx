import Link from "next/link";
import { Prose } from "@/components/site/prose";
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
  const whatsapp = whatsappHref(settings.whatsappNumber, settings.whatsappMessage);

  return (
    <footer className="bg-surface-dark text-[#f3f6f8]">
      <div className="site-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SafeImage
            src={
              settings.logoUrl === "/brand/appo-matrix-mark.png"
                ? "/brand/appo-matrix-logo-on-dark.png"
                : settings.logoUrl || "/brand/appo-matrix-logo-on-dark.png"
            }
            alt={settings.logoAlt || settings.siteName}
            className="h-auto w-40 max-w-full object-contain"
          />
          <Prose text={settings.footerNote || settings.tagline} className="mt-4 max-w-sm text-sm text-white/60" />
          {social.length ? (
            <ul className="mt-5 flex flex-wrap gap-3 text-sm">
              {social.map((link) => (
                <li key={link.id}>
                  <a
                    className="text-white/70 underline-offset-4 hover:text-white hover:underline"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="lg:col-span-2">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-300">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            {company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-white/75 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-300">Studio</p>
          <ul className="mt-3 space-y-2 text-sm text-white/75">
            <li>{settings.address}</li>
            <li>
              <a className="hover:text-white" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={`tel:${settings.phone.replace(/\s/g, "")}`}>
                {settings.phone}
              </a>
            </li>
            {whatsapp ? (
              <li>
                <a className="hover:text-white" href={whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            ) : null}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary-300">Services</p>
          <ul className="mt-3 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.id}>
                <Link href={`/services/${service.slug}`} className="text-white/75 hover:text-white">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-container flex flex-col gap-2 py-4 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>{settings.copyrightText || `© ${new Date().getFullYear()} ${settings.siteName}`}</p>
          <Link href="/admin" className="text-white/30 hover:text-white/55">
            Admin studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
