import Link from "next/link";
import { SafeImage } from "@/components/site/safe-image";

export function Logo({
  name,
  logoUrl = "",
  logoAlt = "",
  light = true,
}: {
  name: string;
  logoUrl?: string;
  logoAlt?: string;
  light?: boolean;
}) {
  const isMark = !logoUrl || logoUrl.includes("mark") || logoUrl.includes("favicon");
  const src = light
    ? logoUrl && !isMark
      ? logoUrl
      : "/brand/appo-matrix-logo-on-dark.png"
    : logoUrl || "/brand/appo-matrix-mark.png";

  return (
    <Link href="/" className="inline-flex items-center gap-2.5" aria-label={name}>
      <SafeImage src={src} alt={logoAlt || name} className="h-8 w-auto max-w-[10rem] object-contain md:h-9" />
    </Link>
  );
}
