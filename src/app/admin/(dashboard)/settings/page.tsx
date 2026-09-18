import { AdminShell } from "@/components/admin/admin-shell";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import {
  adminHintClass,
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-styles";
import { saveSiteSettings } from "@/lib/admin/settings-actions";
import { getSiteSettings } from "@/lib/site-settings-db";

type PageProps = { searchParams: Promise<{ saved?: string }> };

export default async function AdminSettingsPage({ searchParams }: PageProps) {
  const settings = getSiteSettings();
  const { saved } = await searchParams;

  return (
    <AdminShell title="Site settings">
      {saved ? (
        <p className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          Settings saved. Changes apply on the public site immediately.
        </p>
      ) : null}

      <form action={saveSiteSettings} className="max-w-3xl space-y-6">
        <AdminFormSection
          title="Scripts & tracking"
          description="Paste verified code only (Google Analytics, Meta Pixel, chat widgets, etc.)."
        >
          <label className={adminLabelClass}>
            &lt;head&gt; — meta tags, analytics, fonts
            <textarea
              name="headHtml"
              rows={6}
              defaultValue={settings.headHtml}
              className={adminTextareaClass}
              placeholder={'<meta name="..." />\n<script async src="..."></script>'}
            />
            <p className={adminHintClass}>Injected inside the document head on every page.</p>
          </label>
          <label className={adminLabelClass}>
            Start of &lt;body&gt; — noscript, GTM body snippet
            <textarea
              name="bodyStartHtml"
              rows={4}
              defaultValue={settings.bodyStartHtml}
              className={adminTextareaClass}
            />
          </label>
          <label className={adminLabelClass}>
            End of &lt;body&gt; — deferred scripts, chat loaders
            <textarea
              name="bodyEndHtml"
              rows={6}
              defaultValue={settings.bodyEndHtml}
              className={adminTextareaClass}
              placeholder={'<script>...</script>'}
            />
          </label>
        </AdminFormSection>

        <AdminFormSection
          title="Contact — Calendly"
          description="Embed your scheduling calendar on the Contact page. Admin value overrides NEXT_PUBLIC_CALENDLY_URL."
        >
          <label className={adminLabelClass}>
            Calendly event URL
            <input
              name="calendlyUrl"
              type="url"
              defaultValue={settings.calendlyUrl}
              className={adminInputClass}
              placeholder="https://calendly.com/your-team/discovery-call"
            />
            <p className={adminHintClass}>
              Use the public link from Calendly (Share → Add to website → Inline embed). You can also
              set <code className="text-zinc-300">NEXT_PUBLIC_CALENDLY_URL</code> in production env
              vars.
            </p>
          </label>
        </AdminFormSection>

        <AdminFormSection title="Announcement bar" description="Optional banner above the site header.">
          <label className={adminLabelClass}>
            HTML content
            <textarea
              name="announcementHtml"
              rows={3}
              defaultValue={settings.announcementHtml}
              className={adminTextareaClass}
              placeholder="🚀 Free project estimates this month — <a href='/contact'>Get in touch</a>"
            />
          </label>
        </AdminFormSection>

        <AdminFormSection title="Blog advertisements" description="HTML ad blocks (AdSense, sponsors, promos).">
          <label className={adminLabelClass}>
            Sidebar ad (blog index & posts)
            <textarea
              name="blogSidebarHtml"
              rows={5}
              defaultValue={settings.blogSidebarHtml}
              className={adminTextareaClass}
            />
          </label>
          <label className={adminLabelClass}>
            In-article ad (top of post body)
            <textarea
              name="blogInArticleHtml"
              rows={5}
              defaultValue={settings.blogInArticleHtml}
              className={adminTextareaClass}
            />
          </label>
        </AdminFormSection>

        <AdminFormSection title="Extra SEO" description="Optional JSON-LD or meta overrides (advanced).">
          <label className={adminLabelClass}>
            Additional structured data / meta (HTML)
            <textarea
              name="globalSeoExtra"
              rows={4}
              defaultValue={settings.globalSeoExtra}
              className={adminTextareaClass}
              placeholder='<script type="application/ld+json">{"@context":...}</script>'
            />
          </label>
        </AdminFormSection>

        <button type="submit" className={adminPrimaryButtonClass}>
          Save site settings
        </button>
      </form>
    </AdminShell>
  );
}
