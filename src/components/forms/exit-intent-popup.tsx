"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema } from "@/lib/validations/contact";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

type FormValues = { email: string };

export function ExitIntentPopup() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const { register, handleSubmit, formState, reset } = useForm<FormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  useEffect(() => {
    if (sessionStorage.getItem("exit-intent-shown")) return;

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setOpen(true);
        sessionStorage.setItem("exit-intent-shown", "1");
      }
    };

    document.addEventListener("mouseout", onMouseLeave);
    return () => document.removeEventListener("mouseout", onMouseLeave);
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, leadMagnet: "project-estimate" }),
      });
      if (!res.ok) throw new Error("fail");
      trackEvent("exit_intent_submit");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal
        aria-labelledby="exit-intent-title"
        className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
      >
        <button
          type="button"
          className="float-right text-sm text-muted"
          onClick={() => setOpen(false)}
        >
          Close
        </button>
        <h2 id="exit-intent-title" className="font-display text-xl font-semibold pr-8">
          Get a free project estimate
        </h2>
        <p className="mt-2 text-sm text-muted">
          Share your email and we&apos;ll send a concise checklist to scope your next build.
        </p>
        {status === "success" ? (
          <p className="mt-4 text-sm text-accent">Check your inbox — we&apos;re on it.</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full rounded-xl border border-border px-4 py-2.5 text-sm"
              {...register("email")}
            />
            {formState.errors.email ? (
              <p className="text-xs text-red-500">{formState.errors.email.message}</p>
            ) : null}
            {status === "error" ? (
              <p className="text-xs text-red-500">Could not submit. Try again.</p>
            ) : null}
            <Button type="submit" disabled={formState.isSubmitting} analyticsLocation="exit-intent">
              Send me the checklist
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
