"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo } from "@/components/site/logo";
import type { NavItem, ServiceNode } from "@/lib/types";
import { cn } from "@/lib/utils";

const FALLBACK = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/career-development", label: "Career Development" },
  { href: "/scholarships", label: "Scholarships" },
  { href: "/blog", label: "Blog" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "About Us" },
];

function active(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({
  siteName,
  logoUrl,
  logoAlt,
  services,
  links,
  cta,
}: {
  siteName: string;
  logoUrl: string;
  logoAlt: string;
  services: ServiceNode[];
  links: NavItem[];
  cta: { href: string; label: string };
}) {
  const pathname = usePathname();
  const source: { href: string; label: string }[] = links.length ? links : FALLBACK;
  const items = source.filter((link) => link.href !== "/contact");
  const homeIndex = items.findIndex((link) => link.href === "/");
  const before = homeIndex >= 0 ? items.slice(0, homeIndex + 1) : [];
  const after = homeIndex >= 0 ? items.slice(homeIndex + 1) : items;
  const [open, setOpen] = useState(false);
  const [servicesPinned, setServicesPinned] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const servicesActive = pathname.startsWith("/services");

  useEffect(() => {
    setOpen(false);
    setServicesPinned(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const navLink = (link: { href: string; label: string }) => (
    <Link
      key={link.href}
      href={link.href}
      className={cn(
        "rounded-[10px] px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        active(pathname, link.href) && "font-semibold text-primary",
      )}
    >
      {link.label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-xl">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-[10px] focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="site-container flex h-16 items-center gap-3">
        <Logo name={siteName} logoUrl={logoUrl} logoAlt={logoAlt} />
        <nav className="ml-2 hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {before.map(navLink)}
          <div
            className="group relative"
            onMouseEnter={() => setServicesPinned(true)}
            onMouseLeave={() => setServicesPinned(false)}
          >
            <button
              type="button"
              className={cn(
                "inline-flex min-h-11 items-center gap-1 rounded-[10px] px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                (servicesActive || servicesPinned) && "font-semibold text-primary",
              )}
              aria-expanded={servicesPinned}
              aria-haspopup="true"
              onClick={() => setServicesPinned((value) => !value)}
            >
              Services
              <ChevronDown className={cn("size-4 transition", servicesPinned && "rotate-180")} />
            </button>
            <div
              className={cn(
                "invisible absolute top-full left-0 z-50 w-[min(42rem,70vw)] pt-2 opacity-0 transition",
                "group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100",
                servicesPinned && "visible opacity-100",
              )}
            >
              <div className="rounded-xl border border-border bg-card p-5 shadow-[0_16px_40px_rgb(15_20_25/0.08)]">
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {services.map((group) => (
                    <div key={group.id}>
                      <Link
                        href={`/services/${group.slug}`}
                        className="text-sm font-semibold text-foreground hover:text-primary"
                        onClick={() => setServicesPinned(false)}
                      >
                        {group.title}
                      </Link>
                      <ul className="mt-2 space-y-0.5">
                        {group.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/services/${child.slug}`}
                              className="block rounded-md px-0 py-1.5 text-sm text-muted-foreground hover:text-primary"
                              onClick={() => setServicesPinned(false)}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link
                  href="/services"
                  className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary"
                  onClick={() => setServicesPinned(false)}
                >
                  All services <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
          {after.map(navLink)}
        </nav>
        <Link
          href={cta.href || "/contact"}
          className="ml-auto hidden min-h-11 items-center gap-1 rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-600 lg:inline-flex"
        >
          {cta.label || "Contact Us"} <ArrowUpRight className="size-4" />
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="ml-auto inline-flex size-11 items-center justify-center rounded-[10px] border border-border bg-card lg:hidden"
            aria-label="Open menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </SheetTrigger>
          <SheetContent side="right" className="flex w-full flex-col overflow-y-auto sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-left text-xl">{siteName}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-1 flex-col gap-1 px-4 pb-6" aria-label="Mobile">
              {before.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn("min-h-12 rounded-[10px] px-3 py-3 text-lg", active(pathname, link.href) && "font-semibold text-primary")}
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                className="flex min-h-12 items-center justify-between rounded-[10px] px-3 py-3 text-left text-lg"
                onClick={() => setMobileGroup((value) => (value === "services" ? null : "services"))}
                aria-expanded={mobileGroup === "services"}
              >
                Services
                <ChevronDown className={cn("size-5", mobileGroup === "services" && "rotate-180")} />
              </button>
              {mobileGroup === "services" ? (
                <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-3">
                  {services.map((group) => (
                    <div key={group.id}>
                      <Link href={`/services/${group.slug}`} onClick={() => setOpen(false)} className="font-semibold">
                        {group.title}
                      </Link>
                      <ul className="mt-1 space-y-1 pl-3">
                        {group.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/services/${child.slug}`}
                              onClick={() => setOpen(false)}
                              className="block min-h-10 py-2 text-sm text-muted-foreground"
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
              {after.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn("min-h-12 rounded-[10px] px-3 py-3 text-lg", active(pathname, link.href) && "font-semibold text-primary")}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={cta.href || "/contact"}
                onClick={() => setOpen(false)}
                className="mt-auto inline-flex min-h-12 items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-foreground"
              >
                {cta.label || "Contact Us"}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
