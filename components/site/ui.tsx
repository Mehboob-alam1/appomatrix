import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  light = false,
}: {
  eyebrow?: string;
  title: string;
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
              "text-[12px] font-medium uppercase tracking-[0.16em]",
              light ? "text-primary-300" : "text-primary",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h2 className={cn("mt-1.5 font-display", light ? "text-white" : "text-foreground")}>{title}</h2>
        {description ? (
          <div className={cn("mt-2 text-sm leading-relaxed", light ? "text-white/70" : "text-muted-foreground")}>
            {description}
          </div>
        ) : null}
      </div>
      {href && linkLabel ? (
        <Link
          href={href}
          className={cn(
            "inline-flex min-h-11 items-center gap-1 text-sm font-medium",
            light ? "text-white hover:text-primary-200" : "text-foreground hover:text-primary",
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
          : "border-border bg-card text-muted-foreground",
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
      <p className="font-display text-3xl text-primary md:text-4xl">{value}</p>
      <p className="mt-1 text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-5 py-10 text-center">
      <p className="font-medium text-foreground">{title}</p>
      {children ? <div className="mt-2 text-sm text-muted-foreground">{children}</div> : null}
    </div>
  );
}

export function Stepper({ steps }: { steps: { title: string; body: string }[] }) {
  if (!steps.length) return null;
  return (
    <>
      <ol className="hidden gap-3 md:grid" style={{ gridTemplateColumns: `repeat(${Math.min(steps.length, 7)}, minmax(0, 1fr))` }}>
        {steps.map((step, index) => (
          <li key={`${step.title}-${index}`} className="relative rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-semibold text-primary">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-sm font-semibold text-foreground">{step.title}</h3>
            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
      <ol className="space-y-0 border-l border-border md:hidden">
        {steps.map((step, index) => (
          <li key={`${step.title}-${index}`} className="relative pl-5 pb-6 last:pb-0">
            <span className="absolute top-1 left-[-5px] size-2.5 rounded-full bg-primary" />
            <p className="text-xs font-semibold text-primary">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="mt-1 text-base font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </>
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
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-semibold transition-colors",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary-600",
        variant === "outline" && "border border-foreground/20 bg-transparent text-foreground hover:border-primary hover:text-primary",
        variant === "ghost" && "text-foreground hover:bg-muted",
        variant === "dark" && "bg-white text-surface-dark hover:bg-primary-50",
        className,
      )}
    >
      {children}
    </Link>
  );
}
