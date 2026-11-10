import { requireAdmin, ok, fail, publicError } from "@/lib/http";
import { listEmailThreads, unreadInboxCount } from "@/lib/email-inbox";
import { syncImapInbox, imapConfigured } from "@/lib/imap-sync";
import { smtpConfigured } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const gate = await requireAdmin(request);
  if (gate.error) return gate.error;
  try {
    const url = new URL(request.url);
    const data = await listEmailThreads({
      q: url.searchParams.get("q") || undefined,
      status: url.searchParams.get("status") || "open",
      starred: url.searchParams.get("starred") === "1",
      page: Number(url.searchParams.get("page") || 1),
      pageSize: Number(url.searchParams.get("pageSize") || 30),
    });
    const unread = await unreadInboxCount();
    return ok({
      ...data,
      unread,
      smtpConfigured: smtpConfigured(),
      imapConfigured: imapConfigured(),
    });
  } catch (error) {
    return publicError(error);
  }
}

export async function POST(request: Request) {
  const gate = await requireAdmin(request);
  if (gate.error) return gate.error;
  try {
    const body = (await request.json().catch(() => ({}))) as { action?: string };
    if (body.action === "sync") {
      const result = await syncImapInbox();
      if (!result.ok) return fail(result.error || "Sync failed.", 400, result);
      return ok(result);
    }
    return fail("Unknown action.", 400);
  } catch (error) {
    return publicError(error);
  }
}
