"use client";

import { useState } from "react";
import { saveSettingsAction } from "@/lib/actions";
import { csrfTokenFromDocument } from "@/lib/csrf-client";
import { ImageField } from "@/components/admin/media";
import { RichTextField } from "@/components/admin/rich-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Settings } from "@/lib/types";

const GROUPS: { title: string; fields: { key: keyof Settings; label: string; area?: boolean; rich?: boolean; hint?: string }[] }[] = [
  {
    title: "Branding and contact",
    fields: [
      { key: "siteName", label: "Site name" },
      { key: "tagline", label: "Tagline", area: true },
      { key: "logoAlt", label: "Logo alt text" },
      { key: "footerNote", label: "Footer note", area: true, hint: "Shown under the site name. Leave blank to use the tagline." },
      { key: "copyrightText", label: "Copyright line", hint: "Leave blank for “© year Site name”." },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "address", label: "Address" },
      { key: "city", label: "Region label" },
    ],
  },
  {
    title: "Homepage hero and calls to action",
    fields: [
      { key: "heroKicker", label: "Hero kicker" },
      { key: "heroTitle", label: "Hero title" },
      { key: "heroHighlight", label: "Hero highlight" },
      { key: "heroLead", label: "Hero lead", area: true },
      { key: "heroImageAlt", label: "Hero image alt text" },
      { key: "heroCaption", label: "Hero caption" },
      { key: "ctaPrimaryLabel", label: "Primary button label" },
      { key: "ctaPrimaryHref", label: "Primary button link" },
      { key: "ctaSecondaryLabel", label: "Secondary button label" },
      { key: "ctaSecondaryHref", label: "Secondary button link" },
    ],
  },
  {
    title: "About, stats, and homepage copy",
    fields: [
      { key: "aboutHeadline", label: "About headline" },
      { key: "aboutBody", label: "About body", rich: true, hint: "Use headings, lists, highlight, and alignment." },
      { key: "aboutSecondary", label: "About supporting line", area: true },
      { key: "statsText", label: "Stats", area: true, hint: "One per line: 120+ | Projects delivered" },
      { key: "processText", label: "Process", area: true, hint: "One per line: Discover | Problem, users, and constraints" },
      { key: "industriesText", label: "Industries", area: true, hint: "One per line: Title | Description" },
      { key: "principlesText", label: "Principles", area: true, hint: "One per line: Title | Description" },
    ],
  },
  {
    title: "SEO defaults",
    fields: [
      { key: "seoTitle", label: "Default title" },
      { key: "seoDescription", label: "Default description", area: true },
      { key: "seoImageAlt", label: "Social image alt text" },
    ],
  },
  {
    title: "Booking and WhatsApp",
    fields: [
      { key: "calendlyUrl", label: "Calendly or booking URL" },
      { key: "linkedinUrl", label: "LinkedIn URL", hint: "Also add profiles under Social links." },
      { key: "whatsappNumber", label: "WhatsApp number", hint: "Country code and number, digits only. Leave blank to hide the button." },
      { key: "whatsappMessage", label: "WhatsApp opening message", area: true },
    ],
  },
];

export function SettingsForm({ settings }: { settings: Settings }) {
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="max-w-3xl space-y-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setPending(true);
        setSaved(false);
        setError("");
        const form = new FormData(event.currentTarget);
        form.set("csrf", csrfTokenFromDocument());
        const result = await saveSettingsAction(form);
        setPending(false);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setSaved(true);
      }}
    >
      <section className="space-y-4">
        <h2 className="font-display text-2xl">Logo, favicon, and images</h2>
        <ImageField name="logoUrl" label="Logo" defaultValue={settings.logoUrl} hint="Transparent PNG works best in the header" aspect="wide" />
        <ImageField name="faviconUrl" label="Favicon" defaultValue={settings.faviconUrl} hint="Square mark for the browser tab" aspect="square" />
        <ImageField name="heroImage" label="Homepage hero image" defaultValue={settings.heroImage} hint="Full-width photo under the homepage headline" aspect="wide" />
        <ImageField name="seoImage" label="Default social image" defaultValue={settings.seoImage} hint="Shown when the site is shared on social apps" aspect="wide" />
      </section>
      {GROUPS.map((group) => (
        <section key={group.title} className="space-y-4">
          <h2 className="font-display text-2xl">{group.title}</h2>
          {group.fields.map((field) =>
            field.rich ? (
              <RichTextField
                key={field.key}
                label={field.label}
                name={field.key}
                defaultValue={settings[field.key]}
                hint={field.hint}
                minHeight="240px"
              />
            ) : (
              <label key={field.key} className="block space-y-1.5">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.area ? (
                  <Textarea id={field.key} name={field.key} defaultValue={settings[field.key]} rows={4} />
                ) : (
                  <Input id={field.key} name={field.key} defaultValue={settings[field.key]} className="h-10" />
                )}
                {field.hint ? <span className="block text-xs text-muted-foreground">{field.hint}</span> : null}
              </label>
            ),
          )}
        </section>
      ))}
      <p className="text-sm text-muted-foreground">
        Navigation, social profiles, homepage section headings, and each page’s title, copy, and image are edited in their own sections.
      </p>
      <div className="rounded-2xl border border-border p-4">
        <p className="font-medium">Change admin password</p>
        <p className="text-sm text-muted-foreground">Leave blank to keep the current password. Stored as a salted hash.</p>
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
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      {saved ? <p className="text-sm text-primary" role="status">Saved. The public site is using this copy.</p> : null}
      <Button type="submit" className="h-10 px-4" disabled={pending}>{pending ? "Saving…" : "Save settings"}</Button>
    </form>
  );
}
