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
        { id: "about", href: "/about", label: "About", location: "footer", sortOrder: 1, published: true },
        { id: "portfolio", href: "/portfolio", label: "Work", location: "footer", sortOrder: 2, published: true },
        { id: "blog", href: "/blog", label: "Insights", location: "footer", sortOrder: 3, published: true },
        { id: "contact", href: "/contact", label: "Contact", location: "footer", sortOrder: 4, published: true },
      ];
  const whatsapp = whatsappHref(settings.whatsappNumber, settings.whatsappMessage);

  return (
    <footer className="border-t border-border bg-[#070b14] text-foreground">
      <div className="site-container grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SafeImage
            src={
              settings.logoUrl === "/brand/appo-matrix-mark.png"
                ? "/brand/appo-matrix-logo-on-dark.png"
                : settings.logoUrl || "/brand/appo-matrix-logo-on-dark.png"
            }
            alt={settings.logoAlt || settings.siteName}
            className="h-auto w-44 max-w-full object-contain"
          />
          <Prose
            text={
              settings.footerNote ||
              settings.tagline ||
              "We design, develop, and deploy modern AI-powered software at startup speed."
            }
            className="mt-5 max-w-sm text-sm text-muted-foreground"
          />
          {social.length ? (
            <ul className="mt-6 flex flex-wrap gap-3 text-sm">
              {social.map((link) => (
                <li key={link.id}>
                  <a
                    className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
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
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-400">Company</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-400">Services</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.map((service) => (
              <li key={service.id}>
                <Link href={`/services/${service.slug}`} className="text-muted-foreground hover:text-foreground">
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-primary-400">Get in touch</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {settings.address ? <li>{settings.address}</li> : null}
            {settings.email ? (
              <li>
                <a className="hover:text-foreground" href={`mailto:${settings.email}`}>
                  {settings.email}
                </a>
              </li>
            ) : null}
            {settings.phone ? (
              <li>
                <a className="hover:text-foreground" href={`tel:${settings.phone.replace(/\s/g, "")}`}>
                  {settings.phone}
                </a>
              </li>
            ) : null}
            {whatsapp ? (
              <li>
                <a className="hover:text-foreground" href={whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="site-container flex flex-col gap-2 py-5 text-xs text-muted-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p>{settings.copyrightText || `© ${new Date().getFullYear()} ${settings.siteName}. All rights reserved.`}</p>
          <Link href="/admin" className="hover:text-muted-foreground">
            Admin studio
          </Link>
        </div>
      </div>
    </footer>
  );
}
