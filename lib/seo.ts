import type { Metadata } from "next";
import { getPageMeta, getSettings } from "@/lib/queries";
import { richTextPlain } from "@/lib/rich-text";
import type { Settings } from "@/lib/types";

export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || "https://www.appomatrix.com";
  return configured.replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  siteName = "Appo Matrix",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  siteName?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const branded = title.includes(siteName) ? title : `${title} · ${siteName}`;
  const images = image ? [{ url: image, alt: title }] : undefined;
  const plainDescription = richTextPlain(description) || description;
  return {
    title,
    description: plainDescription,
    alternates: { canonical: url },
    openGraph: {
      title: branded,
      description: plainDescription,
      url,
      type,
      siteName,
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: branded,
      description: plainDescription,
      images: image ? [image] : undefined,
    },
  };
}

export async function metadataFor(
  path: string,
  fallback: { title: string; description: string },
  extra?: { image?: string; type?: "website" | "article" },
) {
  try {
    const settings = await getSettings();
    const custom = await getPageMeta(path);
    return pageMetadata({
      title: custom?.title || fallback.title,
      description: custom?.description || fallback.description,
      path,
      siteName: settings.siteName,
      image: extra?.image || settings.seoImage || undefined,
      type: extra?.type,
    });
  } catch {
    return pageMetadata({ ...fallback, path, image: extra?.image, type: extra?.type });
  }
}

export async function contentMetadata(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}) {
  try {
    const settings = await getSettings();
    return pageMetadata({ ...input, siteName: settings.siteName, image: input.image || settings.seoImage || undefined });
  } catch {
    return pageMetadata(input);
  }
}

export type Crumb = { href: string; label: string };

export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function organizationJsonLd(settings: Settings, sameAs: string[] = []) {
  const profiles = [...sameAs];
  if (settings.linkedinUrl && !profiles.includes(settings.linkedinUrl)) profiles.push(settings.linkedinUrl);
  const image = settings.seoImage || settings.logoUrl;
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: settings.siteName,
    description: richTextPlain(settings.tagline) || settings.tagline,
    url: siteUrl(),
    email: settings.email,
    telephone: settings.phone,
    image: image ? absoluteUrl(image) : absoluteUrl("/opengraph-image"),
    logo: settings.logoUrl ? absoluteUrl(settings.logoUrl) : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: settings.city || "Gilgit",
      addressRegion: "Gilgit-Baltistan",
      addressCountry: "PK",
    },
    areaServed: "Worldwide",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: settings.phone,
      email: settings.email,
      areaServed: "Worldwide",
      availableLanguage: ["English"],
    },
    ...(profiles.length ? { sameAs: profiles } : {}),
  };
}

export function websiteJsonLd(settings: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: siteUrl(),
    description: richTextPlain(settings.tagline) || settings.tagline,
    publisher: { "@type": "Organization", name: settings.siteName, url: siteUrl() },
  };
}
