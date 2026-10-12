"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const BUDGETS = ["Not sure yet", "Under $10k", "$10–25k", "$25–50k", "$50k+"];

export function ContactForm({ topics, defaultTopic }: { topics: string[]; defaultTopic?: string }) {
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [pending, setPending] = useState(false);

  if (done) {
    return (
      <div className="border border-black/10 bg-white p-6">
        <h2 className="font-display text-2xl tracking-tight">Received.</h2>
        <p className="mt-2 text-muted-foreground">
          We reply within one business day with a next step. Nothing is approved until you confirm scope.
        </p>
      </div>
    );
  }

  return (
    <form
      className="space-y-5 border border-black/10 bg-white p-6 md:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setError("");
        const result = await submitInquiry(new FormData(event.currentTarget));
        setPending(false);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setDone(true);
      }}
    >
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Phone" name="phone" />
        <Field label="Company" name="company" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <Label htmlFor="topic">Topic</Label>
          <select
            id="topic"
            name="topic"
            defaultValue={defaultTopic || topics[0] || "General inquiry"}
            className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          >
            {topics.map((topic) => (
              <option key={topic}>{topic}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <Label htmlFor="budget">Budget</Label>
          <select id="budget" name="budget" className="h-10 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm" defaultValue={BUDGETS[0]}>
            {BUDGETS.map((budget) => (
              <option key={budget}>{budget}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="block space-y-1.5">
        <Label htmlFor="message">What are you building?</Label>
        <Textarea id="message" name="message" required rows={6} className="min-h-32" placeholder="Goals, timeline, and anything we should know." />
      </label>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="h-10 px-4" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} required={required} className="h-10" />
    </label>
  );
}
