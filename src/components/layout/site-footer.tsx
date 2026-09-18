import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="bg-gradient-to-r from-accent/10 via-accent-pink/10 to-accent-tertiary/10">
        <Container className="flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xl font-semibold">Ready to build something great?</p>
            <p className="mt-1 text-sm text-muted">Free consultation · Clear roadmap · Global delivery</p>
          </div>
          <Button href="/contact" analyticsLocation="footer-cta">
            Book a Free Consultation
          </Button>
        </Container>
      </div>
      <Container className="grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{siteConfig.description}</p>
          <p className="mt-4 text-sm text-muted">{siteConfig.contact.address}</p>
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
            <li>
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-accent">
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-accent">
                {siteConfig.contact.phone}
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
