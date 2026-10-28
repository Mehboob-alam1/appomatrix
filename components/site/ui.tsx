import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function GradientText({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("gradient-text", className)}>{children}</span>;
}

export function BackgroundGlow({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <span className="glow-orb top-[-10%] left-[-5%] h-[28rem] w-[28rem] bg-[#735CFF]/50" />
      <span className="glow-orb right-[-8%] bottom-[-20%] h-[24rem] w-[24rem] bg-[#4BCAED]/30" style={{ animationDelay: "-4s" }} />
      <span className="glow-orb top-[40%] right-[20%] h-[14rem] w-[14rem] bg-[#947CFF]/25" style={{ animationDelay: "-8s" }} />
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  href?: string;
  linkLabel?: string;
  light?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p
            className={cn(
              "text-[12px] font-semibold uppercase tracking-[0.18em]",
              light ? "text-primary-300" : "text-primary-400",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2 className={cn("mt-2 font-display text-balance", light ? "text-white" : "text-foreground")}>{title}</h2>
        {description ? (
          <div className={cn("mt-3 text-sm leading-relaxed md:text-base", light ? "text-white/70" : "text-muted-foreground")}>
            {description}
          </div>
        ) : null}
      </div>
      {href && linkLabel ? (
        <Link
          href={href}
          className={cn(
            "inline-flex min-h-11 items-center gap-1 text-sm font-semibold",
            light ? "text-white hover:text-primary-300" : "text-primary-400 hover:text-primary-300",
          )}
        >
          {linkLabel} <ArrowUpRight className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}

export function Chip({
  children,
  className,
  active = false,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card/60 text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="min-w-0">
      <p className="font-display text-3xl text-foreground md:text-4xl">{value}</p>
      <p className="mt-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 px-5 py-10 text-center">
      <p className="font-medium text-foreground">{title}</p>
      {children ? <div className="mt-2 text-sm text-muted-foreground">{children}</div> : null}
    </div>
  );
}

export function Stepper({ steps }: { steps: { title: string; body: string }[] }) {
  if (!steps.length) return null;
  return (
    <>
      <ol
        className="hidden gap-3 md:grid"
        style={{ gridTemplateColumns: `repeat(${Math.min(steps.length, 7)}, minmax(0, 1fr))` }}
      >
        {steps.map((step, index) => (
          <li key={`${step.title}-${index}`} className="glass-card relative rounded-2xl p-4">
            <p className="text-xs font-semibold text-primary-400">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-sm font-semibold text-foreground">{step.title}</h3>
            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
      <ol className="space-y-0 border-l border-border md:hidden">
        {steps.map((step, index) => (
          <li key={`${step.title}-${index}`} className="relative pb-6 pl-5 last:pb-0">
            <span className="absolute top-1 left-[-5px] size-2.5 rounded-full bg-primary" />
            <p className="text-xs font-semibold text-primary-400">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-base font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </>
  );
}

export function ProcessPillars({
  steps,
}: {
  steps: { title: string; body: string; number?: string }[];
}) {
  const cols = steps.length >= 6 ? "md:grid-cols-3 lg:grid-cols-3" : steps.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3";
  return (
    <ol className={cn("grid gap-4", cols)}>
      {steps.map((step, index) => (
        <li key={step.title} className="glass-card card-lift relative overflow-hidden rounded-2xl p-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-8 size-32 rounded-full bg-primary/20 blur-3xl"
          />
          <p className="font-display text-4xl text-primary-400/80">{step.number || String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-4 text-xl font-semibold tracking-tight">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function CtaBand({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  footnotes,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  footnotes?: string[];
}) {
  return (
    <section className="section-pad relative overflow-hidden">
      <BackgroundGlow />
      <div className="site-container relative">
        <div className="glass-card relative overflow-hidden rounded-3xl px-6 py-10 md:px-12 md:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(115,92,255,0.28),transparent_55%)]"
          />
          <div className="relative max-w-2xl">
            {eyebrow ? (
              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-primary-300">{eyebrow}</p>
            ) : null}
            <h2 className="font-display mt-2 text-balance">{title}</h2>
            {description ? <div className="mt-4 text-base text-muted-foreground">{description}</div> : null}
            <div className="mt-7 flex flex-wrap gap-3">
              <SiteLinkButton href={primaryHref}>
                {primaryLabel} <ArrowUpRight className="size-4" />
              </SiteLinkButton>
              {secondaryHref && secondaryLabel ? (
                <SiteLinkButton href={secondaryHref} variant="outline">
                  {secondaryLabel}
                </SiteLinkButton>
              ) : null}
            </div>
            {footnotes?.length ? (
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                {footnotes.map((item) => (
                  <li key={item} className="inline-flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-cyan" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteLinkButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "dark";
  className?: string;
}) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition",
    variant === "primary" && "btn-primary",
    variant === "outline" && "btn-secondary",
    variant === "ghost" && "text-foreground hover:bg-white/5",
    variant === "dark" && "bg-white text-[#090D18] hover:bg-primary-50",
    className,
  );
  const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  if (external) {
    return (
      <a href={href} className={classes} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
