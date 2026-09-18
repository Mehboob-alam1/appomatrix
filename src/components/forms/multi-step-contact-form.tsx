"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const steps = ["Contact", "Project", "Budget & timeline", "Details"] as const;

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20";

export function MultiStepContactForm({
  source = "website",
  className,
}: {
  source?: string;
  className?: string;
}) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { source },
    mode: "onTouched",
  });

  const {
    register,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const next = async () => {
    const fieldsByStep: (keyof ContactFormValues)[][] = [
      ["name", "email", "phone"],
      ["projectType"],
      ["budget", "timeline"],
      ["details"],
    ];
    const valid = await trigger(fieldsByStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const onSubmit = handleSubmit(async (values) => {
    setStatus("idle");
    trackEvent("form_submit", { form: "contact", source });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed");
      trackEvent("form_success", { form: "contact" });
      setStatus("success");
    } catch {
      trackEvent("form_error", { form: "contact" });
      setStatus("error");
    }
  });

  if (status === "success") {
    return (
      <div className={cn("rounded-2xl border border-border bg-surface p-8 text-center", className)}>
        <h3 className="font-display text-xl font-semibold">Thank you!</h3>
        <p className="mt-2 text-sm text-muted">
          We received your inquiry and will reply within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("glass-panel rounded-2xl p-6 sm:p-8", className)}
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <span
            key={label}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition",
              i === step
                ? "btn-gradient text-white shadow-sm"
                : i < step
                  ? "bg-accent/15 text-accent"
                  : "bg-surface-muted text-muted",
            )}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {step === 0 ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="name">
              Name
            </label>
            <input id="name" className={inputClass} {...register("name")} />
            {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name.message}</p> : null}
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input id="email" type="email" className={inputClass} {...register("email")} />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            ) : null}
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="phone">
              Phone (optional)
            </label>
            <input id="phone" className={inputClass} {...register("phone")} />
          </div>
        </div>
      ) : null}

      {step === 1 ? (
        <div>
          <label className="text-sm font-medium" htmlFor="projectType">
            Project type
          </label>
          <select id="projectType" className={inputClass} {...register("projectType")}>
            <option value="">Select…</option>
            <option value="web">Web development</option>
            <option value="mobile">Mobile app</option>
            <option value="saas">SaaS product</option>
            <option value="consulting">Digital transformation consulting</option>
          </select>
          {errors.projectType ? (
            <p className="mt-1 text-xs text-red-500">{errors.projectType.message}</p>
          ) : null}
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium" htmlFor="budget">
              Budget range
            </label>
            <select id="budget" className={inputClass} {...register("budget")}>
              <option value="">Select…</option>
              <option value="under-10k">Under $10k</option>
              <option value="10k-25k">$10k – $25k</option>
              <option value="25k-50k">$25k – $50k</option>
              <option value="50k-plus">$50k+</option>
            </select>
            {errors.budget ? (
              <p className="mt-1 text-xs text-red-500">{errors.budget.message}</p>
            ) : null}
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="timeline">
              Timeline
            </label>
            <select id="timeline" className={inputClass} {...register("timeline")}>
              <option value="">Select…</option>
              <option value="asap">ASAP</option>
              <option value="1-3-months">1–3 months</option>
              <option value="3-6-months">3–6 months</option>
              <option value="flexible">Flexible</option>
            </select>
            {errors.timeline ? (
              <p className="mt-1 text-xs text-red-500">{errors.timeline.message}</p>
            ) : null}
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div>
          <label className="text-sm font-medium" htmlFor="details">
            Project details
          </label>
          <textarea
            id="details"
            rows={5}
            className={cn(inputClass, "rounded-2xl")}
            placeholder="Goals, users, integrations, success metrics…"
            {...register("details")}
          />
          {errors.details ? (
            <p className="mt-1 text-xs text-red-500">{errors.details.message}</p>
          ) : null}
          <input type="hidden" {...register("source")} />
        </div>
      ) : null}

      {status === "error" ? (
        <p className="mt-4 text-sm text-red-500">Submission failed. Please try again.</p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {step > 0 ? (
          <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        ) : null}
        {step < steps.length - 1 ? (
          <Button type="button" onClick={next}>
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting} analyticsLocation="contact-form">
            Submit inquiry
          </Button>
        )}
      </div>
    </form>
  );
}
