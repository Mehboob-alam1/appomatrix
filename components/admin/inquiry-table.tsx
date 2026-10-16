"use client";

import { useState } from "react";
import { deleteInquiryAction, setInquiryStatusAction } from "@/lib/actions";
import { csrfTokenFromDocument } from "@/lib/csrf-client";
import type { Inquiry } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function InquiryTable({
  inquiries,
  companyEmail = "hello@appomatrix.com",
}: {
  inquiries: Inquiry[];
  companyEmail?: string;
}) {
  if (inquiries.length === 0) {
    return <p className="text-sm text-muted-foreground">No inquiries yet. Messages from Contact Us will land here.</p>;
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Company mail: <a className="underline underline-offset-2" href={`mailto:${companyEmail}`}>{companyEmail}</a>
        . Reply from that inbox so customers see the Appo Matrix address.
      </p>
      {inquiries.map((inquiry) => (
        <InquiryCard key={inquiry.id} inquiry={inquiry} companyEmail={companyEmail} />
      ))}
    </div>
  );
}

function replyMailto(inquiry: Inquiry, companyEmail: string) {
  const subject = `Re: ${inquiry.topic || "your message"} — Appo Matrix`;
  const quoted = inquiry.message
    .split("\n")
    .map((line) => `> ${line}`)
    .join("\n");
  const body = `Hi ${inquiry.name},\n\n\n\n---\nOn ${formatDate(inquiry.submittedAt)}, you wrote:\n${quoted}`;
  const params = new URLSearchParams({
    subject,
    body,
    cc: companyEmail,
  });
  return `mailto:${inquiry.email}?${params.toString()}`;
}

function InquiryCard({ inquiry, companyEmail }: { inquiry: Inquiry; companyEmail: string }) {
  const [status, setStatus] = useState(inquiry.status);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function saveStatus(next: string, savedNotice = "Status saved.") {
    setStatus(next);
    setNotice("");
    setError("");
    const result = await setInquiryStatusAction(inquiry.id, next, csrfTokenFromDocument());
    if (!result.ok) setError(result.error);
    else setNotice(savedNotice);
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-medium">{inquiry.name}</h2>
          <p className="text-sm text-muted-foreground">
            <a className="underline decoration-black/20 underline-offset-2 hover:text-foreground" href={`mailto:${inquiry.email}`}>
              {inquiry.email}
            </a>
            {inquiry.phone ? (
              <>
                {" · "}
                <a className="underline decoration-black/20 underline-offset-2 hover:text-foreground" href={`tel:${inquiry.phone.replace(/\s/g, "")}`}>
                  {inquiry.phone}
                </a>
              </>
            ) : null}
            {inquiry.company ? ` · ${inquiry.company}` : ""}
          </p>
        </div>
        <label className="text-sm">
          <span className="sr-only">Status</span>
          <select
            value={status}
            className="h-9 rounded-lg border border-input bg-transparent px-2"
            onChange={(event) => {
              void saveStatus(event.target.value);
            }}
          >
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>
      <p className="mt-3 text-sm">
        <span className="text-muted-foreground">{inquiry.topic || "General"}</span>
        {inquiry.budget ? ` · ${inquiry.budget}` : ""}
        {" · "}
        {formatDate(inquiry.submittedAt)}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{inquiry.message}</p>
      {notice ? <p className="mt-2 text-sm text-primary" role="status">{notice}</p> : null}
      {error ? <p className="mt-2 text-sm text-destructive" role="alert">{error}</p> : null}
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <a
          href={replyMailto(inquiry, companyEmail)}
          className="inline-flex h-9 items-center rounded-lg bg-brand px-3 text-sm font-medium text-white"
          onClick={() => {
            if (status !== "replied") {
              void saveStatus("replied", `Marked as replied. Send from ${companyEmail} in your mail app.`);
            }
          }}
        >
          Reply by email
        </a>
        <button
          type="button"
          className="text-sm text-destructive"
          onClick={async () => {
            if (!confirm(`Delete the message from ${inquiry.name}?`)) return;
            const result = await deleteInquiryAction(inquiry.id, csrfTokenFromDocument());
            if (!result.ok) setError(result.error);
            else window.location.reload();
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
