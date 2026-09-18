import { htmlToPlainText, sanitizeRichHtml } from "@/lib/sanitize-html";

export function RichText({ value, fallback }: { value?: string; fallback?: string }) {
  const raw = value?.trim() || fallback?.trim();
  if (!raw) return null;

  const looksLikeHtml = raw.startsWith("<") || /<\/?[a-z][\s\S]*>/i.test(raw);

  if (looksLikeHtml) {
    const clean = sanitizeRichHtml(raw);
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

export { htmlToPlainText };
