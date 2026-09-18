/** Trusted HTML from admin site settings only. */
export function RawHtml({ html, className }: { html?: string; className?: string }) {
  if (!html?.trim()) return null;
  return (
    <div
      className={className}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
