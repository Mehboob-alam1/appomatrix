import Link from "next/link";
import { Container } from "@/components/site/chrome";

export default function NotFound() {
  return (
    <Container className="py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brand">404</p>
      <h1 className="font-display mt-4 text-5xl md:text-7xl">That page is not on this site.</h1>
      <p className="mt-4 max-w-lg text-black/60">
        The link may be old, or the record was unpublished from the studio.
      </p>
      <Link href="/" className="mt-8 inline-flex h-11 items-center bg-brand px-5 text-sm font-medium text-white">
        Back home
      </Link>
    </Container>
  );
}
