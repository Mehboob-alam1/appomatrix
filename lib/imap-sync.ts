import { simpleParser } from "mailparser";
import { importInboundMessage } from "@/lib/email-inbox";
import { mailFromAddress } from "@/lib/mail";

export function imapConfigured() {
  return Boolean(process.env.IMAP_HOST && process.env.IMAP_USER && process.env.IMAP_PASS);
}

/** Pull recent INBOX messages when IMAP_* env vars are set. Safe no-op otherwise. */
export async function syncImapInbox(limit = 40) {
  if (!imapConfigured()) {
    return { ok: false as const, error: "IMAP is not configured.", imported: 0 };
  }

  const { ImapFlow } = await import("imapflow");
  const client = new ImapFlow({
    host: process.env.IMAP_HOST!,
    port: Number(process.env.IMAP_PORT || 993),
    secure: process.env.IMAP_SECURE !== "false",
    auth: {
      user: process.env.IMAP_USER!,
      pass: process.env.IMAP_PASS!,
    },
    logger: false,
  });

  let imported = 0;
  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");
    try {
      const total =
        client.mailbox && typeof client.mailbox === "object" ? Number(client.mailbox.exists || 0) : 0;
      if (!total) return { ok: true as const, imported: 0 };
      const start = Math.max(1, total - limit + 1);
      for await (const message of client.fetch(`${start}:*`, { source: true, uid: true })) {
        if (!message.source) continue;
        const parsed = await simpleParser(message.source);
        const fromEmail = parsed.from?.value?.[0]?.address || "";
        if (!fromEmail) continue;
        const toEmail = parsed.to
          ? Array.isArray(parsed.to)
            ? parsed.to[0]?.value?.[0]?.address
            : parsed.to.value?.[0]?.address
          : mailFromAddress();
        const result = await importInboundMessage({
          providerUid: `imap:${message.uid}`,
          messageId: parsed.messageId || "",
          fromEmail,
          fromName: parsed.from?.value?.[0]?.name || "",
          toEmail: toEmail || mailFromAddress(),
          subject: parsed.subject || "(no subject)",
          bodyText:
            parsed.text ||
            (typeof parsed.html === "string"
              ? parsed.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
              : "") ||
            "",
          bodyHtml: typeof parsed.html === "string" ? parsed.html : undefined,
          inReplyTo: Array.isArray(parsed.inReplyTo) ? parsed.inReplyTo[0] : parsed.inReplyTo || undefined,
          references: Array.isArray(parsed.references) ? parsed.references.join(" ") : parsed.references || undefined,
          sentAt: parsed.date ? parsed.date.toISOString() : undefined,
        });
        if (result.imported) imported += 1;
      }
    } finally {
      lock.release();
    }
    await client.logout();
    return { ok: true as const, imported };
  } catch (error) {
    try {
      await client.logout();
    } catch {
      /* ignore */
    }
    return {
      ok: false as const,
      imported,
      error: error instanceof Error ? error.message : "IMAP sync failed.",
    };
  }
}
