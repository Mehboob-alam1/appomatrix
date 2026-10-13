"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, Menu } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f4f7f9]/90 backdrop-blur-xl">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-black focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-[92rem] items-center gap-3 px-5">
        <Logo name={siteName} logoUrl={logoUrl} logoAlt={logoAlt} />
        <nav className="ml-4 hidden items-center gap-0.5 xl:flex" aria-label="Main">
          {before.map((link) => (
            <Link key={link.href} href={link.href} className={cn("px-2.5 py-2 text-[13px] text-black/70 hover:text-brand", active(pathname, link.href) && "font-medium text-brand")}>
              {link.label}
            </Link>
          ))}
          <div
            className="group relative"
            data-open={servicesPinned ? "true" : "false"}
            onMouseEnter={() => setServicesPinned(true)}
            onMouseLeave={() => setServicesPinned(false)}
          >
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-2 text-[13px] text-black/70 hover:text-brand",
                (servicesActive || servicesPinned) && "font-medium text-brand",
              )}
              aria-expanded={servicesPinned}
              aria-haspopup="true"
              onClick={() => setServicesPinned(true)}
            >
              Services
              <ChevronDown className={cn("size-3.5 transition", servicesPinned && "rotate-180")} />
            </button>
            <div className={cn("invisible absolute top-full left-0 z-50 w-[40rem] pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100", servicesPinned && "visible opacity-100")}>
              <div className="border border-black/10 bg-white p-5 shadow-[0_24px_60px_rgba(0,0,0,0.08)]">
                <div className="grid grid-cols-2 gap-6">
                  {services.map((group) => (
                    <div key={group.id}>
                      <Link href={`/services/${group.slug}`} className="text-sm font-medium" onClick={() => setServicesPinned(false)}>
                        {group.title}
                      </Link>
                      <ul className="mt-2 space-y-1">
                        {group.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/services/${child.slug}`}
                              className="block py-1.5 text-sm text-black/60 hover:text-brand"
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
                <Link href="/services" className="mt-4 inline-flex items-center gap-1 text-sm font-medium" onClick={() => setServicesPinned(false)}>
                  All services <ArrowUpRight className="size-3.5" />
                </Link>
              </div>
            </div>
          </div>
          {after.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn("px-2.5 py-2 text-[13px] text-black/70 hover:text-brand", active(pathname, link.href) && "font-medium text-brand")}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link href={cta.href || "/contact"} className="ml-auto hidden h-10 items-center gap-1 bg-brand px-4 text-[13px] font-medium text-white xl:inline-flex">
          {cta.label || "Contact Us"} <ArrowUpRight className="size-3.5" />
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="ml-auto inline-flex size-9 items-center justify-center border border-black/15 xl:hidden" aria-label="Open menu">
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-xl tracking-tight">{siteName}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4 pb-8" aria-label="Mobile">
              {before.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cn("px-2 py-2.5 text-lg", active(pathname, link.href) && "font-medium text-brand")}>
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                className="flex items-center justify-between px-2 py-2 text-left text-lg"
                onClick={() => setMobileGroup((value) => (value === "services" ? null : "services"))}
              >
                Services
                <ChevronDown className={cn("size-4", mobileGroup === "services" && "rotate-180")} />
              </button>
              {mobileGroup === "services" ? (
                <div className="space-y-3 border border-black/10 p-3">
                  {services.map((group) => (
                    <div key={group.id}>
                      <Link href={`/services/${group.slug}`} onClick={() => setOpen(false)} className="font-medium">{group.title}</Link>
                      <ul className="mt-1 space-y-1 pl-3">
                        {group.children.map((child) => (
                          <li key={child.id}>
                            <Link href={`/services/${child.slug}`} onClick={() => setOpen(false)} className="text-sm text-muted-foreground">{child.title}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
              {after.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={cn("px-2 py-2.5 text-lg", active(pathname, link.href) && "font-medium text-brand")}>
                  {link.label}
                </Link>
              ))}
              <Link href={cta.href || "/contact"} onClick={() => setOpen(false)} className="mt-3 inline-flex h-12 items-center justify-center bg-brand px-4 text-sm font-medium text-white">
                {cta.label || "Contact Us"}
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
