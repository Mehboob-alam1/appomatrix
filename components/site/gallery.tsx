"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { GalleryImage } from "@/lib/types";

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState<number | null>(null);
  const current = active == null ? null : images[active];

  if (images.length === 0) return null;

  function step(delta: number) {
    setActive((index) => {
      if (index == null) return index;
      return (index + delta + images.length) % images.length;
    });
  }

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className="group overflow-hidden bg-black text-left"
          >
            <img
              src={image.url}
              alt={image.alt || ""}
              className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
            {image.caption ? (
              <span className="block px-3 py-2 text-sm text-muted-foreground">{image.caption}</span>
            ) : null}
          </button>
        ))}
      </div>
      <Dialog open={active != null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent className="sm:max-w-3xl" showCloseButton>
          <DialogTitle className="sr-only">{current?.alt || "Gallery image"}</DialogTitle>
          {current ? (
            <div>
              <img src={current.url} alt={current.alt || ""} className="max-h-[70vh] w-full rounded-lg object-contain" />
              {current.caption ? <p className="mt-3 text-sm text-muted-foreground">{current.caption}</p> : null}
              {images.length > 1 ? (
                <div className="mt-3 flex gap-2">
                  <button type="button" className="inline-flex h-8 items-center gap-1 rounded-lg border px-2 text-sm" onClick={() => step(-1)}>
                    <ChevronLeft className="size-4" /> Previous
                  </button>
                  <button type="button" className="inline-flex h-8 items-center gap-1 rounded-lg border px-2 text-sm" onClick={() => step(1)}>
                    Next <ChevronRight className="size-4" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
