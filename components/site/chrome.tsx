import Link from "next/link";
import { JsonLd } from "@/components/site/json-ld";
import { SafeImage } from "@/components/site/safe-image";
import { paragraphs } from "@/lib/format";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";

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
  return <div className={cn("mx-auto w-full max-w-7xl px-5", className)}>{children}</div>;
}

export function Kicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={cn("font-mono text-[11px] uppercase tracking-[0.22em]", light ? "text-brand" : "text-brand")}>
      {children}
    </p>
  );
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-black/55">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.href}-${item.label}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {last ? (
                <span aria-current="page" className="text-black">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-brand">{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Prose({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("space-y-4 text-[1.05rem] leading-relaxed text-foreground/80", className)}>
      {paragraphs(text).map((block) => (
        <p key={block.slice(0, 48)}>{block}</p>
      ))}
    </div>
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
    <section className="border-b border-black/10">
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Container className="pt-8 pb-16 md:pb-24">
        <Breadcrumbs items={trail} />
        <div className="mt-8">
          <Kicker>{kicker}</Kicker>
        </div>
        <h1 className="font-display mt-4 max-w-4xl text-5xl leading-[0.95] text-balance md:text-7xl">{title}</h1>
        {lead ? <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{lead}</p> : null}
        {image ? (
          <div className="media-card mt-10 max-w-4xl">
            <SafeImage src={image} alt={imageAlt || title} className="aspect-[16/8] w-full object-cover" />
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return <p className="border border-dashed border-black/15 px-5 py-8 text-muted-foreground">{children}</p>;
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium underline decoration-black/30 underline-offset-4 hover:decoration-brand">
      {children}
    </Link>
  );
}
