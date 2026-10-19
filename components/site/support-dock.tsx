"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Headphones, Mail, Phone, X } from "lucide-react";
import { whatsappHref } from "@/lib/contact";

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-current">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.8.6.6-3.7-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.3a.5.5 0 0 0 0-.5c-.1-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.4 11.4 0 0 0 4.4 3.9c.5.2 1 .4 1.5.5a3.6 3.6 0 0 0 1.6.1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

export function SupportDock({
  siteName,
  email,
  phone,
  whatsappNumber,
  whatsappMessage,
}: {
  siteName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  whatsappMessage: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const whatsapp = whatsappHref(whatsappNumber, whatsappMessage);
  const tel = phone.replace(/\s/g, "");

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const circle =
    "relative grid size-12 place-items-center rounded-full text-white shadow-[0_8px_24px_rgba(15,20,25,0.18)] transition duration-200 hover:scale-105 active:scale-95 sm:size-14";

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom)] sm:right-5 sm:bottom-5">
      {open ? (
        <section
          id={panelId}
          aria-label="Customer support"
          className="dock-panel mb-1 w-[min(100vw-5.5rem,22rem)] rounded-xl border border-border bg-card p-5 shadow-[0_16px_40px_rgba(15,20,25,0.12)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">Customer support</p>
              <h2 className="mt-2 text-xl font-semibold">Talk with the team</h2>
            </div>
            <button type="button" className="grid size-10 place-items-center rounded-[10px] border border-border" onClick={() => setOpen(false)} aria-label="Close customer support">
              <X className="size-4" />
            </button>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Message {siteName} on WhatsApp, or send a note through the studio. We reply within one business day.
          </p>
          <div className="mt-4 grid gap-2">
            {whatsapp ? (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] bg-[#25D366] px-4 text-sm font-semibold text-white">
                <WhatsAppMark /> WhatsApp
              </a>
            ) : null}
            {email ? (
              <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-border px-4 text-sm">
                <Mail className="size-4" /> {email}
              </a>
            ) : null}
            {tel ? (
              <a href={`tel:${tel}`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-border px-4 text-sm">
                <Phone className="size-4" /> {phone}
              </a>
            ) : null}
            <Link href="/contact" className="inline-flex min-h-11 items-center justify-center rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-foreground" onClick={() => setOpen(false)}>
              Contact Us
            </Link>
          </div>
        </section>
      ) : null}
      <div className="dock-in group relative" style={{ animationDelay: "90ms" }}>
        {open ? null : (
          <span className="dock-label pointer-events-none absolute top-1/2 right-[4.25rem] bg-white px-3 py-1.5 text-sm whitespace-nowrap shadow-md">
            Customer support
          </span>
        )}
        <button
          type="button"
          className={`${circle} bg-primary`}
          aria-label={open ? "Close customer support" : "Customer support"}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="absolute top-0.5 right-0.5 size-3 rounded-full border-2 border-white bg-[#25D366]" aria-hidden="true" />
          {open ? <X className="size-5" /> : <Headphones className="size-6" />}
        </button>
      </div>
      {whatsapp ? (
        <div className="dock-in group relative">
          <span className="dock-label pointer-events-none absolute top-1/2 right-[4.25rem] bg-white px-3 py-1.5 text-sm whitespace-nowrap shadow-md">
            WhatsApp
          </span>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className={`${circle} bg-[#25D366]`}
          >
            <span className="dock-ring pointer-events-none absolute inset-0 rounded-full bg-[#25D366]" aria-hidden="true" />
            <WhatsAppMark />
          </a>
        </div>
      ) : null}
    </div>
  );
}
