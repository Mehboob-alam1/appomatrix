"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { csrfTokenFromDocument } from "@/lib/csrf-client";
import type { MediaAsset } from "@/lib/types";

export default function MediaPage() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const response = await fetch("/api/admin/media");
    const body = (await response.json()) as { ok?: boolean; error?: string; data?: MediaAsset[] };
    if (!response.ok || !body.ok || !body.data) {
      setError(body.error || "Could not load media.");
      return;
    }
    setItems(body.data);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AdminShell title="Media" description="Uploaded images are stored outside the build and served from /uploads.">
      {error ? <p className="mb-4 text-sm text-destructive" role="alert">{error}</p> : null}
      {notice ? <p className="mb-4 text-sm text-primary" role="status">{notice}</p> : null}
      {items.length === 0 ? <p className="text-sm text-muted-foreground">No uploads yet. Add images from any content form.</p> : null}
      <div className="grid gap-4">
        {items.map((item) => (
          <form
            key={item.id}
            className="grid gap-3 rounded-2xl border border-border bg-card p-4 md:grid-cols-[8rem_1fr]"
            onSubmit={async (event) => {
              event.preventDefault();
              setError("");
              setNotice("");
              const alt = String(new FormData(event.currentTarget).get("alt") || "");
              const response = await fetch(`/api/admin/media/${item.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", "x-csrf-token": csrfTokenFromDocument() },
                body: JSON.stringify({ alt }),
              });
              const body = (await response.json()) as { ok?: boolean; error?: string };
              if (!response.ok || !body.ok) setError(body.error || "Could not save alt text.");
              else setNotice(`Saved alt text for ${item.filename}.`);
            }}
          >
            <img src={item.url} alt={item.alt || item.originalName || ""} className="h-24 w-full rounded-lg object-cover" onError={(event) => { event.currentTarget.alt = "Missing image"; }} />
            <div className="space-y-2">
              <p className="text-sm font-medium">{item.originalName || item.filename}</p>
              <p className="break-all text-xs text-muted-foreground">{item.url}</p>
              <Input name="alt" defaultValue={item.alt} placeholder="Alt text" className="h-10" />
              <div className="flex gap-2">
                <Button type="submit" className="h-9">Save alt text</Button>
                <Button
                  type="button"
                  variant="destructive"
                  className="h-9"
                  onClick={async () => {
                    if (!confirm("Delete this file and clear it from content that uses it?")) return;
                    const response = await fetch(`/api/admin/media/${item.id}`, {
                      method: "DELETE",
                      headers: { "x-csrf-token": csrfTokenFromDocument() },
                    });
                    const body = (await response.json()) as { ok?: boolean; error?: string };
                    if (!response.ok || !body.ok) {
                      setError(body.error || "Could not delete the file.");
                      return;
                    }
                    setNotice("File deleted.");
                    await load();
                  }}
                >
                  Delete file
                </Button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </AdminShell>
  );
}
