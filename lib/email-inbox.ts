import { randomBytes } from "crypto";
import sanitizeHtml from "sanitize-html";
import { all, allUnsafe, get, run, runUnsafe } from "@/lib/db";
import { mailFromAddress, plainToHtml, sendMail, smtpConfigured } from "@/lib/mail";
import type { EmailMessage, EmailThread, EmailThreadDetail } from "@/lib/types";

function id(prefix: string) {
  return `${prefix}_${randomBytes(8).toString("hex")}`;
}

function now() {
  return new Date().toISOString();
}

type QueryOpts = { duringMigrate?: boolean };

function execAll(sql: string, params: (string | number | null)[] = [], opts?: QueryOpts) {
  return opts?.duringMigrate ? allUnsafe(sql, params) : all(sql, params);
}

function execRun(sql: string, params: (string | number | null)[] = [], opts?: QueryOpts) {
  return opts?.duringMigrate ? runUnsafe(sql, params) : run(sql, params);
}

export function sanitizeEmailHtml(html: string) {
  return sanitizeHtml(html || "", {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "width", "height"],
      a: ["href", "name", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto", "cid"],
  });
}

function mapThread(row: Record<string, unknown>): EmailThread {
  return {
    id: String(row.id),
    subject: String(row.subject || ""),
    participantEmail: String(row.participant_email || ""),
    participantName: String(row.participant_name || ""),
    inquiryId: row.inquiry_id ? String(row.inquiry_id) : null,
    source: String(row.source || "contact_form"),
    status: String(row.status || "open"),
    starred: Boolean(Number(row.starred)),
    unreadCount: Number(row.unread_count || 0),
    lastMessageAt: String(row.last_message_at || ""),
    createdAt: String(row.created_at || ""),
    preview: row.preview ? String(row.preview) : undefined,
  };
}

function mapMessage(row: Record<string, unknown>): EmailMessage {
  let attachments: EmailMessage["attachments"] = [];
  try {
    const raw = String(row.attachments_json || "[]");
    const parsed = JSON.parse(raw) as EmailMessage["attachments"];
    if (Array.isArray(parsed)) attachments = parsed;
  } catch {
    attachments = [];
  }
  return {
    id: String(row.id),
    threadId: String(row.thread_id),
    direction: String(row.direction) === "outbound" ? "outbound" : "inbound",
    fromEmail: String(row.from_email || ""),
    fromName: String(row.from_name || ""),
    toEmail: String(row.to_email || ""),
    subject: String(row.subject || ""),
    bodyText: String(row.body_text || ""),
    bodyHtml: String(row.body_html || ""),
    messageId: String(row.message_id || ""),
    inReplyTo: String(row.in_reply_to || ""),
    referencesHeader: String(row.references_header || ""),
    providerUid: String(row.provider_uid || ""),
    attachments,
    readAt: row.read_at ? String(row.read_at) : null,
    sentAt: row.sent_at ? String(row.sent_at) : null,
    error: row.error ? String(row.error) : null,
    createdAt: String(row.created_at || ""),
  };
}

export async function createThreadFromInquiry(
  input: {
    inquiryId: string;
    name: string;
    email: string;
    topic: string;
    message: string;
    company?: string;
    phone?: string;
    budget?: string;
  },
  opts?: QueryOpts,
) {
  const created = now();
  const threadId = id("eth");
  const messageId = id("emsg");
  const subject = input.topic ? `Website inquiry: ${input.topic}` : "Website inquiry";
  const metaLines = [
    input.company ? `Company: ${input.company}` : "",
    input.phone ? `Phone: ${input.phone}` : "",
    input.budget ? `Budget: ${input.budget}` : "",
  ].filter(Boolean);
  const bodyText = metaLines.length ? `${metaLines.join("\n")}\n\n${input.message}` : input.message;
  const providerUid = `inquiry:${input.inquiryId}`;

  await execRun(
    `INSERT INTO email_threads
      (id, subject, participant_email, participant_name, inquiry_id, source, status, starred, unread_count, last_message_at, created_at)
     VALUES (?, ?, ?, ?, ?, 'contact_form', 'open', 0, 1, ?, ?)`,
    [threadId, subject, input.email, input.name, input.inquiryId, created, created],
    opts,
  );

  await execRun(
    `INSERT INTO email_messages
      (id, thread_id, direction, from_email, from_name, to_email, subject, body_text, body_html,
       message_id, in_reply_to, references_header, provider_uid, attachments_json, read_at, sent_at, error, created_at)
     VALUES (?, ?, 'inbound', ?, ?, ?, ?, ?, ?, ?, '', '', ?, '[]', NULL, ?, NULL, ?)`,
    [
      messageId,
      threadId,
      input.email,
      input.name,
      mailFromAddress(),
      subject,
      bodyText,
      plainToHtml(bodyText),
      `<${providerUid}@contact.appomatrix>`,
      providerUid,
      created,
      created,
    ],
    opts,
  );

  return { threadId, messageId };
}

