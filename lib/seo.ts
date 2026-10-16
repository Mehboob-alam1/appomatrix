import { getPageMeta, getSettings } from "@/lib/queries";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  organizationJsonLd,
  pageMetadata,
  siteUrl,
  websiteJsonLd,
  type Crumb,
} from "@/lib/seo-core";

export {
  absoluteUrl,
  breadcrumbJsonLd,
  organizationJsonLd,
  pageMetadata,
  siteUrl,
  websiteJsonLd,
  type Crumb,
};

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
