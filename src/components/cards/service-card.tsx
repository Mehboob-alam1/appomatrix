import Link from "next/link";
import type { Service } from "@/types/content";

const icons: Record<string, string> = {
  globe: "◎",
  smartphone: "▢",
  layers: "≡",
  compass: "✦",
};

const iconStyles: Record<string, string> = {
  globe: "from-accent to-accent-pink",
  smartphone: "from-accent-tertiary to-accent",
  layers: "from-accent-pink to-accent-secondary",
  compass: "from-accent-secondary to-accent-tertiary",
};

export function ServiceCard({ service }: { service: Service }) {
  const key = service.icon ?? "globe";
  const gradient = iconStyles[key] ?? iconStyles.globe;

  return (
    <Link
      href={`/services/${service.slug}`}
      className="card-interactive group flex h-full flex-col rounded-2xl border border-border bg-surface p-6"
    >
      <span
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-xl text-white shadow-lg ${gradient}`}
        aria-hidden
      >
        {icons[key] ?? "◎"}
      </span>
      <h3 className="mt-5 font-display text-xl font-semibold group-hover:text-accent">
        {service.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
        {service.shortDescription}
      </p>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent">
        Learn more <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
