import parse from "html-react-parser";
import { getSiteSettings } from "@/lib/site-settings-db";
import { RawHtml } from "@/components/site/raw-html";

export function SiteHeadHtml() {
  const { headHtml, globalSeoExtra } = getSiteSettings();
  const combined = [headHtml, globalSeoExtra].filter((s) => s?.trim()).join("\n");
  if (!combined.trim()) return null;
  return <>{parse(combined)}</>;
}

export function SiteBodyStart() {
  const { bodyStartHtml, announcementHtml } = getSiteSettings();
  return (
    <>
      {announcementHtml.trim() ? (
        <div className="border-b border-accent/20 bg-accent/10 px-4 py-2.5 text-center text-sm text-foreground">
          <RawHtml html={announcementHtml} />
        </div>
      ) : null}
      <RawHtml html={bodyStartHtml} />
    </>
  );
}

export function SiteBodyEnd() {
  const { bodyEndHtml } = getSiteSettings();
  return <RawHtml html={bodyEndHtml} />;
}

export function BlogAdSlot({ slot }: { slot: "sidebar" | "in-article" }) {
  const settings = getSiteSettings();
  const html = slot === "sidebar" ? settings.blogSidebarHtml : settings.blogInArticleHtml;
  if (!html.trim()) return null;
  return (
    <aside
      className="overflow-hidden rounded-2xl border border-dashed border-border bg-surface-muted/40 p-4 text-sm"
      aria-label="Sponsored content"
    >
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">Ad</p>
      <RawHtml html={html} />
    </aside>
  );
}
