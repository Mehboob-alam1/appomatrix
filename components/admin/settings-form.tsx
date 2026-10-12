"use client";

import { useState } from "react";
import { saveSettings } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Settings } from "@/lib/types";

const FIELDS: { key: keyof Settings; label: string; area?: boolean; hint?: string }[] = [
  { key: "siteName", label: "Site name" },
  { key: "tagline", label: "Tagline", area: true },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "city", label: "Region label" },
  { key: "heroKicker", label: "Hero kicker" },
  { key: "heroTitle", label: "Hero title" },
  { key: "heroHighlight", label: "Hero highlight" },
  { key: "heroLead", label: "Hero lead", area: true },
  { key: "aboutHeadline", label: "About headline" },
  { key: "aboutBody", label: "About body", area: true, hint: "Blank line between paragraphs." },
  { key: "aboutSecondary", label: "About supporting line", area: true },
  { key: "statsText", label: "Stats", area: true, hint: "One per line: 120+ | Projects delivered" },
  { key: "processText", label: "Process", area: true, hint: "One per line: Discover | Problem, users, and constraints" },
  { key: "industriesText", label: "Industries", area: true, hint: "One per line: Title | Description" },
  { key: "principlesText", label: "Principles", area: true, hint: "One per line: Title | Description" },
  { key: "calendlyUrl", label: "Calendly or booking URL" },
  { key: "linkedinUrl", label: "LinkedIn URL" },
  { key: "whatsappNumber", label: "WhatsApp number", hint: "Country code and number, digits only. Example: 923001234567. Leave blank to hide the WhatsApp button." },
  { key: "whatsappMessage", label: "WhatsApp opening message", area: true, hint: "The first message a visitor sends when they tap WhatsApp." },
];

export function SettingsForm({ settings }: { settings: Settings }) {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="max-w-3xl space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setSaved(false);
        setError("");
        const result = await saveSettings(new FormData(event.currentTarget));
        setPending(false);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setSaved(true);
      }}
    >
      {FIELDS.map((field) => (
        <label key={field.key} className="block space-y-1.5">
          <Label htmlFor={field.key}>{field.label}</Label>
          {field.area ? (
            <Textarea id={field.key} name={field.key} defaultValue={settings[field.key]} rows={4} />
          ) : (
            <Input id={field.key} name={field.key} defaultValue={settings[field.key]} className="h-10" />
          )}
          {field.hint ? <span className="block text-xs text-muted-foreground">{field.hint}</span> : null}
        </label>
      ))}
      <div className="rounded-2xl border border-border p-4">
        <p className="font-medium">Change admin password</p>
        <p className="text-sm text-muted-foreground">Leave blank to keep the current password.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="space-y-1.5">
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" className="h-10" />
          </label>
          <label className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" className="h-10" />
          </label>
        </div>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {saved ? <p className="text-sm text-primary">Saved. The public site is using this copy.</p> : null}
      <Button type="submit" className="h-10 px-4" disabled={pending}>{pending ? "Saving…" : "Save settings"}</Button>
    </form>
  );
}
