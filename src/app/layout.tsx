import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import { buildMetadata } from "@/lib/metadata";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AnalyticsScripts } from "@/components/providers/analytics-scripts";
import { SiteBodyEnd, SiteBodyStart, SiteHeadHtml } from "@/components/site/site-injections";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

export const metadata: Metadata = buildMetadata({});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${syne.variable} h-full scroll-smooth`}>
      <head>
        <SiteHeadHtml />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <ThemeProvider>
          <AnalyticsScripts />
          <SiteBodyStart />
          {children}
          <SiteBodyEnd />
        </ThemeProvider>
      </body>
    </html>
  );
}
