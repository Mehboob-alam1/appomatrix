"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 glass-panel">
      <Container className="flex h-16 min-w-0 items-center justify-between gap-2 sm:h-[4.25rem] sm:gap-4">
        <Link
          href="/"
          className="group flex min-w-0 shrink items-center gap-2 font-display text-base font-semibold sm:gap-2.5 sm:text-lg"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent via-accent-pink to-accent-tertiary text-sm font-bold text-white shadow-md"
            aria-hidden
          >
            A
          </span>
          <span className="truncate transition-colors group-hover:text-accent">{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition",
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-surface-muted hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button
            href="/contact"
            size="sm"
            analyticsLabel="Book a Free Consultation"
            analyticsLocation="header"
          >
            Free consultation
          </Button>
        </div>

        <button
          type="button"
          className="rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium md:hidden"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </Container>

      <div
        className={cn(
          "max-h-[min(70vh,calc(100dvh-4rem))] overflow-y-auto border-t border-border bg-surface/95 backdrop-blur-md md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <Container className="flex flex-col gap-1 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-surface-muted"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
            <ThemeToggle />
            <Button href="/contact" size="sm" className="flex-1 justify-center" analyticsLocation="mobile-nav">
              Free consultation
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