export async function backfillInquiryThreads(opts?: QueryOpts) {
  const rows = await execAll(
    `SELECT i.* FROM inquiries i
     LEFT JOIN email_threads t ON t.inquiry_id = i.id
     WHERE t.id IS NULL
     ORDER BY i.submitted_at ASC`,
    [],
    opts,
  );
  for (const row of rows) {
    await createThreadFromInquiry(
      {
        inquiryId: String(row.id),
        name: String(row.name || ""),
        email: String(row.email || ""),
        topic: String(row.topic || ""),
        message: String(row.message || ""),
        company: String(row.company || ""),
        phone: String(row.phone || ""),
        budget: String(row.budget || ""),
      },
      opts,
    );
    if (String(row.status) === "archived") {
      await execRun(
        `UPDATE email_threads SET status = 'archived', unread_count = 0 WHERE inquiry_id = ?`,
        [String(row.id)],
        opts,
      );
    } else if (String(row.status) === "replied" || String(row.status) === "reviewed") {
      await execRun(`UPDATE email_threads SET unread_count = 0 WHERE inquiry_id = ?`, [String(row.id)], opts);
      await execRun(
        `UPDATE email_messages SET read_at = COALESCE(read_at, created_at) WHERE thread_id IN
         (SELECT id FROM email_threads WHERE inquiry_id = ?)`,
        [String(row.id)],
        opts,
      );
    }
  }
}

