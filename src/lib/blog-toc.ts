export type TocItem = { id: string; text: string; level: 2 | 3 | 4 };

export function extractTocFromHtml(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([234])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = regex.exec(html)) !== null) {
    const level = Number(match[1]) as 2 | 3 | 4;
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    if (!text) continue;
    index += 1;
    items.push({
      id: `section-${index}`,
      text,
      level,
    });
  }
  return items;
}

export function addHeadingIds(html: string): string {
  let index = 0;
  return html.replace(/<h([234])([^>]*)>([\s\S]*?)<\/h\1>/gi, (_full, level, attrs, inner) => {
    index += 1;
    const id = `section-${index}`;
    if (String(attrs).includes("id=")) {
      return `<h${level}${attrs}>${inner}</h${level}>`;
    }
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}
