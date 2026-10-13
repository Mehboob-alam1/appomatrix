import Link from "next/link";
import { SafeImage } from "@/components/site/safe-image";

export function Logo({
  name,
  logoUrl = "",
  logoAlt = "",
  light = false,
}: {
  name: string;
  logoUrl?: string;
  logoAlt?: string;
  light?: boolean;
}) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      {logoUrl ? (
        <SafeImage src={logoUrl} alt={logoAlt || name} className="h-9 w-auto max-w-12 object-contain" />
      ) : (
        <span
          className={`grid size-8 place-items-center text-[11px] font-semibold tracking-tight ${
            light ? "bg-white text-brand" : "bg-brand text-white"
          }`}
        >
          AM
        </span>
      )}
      <span className={`text-[15px] font-medium tracking-tight ${light ? "text-white" : "text-black"}`}>{name}</span>
    </Link>
  );
}
