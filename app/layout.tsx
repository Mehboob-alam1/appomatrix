import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Appo Matrix is a software studio in Gilgit-Baltistan. Web, mobile, and SaaS for teams worldwide, plus careers, scholarships, and a public portfolio.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Appo Matrix — Software studio in Gilgit-Baltistan",
    template: "%s · Appo Matrix",
  },
  description,
  applicationName: "Appo Matrix",
  authors: [{ name: "Appo Matrix", url: siteUrl() }],
  creator: "Appo Matrix",
  category: "technology",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Appo Matrix",
    title: "Appo Matrix — Software studio in Gilgit-Baltistan",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
