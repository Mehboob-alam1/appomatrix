"use client";

import { siteConfig } from "@/lib/site-config";

type AnalyticsEvent =
  | "cta_click"
  | "form_submit"
  | "form_success"
  | "form_error"
  | "newsletter_signup"
  | "exit_intent_submit";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export function trackEvent(
  name: AnalyticsEvent,
  props?: Record<string, string>,
) {
  if (typeof window === "undefined") return;

  if (siteConfig.analytics.plausibleDomain && window.plausible) {
    window.plausible(name, props ? { props } : undefined);
  }

  if (siteConfig.analytics.gaMeasurementId && window.gtag) {
    window.gtag("event", name, props);
  }
}

export function trackCtaClick(label: string, location: string) {
  trackEvent("cta_click", { label, location });
}
