import Link from "next/link";
import { JsonLd } from "@/components/site/json-ld";
import { Prose } from "@/components/site/prose";
import { SafeImage } from "@/components/site/safe-image";
import { BackgroundGlow, Chip, GradientText } from "@/components/site/ui";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo-core";
import { cn } from "@/lib/utils";

export { Prose } from "@/components/site/prose";

const SECTION_PATHS: Record<string, string> = {
  Services: "/services",
  Portfolio: "/portfolio",
  Work: "/portfolio",
  "Career Development": "/career-development",
  Scholarships: "/scholarships",
  Blog: "/blog",
  Insights: "/blog",
  Team: "/team",
  "About Us": "/about",
  About: "/about",
  "Contact Us": "/contact",
  Contact: "/contact",
};

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("site-container", className)}>{children}</div>;
}

export function Kicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={cn(
        "text-[12px] font-semibold uppercase tracking-[0.16em]",
        light ? "text-primary-300" : "text-primary-400",
      )}
    >
      {children}
    </p>
  );
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.href}-${item.label}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-border">
                  /
                </span>
              ) : null}
              {last ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-primary-400">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function PageHero({
  kicker,
  title,
  lead,
  path,
  ancestors = [],
  image,
  imageAlt,
  highlight,
}: {
  kicker: string;
  title: string;
  lead?: string;
  path?: string;
  ancestors?: Crumb[];
  image?: string;
  imageAlt?: string;
  /** Phrase inside title to render with violet→cyan gradient (exact substring match). */
  highlight?: string;
}) {
  const section = SECTION_PATHS[kicker];
  const here = path ?? section ?? "/";
  const trail: Crumb[] = [
    { href: "/", label: "Home" },
    ...ancestors,
    { href: here, label: ancestors.length > 0 ? title : kicker },
  ];

  let titleNode: React.ReactNode = title;
  if (highlight && title.includes(highlight)) {
    const [before, after] = title.split(highlight);
    titleNode = (
      <>
        {before}
        <GradientText>{highlight}</GradientText>
        {after}
      </>
    );
  }

  return (
    <section className="relative overflow-hidden border-b border-border">
      <BackgroundGlow className="opacity-50" />
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Container className="relative pt-10 pb-10 md:pt-14 md:pb-14">
        <Breadcrumbs items={trail} />
        <div className="mt-6 max-w-3xl">
          <Chip className="border-primary/30 bg-primary/10 text-primary-300">{kicker}</Chip>
          <h1 className="font-display mt-4 text-balance">{titleNode}</h1>
          {lead ? <Prose text={lead} className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg" /> : null}
        </div>
        {image ? (
          <div className="media-card glass-card mt-8 max-w-4xl overflow-hidden rounded-2xl p-1.5">
            <SafeImage src={image} alt={imageAlt || title} className="aspect-[16/8] w-full rounded-[0.9rem] object-cover" />
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-border bg-card/40 px-5 py-8 text-muted-foreground">{children}</p>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-primary-400 underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
    >
      {children}
    </Link>
  );
}
