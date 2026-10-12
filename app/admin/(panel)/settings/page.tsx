import { AdminShell } from "@/components/admin/shell";
import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/queries";

export default function SettingsPage() {
  return (
    <AdminShell title="Settings" description="Homepage copy, contact details, stats, industries, and the admin password.">
      <SettingsForm settings={getSettings()} />
    </AdminShell>
  );
}
