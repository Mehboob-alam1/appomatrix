import type { Metadata } from "next";
import { Container, PageHero } from "@/components/site/chrome";
import { PortfolioBrowser } from "@/components/site/portfolio-browser";
import { listProjects } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Portfolio",
  description: "Products and client work shipped by Appo Matrix, with galleries and links to the live products.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  const projects = listProjects(true);
  return (
    <>
      <PageHero
        kicker="Portfolio"
        title="Proof over promises"
        lead="Products we have designed and shipped. Open a record for the problem, the build, the gallery, and a link back to the live product."
      />
      <Container className="py-14">
        <PortfolioBrowser projects={projects} />
      </Container>
    </>
  );
}
