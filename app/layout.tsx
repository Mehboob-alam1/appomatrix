import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { defaultSettings } from "@/lib/defaults";
import { getSettings } from "@/lib/queries";
import { richTextPlain } from "@/lib/rich-text";
import { siteUrl } from "@/lib/seo-core";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  let settings = defaultSettings;
  try {
    settings = await getSettings();
  } catch {
    settings = defaultSettings;
  }
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: settings.seoTitle || settings.siteName,
      template: `%s · ${settings.siteName}`,
    },
    description: settings.seoDescription || richTextPlain(settings.tagline) || settings.tagline,
    applicationName: settings.siteName,
    authors: [{ name: settings.siteName, url: siteUrl() }],
    creator: settings.siteName,
    category: "technology",
    robots: { index: true, follow: true },
    icons: {
      icon: settings.faviconUrl || "/brand/appo-matrix-favicon.png",
      apple: "/brand/apple-touch-icon.png",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: settings.siteName,
      title: settings.seoTitle || settings.siteName,
      description: settings.seoDescription || richTextPlain(settings.tagline) || settings.tagline,
      images: settings.seoImage ? [{ url: settings.seoImage, alt: settings.seoImageAlt || settings.siteName }] : undefined,
    },
    twitter: { card: settings.seoImage ? "summary_large_image" : "summary" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
