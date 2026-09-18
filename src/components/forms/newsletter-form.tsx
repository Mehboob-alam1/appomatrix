"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema } from "@/lib/validations/contact";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

type NewsletterValues = { email: string };

export function NewsletterForm({ compact }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("idle");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed");
      trackEvent("newsletter_signup");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      trackEvent("form_error", { form: "newsletter" });
    }
  });

  return (
    <form onSubmit={onSubmit} className={compact ? "flex flex-col gap-2 sm:flex-row" : "space-y-3"}>
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">
          Email
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="you@company.com"
          className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
          {...register("email")}
        />
        {errors.email ? (
          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
        ) : null}
      </div>
      <Button type="submit" disabled={isSubmitting} analyticsLocation="newsletter">
        Subscribe
      </Button>
      {status === "success" ? (
        <p className="text-sm text-accent sm:basis-full">Thanks — check your inbox soon.</p>
      ) : null}
      {status === "error" ? (
        <p className="text-sm text-red-500 sm:basis-full">Something went wrong. Try again.</p>
      ) : null}
    </form>
  );
}
