import type { Metadata } from "next";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { PortfolioBrowser } from "@/components/site/portfolio-browser";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { getPageMeta, listProjects } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/portfolio", {
    title: "Portfolio",
    description: "Products and client work shipped by Appo Matrix, with galleries and links to the live products.",
  });
}

export default async function PortfolioPage() {
  const projects = await listProjects(true);
  const seed = pageSeed("/portfolio");
  const copy = pageIntro(await getPageMeta("/portfolio"), {
    kicker: seed?.kicker || "Portfolio",
    heading: seed?.heading || "Proof over promises",
    lead: seed?.lead || "",
    body: seed?.body || "",
  });
  return (
    <>
      <PageHero kicker={copy.kicker} title={copy.heading} lead={copy.lead} image={copy.image} imageAlt={copy.imageAlt} />
      <Container className="section-pad">
        {copy.body ? <Prose text={copy.body} className="mb-8 max-w-2xl text-sm text-muted-foreground" /> : null}
        <PortfolioBrowser projects={projects} />
      </Container>
    </>
  );
}
