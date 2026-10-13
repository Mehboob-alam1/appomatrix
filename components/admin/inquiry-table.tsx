"use client";

import { useState } from "react";
import { deleteInquiryAction, setInquiryStatusAction } from "@/lib/actions";
import { csrfTokenFromDocument } from "@/lib/csrf-client";
import type { Inquiry } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function InquiryTable({ inquiries }: { inquiries: Inquiry[] }) {
  if (inquiries.length === 0) {
    return <p className="text-sm text-muted-foreground">No inquiries yet. Messages from Contact Us will land here.</p>;
  }
  return (
    <div className="space-y-3">
      {inquiries.map((inquiry) => (
        <InquiryCard key={inquiry.id} inquiry={inquiry} />
      ))}
    </div>
  );
}

function InquiryCard({ inquiry }: { inquiry: Inquiry }) {
  const [status, setStatus] = useState(inquiry.status);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-medium">{inquiry.name}</h2>
          <p className="text-sm text-muted-foreground">
            {inquiry.email}
            {inquiry.phone ? ` · ${inquiry.phone}` : ""}
            {inquiry.company ? ` · ${inquiry.company}` : ""}
          </p>
        </div>
        <label className="text-sm">
          <span className="sr-only">Status</span>
          <select
            value={status}
            className="h-9 rounded-lg border border-input bg-transparent px-2"
            onChange={async (event) => {
              const next = event.target.value;
              setStatus(next);
              setNotice("");
              setError("");
              const result = await setInquiryStatusAction(inquiry.id, next, csrfTokenFromDocument());
              if (!result.ok) setError(result.error);
              else setNotice("Status saved.");
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
      <button
        type="button"
        className="mt-3 text-sm text-destructive"
        onClick={async () => {
          if (!confirm(`Delete the message from ${inquiry.name}?`)) return;
          const result = await deleteInquiryAction(inquiry.id, csrfTokenFromDocument());
          if (!result.ok) setError(result.error);
          else window.location.reload();
        }}
      >
        Delete
      </button>
    </article>
  );
}
