"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type FitMediaProps = {
  src?: string;
  alt: string;
  className?: string;
  /** Classes for the letterbox frame (background fills unused space). */
  frameClassName?: string;
  /** Prefer contain (full media visible). Use cover only when intentionally cropping. */
  fit?: "contain" | "cover";
  priority?: boolean;
  /** Optional intrinsic aspect hint for the frame, e.g. aspect-[16/10]. Does not crop the media. */
  frameAspectClassName?: string;
  type?: "image" | "video";
  poster?: string;
};

/**
 * Displays the full media inside a widget without cropping or stretching.
 * Letterboxes with a muted background when aspect ratios differ.
 */
export function FitMedia({
  src,
  alt,
  className,
  frameClassName,
  fit = "contain",
  priority = false,
  frameAspectClassName,
  type = "image",
  poster,
}: FitMediaProps) {
  const [failed, setFailed] = useState(false);
  const [meta, setMeta] = useState<{ w: number; h: number } | null>(null);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "grid place-items-center bg-muted text-sm text-muted-foreground",
          frameAspectClassName,
          frameClassName,
        )}
        aria-hidden={!alt}
      >
        {alt ? <span className="px-3 text-center text-xs">{alt}</span> : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden bg-muted/60",
        frameAspectClassName,
        frameClassName,
      )}
      data-media-fit={fit}
      data-media-size={meta ? `${meta.w}x${meta.h}` : undefined}
    >
      {type === "video" ? (
        <video
          src={src}
          poster={poster}
          controls
          playsInline
          className={cn(
            "max-h-full max-w-full",
            fit === "contain" ? "h-full w-full object-contain object-center" : "h-full w-full object-cover object-center",
            className,
          )}
          onError={() => setFailed(true)}
        >
          <track kind="captions" />
        </video>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn(
            "max-h-full max-w-full",
            fit === "contain" ? "h-full w-full object-contain object-center" : "h-full w-full object-cover object-center",
            className,
          )}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={(event) => {
            const img = event.currentTarget;
            if (img.naturalWidth && img.naturalHeight) {
              setMeta({ w: img.naturalWidth, h: img.naturalHeight });
            }
          }}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
