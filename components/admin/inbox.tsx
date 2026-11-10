"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  Inbox,
  Loader2,
  Mail,
  Paperclip,
  RefreshCw,
  Search,
  Send,
  Star,
  StarOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { csrfTokenFromDocument } from "@/lib/csrf-client";
import { formatDate } from "@/lib/format";
import type { EmailThread, EmailThreadDetail } from "@/lib/types";
import { cn } from "@/lib/utils";

type ListResponse = {
  threads: EmailThread[];
  total: number;
  unread: number;
  smtpConfigured: boolean;
  imapConfigured: boolean;
};

export function EmailInbox({ companyEmail }: { companyEmail: string }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("open");
  const [list, setList] = useState<ListResponse | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<EmailThreadDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [reply, setReply] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [sending, setSending] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadList = useCallback(async () => {
    setLoadingList(true);
    setError("");
    try {
      const params = new URLSearchParams({ status, pageSize: "40" });
      if (q.trim()) params.set("q", q.trim());
      const response = await fetch(`/api/admin/inbox?${params.toString()}`);
      const json = (await response.json()) as { ok?: boolean; error?: string; data?: ListResponse };
      if (!response.ok || !json.ok || !json.data) throw new Error(json.error || "Could not load inbox.");
      setList(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load inbox.");
    } finally {
      setLoadingList(false);
    }
  }, [q, status]);

  const loadDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/inbox/${id}`);
      const json = (await response.json()) as { ok?: boolean; error?: string; data?: EmailThreadDetail };
      if (!response.ok || !json.ok || !json.data) throw new Error(json.error || "Could not open conversation.");
      setDetail(json.data);
      setReply("");
      setFiles(null);
      void loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not open conversation.");
    } finally {
      setLoadingDetail(false);
    }
  }, [loadList]);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (selectedId) void loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  const threads = list?.threads || [];
  const smtpReady = Boolean(list?.smtpConfigured);

  async function patchThread(id: string, body: Record<string, unknown>) {
    const response = await fetch(`/api/admin/inbox/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-csrf-token": csrfTokenFromDocument() },
      body: JSON.stringify(body),
    });
    const json = (await response.json()) as { ok?: boolean; error?: string };
    if (!response.ok || !json.ok) throw new Error(json.error || "Update failed.");
    await loadList();
    if (selectedId === id) await loadDetail(id);
  }

  async function sendReply() {
    if (!selectedId || sending) return;
    if (!reply.trim()) {
      setError("Write a reply before sending.");
      return;
    }
    setSending(true);
    setError("");
    setNotice("");
    try {
      const form = new FormData();
      form.set("body", reply.trim());
      if (files) {
        Array.from(files).forEach((file) => form.append("attachments", file));
      }
      const response = await fetch(`/api/admin/inbox/${selectedId}`, {
        method: "POST",
        headers: { "x-csrf-token": csrfTokenFromDocument() },
        body: form,
      });
      const json = (await response.json()) as { ok?: boolean; error?: string; data?: EmailThreadDetail };
      if (!response.ok || !json.ok) throw new Error(json.error || "Send failed.");
      setDetail(json.data || null);
      setReply("");
      setFiles(null);
      setNotice("Reply sent.");
      await loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Send failed.");
    } finally {
      setSending(false);
    }
  }

  async function syncMail() {
    setSyncing(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-csrf-token": csrfTokenFromDocument() },
        body: JSON.stringify({ action: "sync" }),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string; data?: { imported?: number } };
      if (!response.ok || !json.ok) throw new Error(json.error || "Sync failed.");
      setNotice(`Synced. Imported ${json.data?.imported ?? 0} new message(s).`);
      await loadList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sync failed.");
    } finally {
      setSyncing(false);
    }
  }

  const emptyHint = useMemo(() => {
    if (loadingList) return "Loading conversations…";
    if (status === "archived") return "No archived conversations.";
    return "No messages yet. Website contact form inquiries appear here automatically.";
  }, [loadingList, status]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3">
        <div className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Search inbox"
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm"
          />
        </div>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
        >
          <option value="open">Open</option>
          <option value="archived">Archived</option>
          <option value="all">All</option>
        </select>
        <Button type="button" variant="outline" className="h-10" onClick={() => void loadList()}>
          <RefreshCw className="size-4" /> Refresh
        </Button>
        {list?.imapConfigured ? (
          <Button type="button" variant="outline" className="h-10" disabled={syncing} onClick={() => void syncMail()}>
            {syncing ? <Loader2 className="size-4 animate-spin" /> : <Inbox className="size-4" />}
            Sync mail
          </Button>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Unread: <strong>{list?.unread ?? 0}</strong>
          {" · "}
          From: {companyEmail}
          {" · "}
          SMTP: {smtpReady ? "ready" : "not configured"}
        </p>
      </div>

      {(error || notice) && (
        <div className="border-b border-border px-4 py-2 text-sm">
          {error ? <p className="text-destructive" role="alert">{error}</p> : null}
          {notice ? <p className="text-primary" role="status">{notice}</p> : null}
        </div>
      )}

      <div className="grid min-h-[32rem] lg:grid-cols-[minmax(16rem,22rem)_1fr]">
        <aside className="border-b border-border lg:border-r lg:border-b-0">
          {threads.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">{emptyHint}</p>
          ) : (
            <ul className="max-h-[70vh] divide-y divide-border overflow-y-auto">
              {threads.map((thread) => (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(thread.id)}
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors hover:bg-muted/60",
                      selectedId === thread.id && "bg-muted",
                      thread.unreadCount > 0 && "bg-primary/5",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("truncate text-sm", thread.unreadCount > 0 ? "font-semibold" : "font-medium")}>
                        {thread.participantName || thread.participantEmail}
                      </p>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{formatDate(thread.lastMessageAt)}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-foreground">{thread.subject || "(no subject)"}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{thread.preview}</p>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded-full border border-border px-2 py-0.5">{thread.source}</span>
                      {thread.starred ? <Star className="size-3 fill-current text-amber-500" /> : null}
                      {thread.unreadCount > 0 ? <span className="font-semibold text-primary">{thread.unreadCount} new</span> : null}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="flex min-h-[28rem] flex-col">
          {!selectedId ? (
            <div className="grid flex-1 place-items-center p-8 text-center text-sm text-muted-foreground">
              <div>
                <Mail className="mx-auto mb-3 size-8 opacity-40" />
                Select a conversation to read and reply.
              </div>
            </div>
          ) : loadingDetail || !detail ? (
            <div className="grid flex-1 place-items-center p-8 text-sm text-muted-foreground">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : (
            <>
              <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-lg font-semibold">{detail.subject || "(no subject)"}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {detail.participantName} · {detail.participantEmail}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void patchThread(detail.id, { starred: !detail.starred })}
                  >
                    {detail.starred ? <StarOff className="size-4" /> : <Star className="size-4" />}
                    {detail.starred ? "Unstar" : "Star"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void patchThread(detail.id, {
                        status: detail.status === "archived" ? "open" : "archived",
                      }).then(() => {
                        if (detail.status !== "archived") setSelectedId(null);
                      })
                    }
                  >
                    <Archive className="size-4" />
                    {detail.status === "archived" ? "Unarchive" : "Archive"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void patchThread(detail.id, { read: false })}
                  >
                    Mark unread
                  </Button>
                </div>
              </header>

              <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
                {detail.messages.map((message) => (
                  <article
                    key={message.id}
                    className={cn(
                      "rounded-xl border border-border p-4",
                      message.direction === "outbound" ? "bg-primary/5" : "bg-background",
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                      <p>
                        <span className="font-semibold text-foreground">
                          {message.fromName || message.fromEmail}
                        </span>
                        {" → "}
                        {message.toEmail}
                        {" · "}
                        {message.direction}
                      </p>
                      <time>{formatDate(message.sentAt || message.createdAt)}</time>
                    </div>
                    {message.bodyHtml ? (
                      <div
                        className="prose-editor mt-3 max-w-none text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: message.bodyHtml }}
                      />
                    ) : (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{message.bodyText}</p>
                    )}
                    {message.attachments?.length ? (
                      <ul className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {message.attachments.map((file) => (
                          <li key={file.filename} className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-1">
                            <Paperclip className="size-3" />
                            {file.filename}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {message.error ? <p className="mt-2 text-sm text-destructive">Send error: {message.error}</p> : null}
                  </article>
                ))}
              </div>

              <footer className="border-t border-border p-4">
                {!smtpReady ? (
                  <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
                    Configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM to send replies from the panel.
                  </p>
                ) : null}
                <Textarea
                  value={reply}
                  onChange={(event) => setReply(event.target.value)}
                  rows={5}
                  placeholder={`Reply to ${detail.participantName || detail.participantEmail}…`}
                  className="min-h-28 rounded-xl"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <input
                    type="file"
                    multiple
                    onChange={(event) => setFiles(event.target.files)}
                    className="text-xs text-muted-foreground"
                  />
                  <Button type="button" className="ml-auto h-10" disabled={sending || !smtpReady} onClick={() => void sendReply()}>
                    {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    {sending ? "Sending…" : "Send reply"}
                  </Button>
                </div>
              </footer>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
