"use client";

import { useState } from "react";

export function SafeImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />;
}
