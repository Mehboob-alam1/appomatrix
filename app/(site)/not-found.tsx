import Link from "next/link";
import { Container } from "@/components/site/chrome";
import { SiteLinkButton } from "@/components/site/ui";

export default function NotFound() {
  return (
    <Container className="section-pad py-12">
      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-primary">404</p>
      <h1 className="font-display mt-3 max-w-2xl">That page is not on this site.</h1>
      <p className="mt-4 max-w-lg text-muted-foreground">
        The link may be old, or the record was unpublished from the studio.
      </p>
      <SiteLinkButton href="/" className="mt-8">
        Back home
      </SiteLinkButton>
    </Container>
  );
}
