import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { WorkGrid } from "@/components/work/work-grid";
import { getProjectCategories, getProjects } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Work",
  description: "Case studies and client outcomes from Appo Matrix.",
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getProjects();
  const categories = getProjectCategories(projects);

  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Proof over promises"
        description="Filter by category and explore how we help teams ship reliable software."
      />
      <Container className="pb-16 sm:pb-20">
        <WorkGrid projects={projects} categories={categories} />
      </Container>
    </>
  );
}
