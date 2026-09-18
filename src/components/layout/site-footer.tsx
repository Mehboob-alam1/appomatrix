import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { getSiteContact } from "@/lib/site-settings-db";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  const contact = getSiteContact();

  return (
    <footer className="mt-auto border-t border-border">
      <div className="bg-gradient-to-r from-accent/10 via-accent-pink/10 to-accent-tertiary/10">
        <Container className="flex flex-col items-stretch justify-between gap-6 py-8 sm:flex-row sm:items-center sm:py-10">
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold sm:text-xl">Ready to build something great?</p>
            <p className="mt-1 text-sm text-muted">Free consultation · Clear roadmap · Global delivery</p>
          </div>
          <Button href="/contact" className="w-full justify-center sm:w-auto" analyticsLocation="footer-cta">
            Book a Free Consultation
          </Button>
        </Container>
      </div>
      <Container className="grid grid-cols-1 gap-10 py-10 sm:grid-cols-2 sm:py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{siteConfig.description}</p>
          <p className="mt-4 text-sm text-muted">{contact.address}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Explore</p>
          <ul className="mt-3 space-y-2.5 text-sm text-muted">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Contact</p>
          <ul className="mt-3 space-y-2.5 text-sm text-muted">
            <li className="break-all sm:break-normal">
              <a href={`mailto:${contact.email}`} className="hover:text-accent">
                {contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-accent">
                {contact.phone}
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {siteConfig.name}. Built in Gilgit-Baltistan, serving clients
        worldwide.
      </div>
    </footer>
  );
}
