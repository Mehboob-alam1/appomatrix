import type { Metadata } from "next";
import { Container, PageHero, Prose } from "@/components/site/chrome";
import { PortfolioBrowser } from "@/components/site/portfolio-browser";
import { CtaBand, GradientText } from "@/components/site/ui";
import { pageIntro, pageSeed } from "@/lib/page-copy";
import { getPageMeta, listProjects } from "@/lib/queries";
import { metadataFor } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return metadataFor("/portfolio", {
    title: "Work — Real Products. Real Business Impact.",
    description: "Products and client work shipped by Appo Matrix — case studies, galleries, and live product links.",
  });
}

export default async function PortfolioPage() {
  const projects = await listProjects(true);
  const seed = pageSeed("/portfolio");
  const copy = pageIntro(await getPageMeta("/portfolio"), {
    kicker: seed?.kicker || "Work",
    heading: seed?.heading || "Real products. Real business impact.",
    lead:
      seed?.lead ||
      "Selected products we have designed and shipped. Open a case study for the problem, the build, and the outcome.",
    body: seed?.body || "",
  });
  return (
    <>
      <PageHero
        kicker={copy.kicker}
        title={copy.heading}
        lead={copy.lead}
        image={copy.image}
        imageAlt={copy.imageAlt}
        highlight="Real business impact"
      />
      <Container className="section-pad">
        {copy.body ? <Prose text={copy.body} className="mb-10 max-w-2xl text-sm text-muted-foreground" /> : null}
        <PortfolioBrowser projects={projects} />
      </Container>
      <CtaBand
        title={
          <>
            Have a product idea of your <GradientText>own?</GradientText>
          </>
        }
        description="Tell us what you're building — we'll help you explore the right approach and delivery plan."
        primaryHref="/contact"
        primaryLabel="Build My Software"
        secondaryHref="/services"
        secondaryLabel="View Services"
      />
    </>
  );
}
