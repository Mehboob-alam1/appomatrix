import type { Metadata } from "next";
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
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const branded = title.includes("Appo Matrix") ? title : `${title} · Appo Matrix`;
  const images = image ? [{ url: image, alt: title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: branded,
      description,
      url,
      type,
      siteName: "Appo Matrix",
      images,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
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

export function organizationJsonLd(settings: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: settings.siteName,
    description: settings.tagline,
    url: siteUrl(),
    email: settings.email,
    telephone: settings.phone,
    image: absoluteUrl("/opengraph-image"),
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
      addressLocality: "Gilgit",
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
    ...(settings.linkedinUrl ? { sameAs: [settings.linkedinUrl] } : {}),
  };
}

export function websiteJsonLd(settings: Settings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: siteUrl(),
    description: settings.tagline,
    publisher: { "@type": "Organization", name: settings.siteName, url: siteUrl() },
  };
}
