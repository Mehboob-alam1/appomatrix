import Link from "next/link";
import { whatsappHref } from "@/lib/contact";
import type { ServiceNode, Settings } from "@/lib/types";

export function Footer({ settings, services }: { settings: Settings; services: ServiceNode[] }) {
  return (
    <footer className="bg-black text-[#f3f3f1]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-5xl leading-none md:text-6xl">{settings.siteName}</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">{settings.tagline}</p>
        </div>
        <div className="md:col-span-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">Company</p>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/about", "About Us"],
              ["/team", "Team"],
              ["/portfolio", "Portfolio"],
              ["/blog", "Blog"],
              ["/career-development", "Career Development"],
              ["/scholarships", "Scholarships"],
              ["/contact", "Contact Us"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-white/75 hover:text-white">{label}</Link>
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
          <p>© {new Date().getFullYear()} {settings.siteName}</p>
          <Link href="/admin" className="hover:text-white">Admin studio</Link>
        </div>
      </div>
    </footer>
  );
}
