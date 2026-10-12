import Link from "next/link";

export function Logo({ name, light = false }: { name: string; light?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      <span
        className={`grid size-8 place-items-center text-[11px] font-semibold tracking-tight ${
          light ? "bg-white text-brand" : "bg-brand text-white"
        }`}
      >
        AM
      </span>
      <span className={`text-[15px] font-medium tracking-tight ${light ? "text-white" : "text-black"}`}>{name}</span>
    </Link>
  );
}
