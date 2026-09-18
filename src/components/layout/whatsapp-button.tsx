"use client";

import { trackCtaClick } from "@/lib/analytics";

export function WhatsAppButton({ whatsapp }: { whatsapp: string }) {
  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    "Hi Appo Matrix — I'd like to discuss a project.",
  )}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => trackCtaClick("WhatsApp", "floating-button")}
      className="fixed z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-lg font-bold text-white shadow-lg shadow-[#25D366]/40 ring-4 ring-[#25D366]/25 transition hover:scale-110 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14 sm:text-xl bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))]"
    >
      ✆
    </a>
  );
}
