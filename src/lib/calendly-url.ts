/** Normalize a Calendly link for inline iframe embed. */
export function resolveCalendlyEmbedUrl(raw: string | undefined | null): string | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;

  let href = trimmed;
  if (!/^https?:\/\//i.test(href)) {
    href = `https://${href}`;
  }

  try {
    const url = new URL(href);
    if (!url.hostname.includes("calendly.com")) {
      return href;
    }

    if (!url.pathname.endsWith("/embed")) {
      url.pathname = url.pathname.replace(/\/?$/, "/embed");
    }

    if (!url.searchParams.has("embed_type")) {
      url.searchParams.set("embed_type", "Inline");
    }

    const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (siteOrigin && !url.searchParams.has("embed_domain")) {
      try {
        url.searchParams.set("embed_domain", new URL(siteOrigin).hostname);
      } catch {
        /* ignore invalid site URL */
      }
    }

    return url.toString();
  } catch {
    return null;
  }
}
