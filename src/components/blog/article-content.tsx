import { addHeadingIds } from "@/lib/blog-toc";
import { sanitizeRichHtml } from "@/lib/sanitize-html";

export function ArticleContent({ html, fallback }: { html?: string; fallback?: string }) {
  const raw = html?.trim() || fallback?.trim();
  if (!raw) return null;

  const looksLikeHtml = raw.startsWith("<") || /<\/?[a-z][\s\S]*>/i.test(raw);
  if (looksLikeHtml) {
    const withIds = addHeadingIds(raw);
    const clean = sanitizeRichHtml(withIds);
    return (
      <div
        className="rich-content leading-relaxed text-muted"
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }

  return (
    <div className="space-y-4 leading-relaxed text-muted">
      {raw.split(/\n\n+/).map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </div>
  );
}
