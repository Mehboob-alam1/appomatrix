"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { csrfTokenFromDocument } from "@/lib/csrf-client";
import type { GalleryImage } from "@/lib/types";

async function uploadFile(file: File) {
  const body = new FormData();
  body.set("file", file);
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "x-csrf-token": csrfTokenFromDocument() },
    body,
  });
  const data = (await response.json()) as { ok?: boolean; error?: string; data?: { url?: string } };
  if (!response.ok || !data.data?.url) throw new Error(data.error || "Upload failed");
  return data.data.url;
}

async function removeFile(url: string) {
  if (!url.startsWith("/uploads/")) return;
  await fetch("/api/admin/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", "x-csrf-token": csrfTokenFromDocument() },
    body: JSON.stringify({ url }),
  });
}

export function ImageField({
  name,
  label,
  defaultValue = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [broken, setBroken] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <input type="hidden" name={name} value={url} />
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input id={name} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://… or /uploads/…" className="h-10" />
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-border px-3 text-sm"
          onClick={async () => {
            const current = url;
            setUrl("");
            setBroken(false);
            if (current.startsWith("/uploads/")) {
              try {
                await removeFile(current);
              } catch {
                setError("The image reference was cleared, but the file could not be deleted.");
              }
            }
          }}
        >
          Remove
        </button>
        <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border px-3 text-sm">
          {busy ? "Uploading…" : "Upload"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              setBusy(true);
              setError("");
              try {
                setBroken(false);
                setUrl(await uploadFile(file));
              } catch (err) {
                setError(err instanceof Error ? err.message : "Upload failed");
              } finally {
                setBusy(false);
              }
            }}
          />
        </label>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {url && !broken ? (
        <img src={url} alt="" className="h-32 max-w-sm rounded-xl object-cover" onError={() => setBroken(true)} />
      ) : null}
      {url && broken ? <p className="text-sm text-muted-foreground">This image is missing. Upload a replacement or clear it.</p> : null}
    </div>
  );
}

export function GalleryField({ defaultValue }: { defaultValue?: string }) {
  const initial = parse(defaultValue);
  const [images, setImages] = useState<GalleryImage[]>(initial);

  function update(index: number, patch: Partial<GalleryImage>) {
    setImages((current) => current.map((image, i) => (i === index ? { ...image, ...patch } : image)));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Gallery</Label>
        <Button
          type="button"
          variant="outline"
          onClick={() => setImages((current) => [...current, { url: "", alt: "", caption: "" }])}
        >
          Add image
        </Button>
      </div>
      <input type="hidden" name="gallery" value={JSON.stringify(images.filter((image) => image.url.trim()))} />
      <p className="text-xs text-muted-foreground">Each image appears in the portfolio showcase. Add a caption and alt text.</p>
      {images.map((image, index) => (
        <div key={index} className="space-y-2 rounded-xl border border-border p-3">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input value={image.url} onChange={(event) => update(index, { url: event.target.value })} placeholder="Image URL" className="h-10" />
            <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-border px-3 text-sm">
              Upload
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  try {
                    update(index, { url: await uploadFile(file) });
                  } catch (err) {
                    alert(err instanceof Error ? err.message : "Upload failed");
                  }
                }}
              />
            </label>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                const current = image.url;
                setImages((items) => items.filter((_, i) => i !== index));
                void removeFile(current);
              }}
            >
              Remove
            </Button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input value={image.alt} onChange={(event) => update(index, { alt: event.target.value })} placeholder="Alt text" className="h-10" />
            <Input value={image.caption} onChange={(event) => update(index, { caption: event.target.value })} placeholder="Caption" className="h-10" />
          </div>
          {image.url ? (
            <img
              src={image.url}
              alt={image.alt || ""}
              className="h-28 rounded-lg object-cover"
              onError={(event) => {
                event.currentTarget.replaceWith(Object.assign(document.createElement("p"), { className: "text-sm text-muted-foreground", textContent: "This image is missing." }));
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function parse(value?: string): GalleryImage[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as GalleryImage[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
