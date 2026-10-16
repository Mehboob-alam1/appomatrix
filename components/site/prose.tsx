import { paragraphs } from "@/lib/format";
import { looksLikeHtml, sanitizeRichText } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

export function Prose({ text, className }: { text: string; className?: string }) {
  if (looksLikeHtml(text)) {
    return (
      <div
        className={cn("rich-prose text-[1.05rem] leading-relaxed text-foreground/80", className)}
        dangerouslySetInnerHTML={{ __html: sanitizeRichText(text) }}
      />
    );
  }
  return (
    <div className={cn("space-y-4 text-[1.05rem] leading-relaxed text-foreground/80", className)}>
      {paragraphs(text).map((block) => (
        <p key={block.slice(0, 48)}>{block}</p>
      ))}
    </div>
  );
}
