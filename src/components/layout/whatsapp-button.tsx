"use client";

import { siteConfig } from "@/lib/site-config";
import { trackCtaClick } from "@/lib/analytics";

export function WhatsAppButton() {
  const url = `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
    "Hi Appo Matrix — I'd like to discuss a project.",
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => trackCtaClick("WhatsApp", "floating-button")}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-xl font-bold text-white shadow-lg shadow-[#25D366]/40 ring-4 ring-[#25D366]/25 transition hover:scale-110"
    >
      ✆
    </a>
  );
}
