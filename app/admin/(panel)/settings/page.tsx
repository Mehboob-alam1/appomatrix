import { AdminShell } from "@/components/admin/shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/queries";

export default async function SettingsPage() {
  return (
    <AdminShell title="Settings" description="Branding, contact details, homepage copy, SEO defaults, and the admin password.">
      <SettingsForm settings={await getSettings()} />
    </AdminShell>
  );
}
