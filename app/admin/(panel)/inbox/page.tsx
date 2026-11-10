import { AdminShell } from "@/components/admin/shell";
import { EmailInbox } from "@/components/admin/inbox";
import { getSettings } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const settings = await getSettings();
  return (
    <AdminShell
      title="Email inbox"
      description="Read client messages, manage conversations, and reply from the company address using SMTP. Contact form inquiries appear here automatically. Optional IMAP sync pulls mail from the provider inbox."
    >
      <EmailInbox companyEmail={settings.email || "hello@appomatrix.com"} />
    </AdminShell>
  );
}
