"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Upload } from "lucide-react";
import { AdminShell } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { csrfTokenFromDocument } from "@/lib/csrf-client";
import type { MediaAsset } from "@/lib/types";

export default function MediaPage() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

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

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      for (const file of list) {
        const body = new FormData();
        body.set("file", file);
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "x-csrf-token": csrfTokenFromDocument() },
          body,
        });
        const result = (await response.json()) as { ok?: boolean; error?: string };
        if (!response.ok || !result.ok) throw new Error(result.error || "Upload failed");
      }
      setNotice(`Uploaded ${list.length} file${list.length === 1 ? "" : "s"}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell
      title="Media"
      description="Upload cover photos, team portraits, and gallery images. Files stay outside the build folder and are served from /uploads."
    >
      {error ? <p className="mb-4 text-sm text-destructive" role="alert">{error}</p> : null}
      {notice ? <p className="mb-4 text-sm text-primary" role="status">{notice}</p> : null}

      <div
        className={`mb-6 grid place-items-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center ${dragging ? "border-brand bg-brand-soft/40" : "border-border bg-muted/30"}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void uploadFiles(event.dataTransfer.files);
        }}
      >
        <ImagePlus className="size-8 text-brand" />
        <div>
          <p className="font-medium">{busy ? "Uploading…" : "Drop images here"}</p>
          <p className="mt-1 text-sm text-muted-foreground">JPG, PNG, WEBP, or GIF up to 5 MB each</p>
        </div>
        <label className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Upload className="size-4" />
          Choose files
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="sr-only"
            onChange={(event) => {
              const files = event.target.files;
              event.target.value = "";
              if (files) void uploadFiles(files);
            }}
          />
        </label>
      </div>

      {items.length === 0 ? <p className="text-sm text-muted-foreground">No uploads yet.</p> : null}
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
            <img
              src={item.url}
              alt={item.alt || item.originalName || ""}
              className="h-24 w-full rounded-lg object-cover"
              onError={(event) => {
                event.currentTarget.alt = "Missing image";
              }}
            />
            <div className="space-y-2">
              <p className="text-sm font-medium">{item.originalName || item.filename}</p>
              <p className="break-all text-xs text-muted-foreground">{item.url}</p>
              <Input name="alt" defaultValue={item.alt} placeholder="Alt text" className="h-10" />
              <div className="flex gap-2">
                <Button type="submit" className="h-9">
                  Save alt text
                </Button>
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
                  Delete
                </Button>
              </div>
            </div>
          </form>
        ))}
      </div>
    </AdminShell>
  );
}