export async function listEmailThreads(filters: {
  q?: string;
  status?: string;
  starred?: boolean;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.min(50, Math.max(1, filters.pageSize || 20));
  const where: string[] = [];
  const params: (string | number)[] = [];

  if (filters.status === "archived") {
    where.push("t.status = 'archived'");
  } else if (filters.status === "open" || !filters.status) {
    where.push("t.status = 'open'");
  } else if (filters.status === "all") {
    // no status filter
  } else {
    where.push("t.status = ?");
    params.push(filters.status);
  }

  if (filters.starred) {
    where.push("t.starred = 1");
  }
  if (filters.q?.trim()) {
    where.push(
      "(t.subject LIKE ? OR t.participant_email LIKE ? OR t.participant_name LIKE ? OR EXISTS (SELECT 1 FROM email_messages m WHERE m.thread_id = t.id AND m.body_text LIKE ?))",
    );
    const like = `%${filters.q.trim()}%`;
    params.push(like, like, like, like);
  }

  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const countRow = await get(`SELECT COUNT(*) AS c FROM email_threads t ${clause}`, params);
  const total = Number(countRow?.c || 0);
  const offset = (page - 1) * pageSize;

  const rows = await all(
    `SELECT t.*,
      (SELECT m.body_text FROM email_messages m WHERE m.thread_id = t.id ORDER BY m.created_at DESC LIMIT 1) AS preview
     FROM email_threads t
     ${clause}
     ORDER BY t.last_message_at DESC
     LIMIT ${pageSize} OFFSET ${offset}`,
    params,
  );

  return {
    threads: rows.map((row) => mapThread(row as Record<string, unknown>)),
    total,
    page,
    pageSize,
  };
}

export async function getEmailThread(threadId: string): Promise<EmailThreadDetail | null> {
  const thread = await get(`SELECT * FROM email_threads WHERE id = ?`, [threadId]);
  if (!thread) return null;
  const messages = await all(
    `SELECT * FROM email_messages WHERE thread_id = ? ORDER BY created_at ASC`,
    [threadId],
  );
  return {
    ...mapThread(thread as Record<string, unknown>),
    messages: messages.map((row) => mapMessage(row as Record<string, unknown>)),
  };
}

export async function markThreadRead(threadId: string, read = true) {
  if (read) {
    await run(`UPDATE email_messages SET read_at = COALESCE(read_at, ?) WHERE thread_id = ? AND direction = 'inbound'`, [
      now(),
      threadId,
    ]);
    await run(`UPDATE email_threads SET unread_count = 0 WHERE id = ?`, [threadId]);
  } else {
    await run(`UPDATE email_messages SET read_at = NULL WHERE thread_id = ? AND direction = 'inbound'`, [threadId]);
    const count = await get(
      `SELECT COUNT(*) AS c FROM email_messages WHERE thread_id = ? AND direction = 'inbound' AND read_at IS NULL`,
      [threadId],
    );
    await run(`UPDATE email_threads SET unread_count = ? WHERE id = ?`, [Number(count?.c || 0), threadId]);
  }
}

export async function updateThreadFlags(
  threadId: string,
  patch: { starred?: boolean; status?: "open" | "archived" },
) {
  if (patch.starred !== undefined) {
    await run(`UPDATE email_threads SET starred = ? WHERE id = ?`, [patch.starred ? 1 : 0, threadId]);
  }
  if (patch.status) {
    await run(`UPDATE email_threads SET status = ? WHERE id = ?`, [patch.status, threadId]);
  }
}

export async function unreadInboxCount() {
  const row = await get(
    `SELECT COALESCE(SUM(unread_count), 0) AS c FROM email_threads WHERE status = 'open'`,
  );
  return Number(row?.c || 0);
}

export async function replyToThread(input: {
  threadId: string;
  bodyText: string;
  html?: string;
  fromEmail?: string;
  fromName?: string;
  attachments?: { filename: string; contentType?: string; content: Buffer }[];
}) {
  const detail = await getEmailThread(input.threadId);
  if (!detail) return { ok: false as const, error: "Conversation not found." };
  const bodyText = input.bodyText.trim();
  if (!bodyText) return { ok: false as const, error: "Reply body is required." };
  if (!smtpConfigured()) {
    return {
      ok: false as const,
      error: "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.",
    };
  }

  const fromEmail = (input.fromEmail || mailFromAddress()).trim();
  const subject = detail.subject.startsWith("Re:") ? detail.subject : `Re: ${detail.subject}`;
  const lastInbound = [...detail.messages].reverse().find((m) => m.direction === "inbound");
  const lastAny = detail.messages[detail.messages.length - 1];
  const inReplyTo = lastInbound?.messageId || lastAny?.messageId || "";
  const references = detail.messages.map((m) => m.messageId).filter(Boolean);
  if (inReplyTo && !references.includes(inReplyTo)) references.push(inReplyTo);

  const html = sanitizeEmailHtml(input.html || plainToHtml(bodyText));
  const messageRowId = id("emsg");
  const created = now();

  try {
    const sent = await sendMail({
      from: fromEmail,
      fromName: input.fromName || "Appo Matrix",
      to: detail.participantEmail,
      subject,
      text: bodyText,
      html,
      inReplyTo: inReplyTo || undefined,
      references,
      attachments: input.attachments,
    });

    await run(
      `INSERT INTO email_messages
        (id, thread_id, direction, from_email, from_name, to_email, subject, body_text, body_html,
         message_id, in_reply_to, references_header, provider_uid, attachments_json, read_at, sent_at, error, created_at)
       VALUES (?, ?, 'outbound', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
      [
        messageRowId,
        detail.id,
        fromEmail,
        input.fromName || "Appo Matrix",
        detail.participantEmail,
        subject,
        bodyText,
        html,
        sent.messageId,
        inReplyTo,
        references.join(" "),
        `outbound:${sent.messageId}`,
        JSON.stringify(
          (input.attachments || []).map((file) => ({
            filename: file.filename,
            contentType: file.contentType || "application/octet-stream",
            size: file.content.length,
          })),
        ),
        created,
        created,
        created,
      ],
    );
    await run(`UPDATE email_threads SET last_message_at = ?, subject = ?, unread_count = 0, status = 'open' WHERE id = ?`, [
      created,
      subject,
      detail.id,
    ]);
    if (detail.inquiryId) {
      await run(`UPDATE inquiries SET status = 'replied' WHERE id = ?`, [detail.inquiryId]);
    }
    return { ok: true as const, messageId: messageRowId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send email.";
    await run(
      `INSERT INTO email_messages
        (id, thread_id, direction, from_email, from_name, to_email, subject, body_text, body_html,
         message_id, in_reply_to, references_header, provider_uid, attachments_json, read_at, sent_at, error, created_at)
       VALUES (?, ?, 'outbound', ?, ?, ?, ?, ?, ?, '', ?, ?, ?, ?, NULL, NULL, ?, ?)`,
      [
        messageRowId,
        detail.id,
        fromEmail,
        input.fromName || "Appo Matrix",
        detail.participantEmail,
        subject,
        bodyText,
        html,
        inReplyTo,
        references.join(" "),
        `outbound-failed:${messageRowId}`,
        JSON.stringify([]),
        message.slice(0, 2000),
        created,
      ],
    );
    return { ok: false as const, error: message };
  }
}

/** Import an inbound provider message if not already stored (by provider_uid or message_id). */
export async function importInboundMessage(input: {
  providerUid: string;
  messageId: string;
  fromEmail: string;
  fromName?: string;
  toEmail: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  inReplyTo?: string;
  references?: string;
  sentAt?: string;
}) {
  if (!input.providerUid && !input.messageId) return { imported: false };
  if (input.providerUid) {
    const existing = await get(`SELECT id FROM email_messages WHERE provider_uid = ?`, [input.providerUid]);
    if (existing) return { imported: false };
  }
  if (input.messageId) {
    const byMid = await get(`SELECT id FROM email_messages WHERE message_id = ?`, [input.messageId]);
    if (byMid) return { imported: false };
  }

  let threadId: string | null = null;
  if (input.inReplyTo) {
    const parent = await get(`SELECT thread_id FROM email_messages WHERE message_id = ?`, [input.inReplyTo]);
    if (parent) threadId = String(parent.thread_id);
  }
  if (!threadId) {
    const open = await get(
      `SELECT id FROM email_threads WHERE participant_email = ? AND status = 'open' ORDER BY last_message_at DESC LIMIT 1`,
      [input.fromEmail.toLowerCase()],
    );
    if (open) threadId = String(open.id);
  }

  const created = input.sentAt || now();
  if (!threadId) {
    threadId = id("eth");
    await run(
      `INSERT INTO email_threads
        (id, subject, participant_email, participant_name, inquiry_id, source, status, starred, unread_count, last_message_at, created_at)
       VALUES (?, ?, ?, ?, NULL, 'imap', 'open', 0, 1, ?, ?)`,
      [
        threadId,
        input.subject || "(no subject)",
        input.fromEmail.toLowerCase(),
        input.fromName || "",
        created,
        created,
      ],
    );
  } else {
    await run(
      `UPDATE email_threads SET last_message_at = ?, unread_count = unread_count + 1, status = 'open',
        subject = CASE WHEN subject = '' THEN ? ELSE subject END WHERE id = ?`,
      [created, input.subject || "(no subject)", threadId],
    );
  }

  await run(
    `INSERT INTO email_messages
      (id, thread_id, direction, from_email, from_name, to_email, subject, body_text, body_html,
       message_id, in_reply_to, references_header, provider_uid, attachments_json, read_at, sent_at, error, created_at)
     VALUES (?, ?, 'inbound', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', NULL, ?, NULL, ?)`,
    [
      id("emsg"),
      threadId,
      input.fromEmail,
      input.fromName || "",
      input.toEmail,
      input.subject || "(no subject)",
      input.bodyText,
      sanitizeEmailHtml(input.bodyHtml || plainToHtml(input.bodyText)),
      input.messageId || "",
      input.inReplyTo || "",
      input.references || "",
      input.providerUid,
      created,
      created,
    ],
  );

  return { imported: true, threadId };
}
