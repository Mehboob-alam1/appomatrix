import { siteConfig } from "@/lib/site-config";
import { resolveCalendlyEmbedUrl } from "@/lib/calendly-url";
import { getSiteSettings } from "@/lib/site-settings-db";

export function CalendlyEmbed() {
  const settings = getSiteSettings();
  const embedUrl = resolveCalendlyEmbedUrl(settings.calendlyUrl || siteConfig.calendlyUrl);

  if (!embedUrl) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface-muted/40 p-8 text-sm text-muted">
        <p className="font-medium text-foreground">Scheduling calendar not configured</p>
        <p className="mt-2">
          Add your Calendly link in{" "}
          <strong className="text-foreground">Admin → Site settings</strong>, or set{" "}
          <code className="rounded bg-background px-1.5 py-0.5 text-foreground">
            NEXT_PUBLIC_CALENDLY_URL
          </code>{" "}
          in <code className="rounded bg-background px-1.5 py-0.5 text-foreground">.env.local</code>{" "}
          (restart the dev server after changing env vars).
        </p>
        <p className="mt-3 text-xs">
          Example:{" "}
          <code className="text-foreground">https://calendly.com/your-team/30-minute-call</code>
        </p>
      </div>
    );
  }

  return (
    <iframe
      title="Book a call with Appo Matrix"
      src={embedUrl}
      className="h-[680px] w-full bg-white"
    />
  );
}
