import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { ServiceCard } from "@/components/cards/service-card";
import { getServices } from "@/lib/data";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Web development, mobile apps, SaaS platforms, and digital transformation consulting from Appo Matrix.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything you need to ship"
        description="Product-minded squads for web, mobile, SaaS, and digital transformation—from discovery to launch."
      />
      <Container className="pb-16 sm:pb-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      </Container>
    </>
  );
}
