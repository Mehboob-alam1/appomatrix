import Link from "next/link";
import { JsonLd } from "@/components/site/json-ld";
import { Prose } from "@/components/site/prose";
import { SafeImage } from "@/components/site/safe-image";
import { Chip } from "@/components/site/ui";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo-core";
import { cn } from "@/lib/utils";

export { Prose } from "@/components/site/prose";

const SECTION_PATHS: Record<string, string> = {
  Services: "/services",
  Portfolio: "/portfolio",
  "Career Development": "/career-development",
  Scholarships: "/scholarships",
  Blog: "/blog",
  Team: "/team",
  "About Us": "/about",
  "Contact Us": "/contact",
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
    <p className={cn("text-[12px] font-medium uppercase tracking-[0.16em]", light ? "text-primary-300" : "text-primary")}>
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
              {index > 0 ? <span aria-hidden="true" className="text-border">/</span> : null}
              {last ? (
                <span aria-current="page" className="font-medium text-foreground">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-primary">
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
}: {
  kicker: string;
  title: string;
  lead?: string;
  path?: string;
  ancestors?: Crumb[];
  image?: string;
  imageAlt?: string;
}) {
  const section = SECTION_PATHS[kicker];
  const here = path ?? section ?? "/";
  const trail: Crumb[] = [
    { href: "/", label: "Home" },
    ...ancestors,
    { href: here, label: ancestors.length > 0 ? title : kicker },
  ];
  return (
    <section className="border-b border-border">
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Container className="pt-6 pb-7 md:pt-8 md:pb-9">
        <Breadcrumbs items={trail} />
        <div className="mt-4 max-w-3xl">
          <Chip>{kicker}</Chip>
          <h1 className="font-display mt-3 text-balance">{title}</h1>
          {lead ? <Prose text={lead} className="mt-3 max-w-2xl text-base text-muted-foreground" /> : null}
        </div>
        {image ? (
          <div className="media-card mt-5 max-w-4xl">
            <SafeImage src={image} alt={imageAlt || title} className="aspect-[16/8] w-full object-cover" />
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-border bg-card px-5 py-8 text-muted-foreground">{children}</p>
  );
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
    >
      {children}
    </Link>
  );
}
