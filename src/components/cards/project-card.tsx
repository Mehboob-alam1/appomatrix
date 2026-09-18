import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/content";
import { resolveImageAlt, resolveImageUrl } from "@/lib/images";

export function ProjectCard({ project }: { project: Project }) {
  const image = resolveImageUrl(project.coverImage, 800);
  const alt = resolveImageAlt(project.coverImage, project.coverImageAlt, project.title);

  return (
    <Link
      href={`/work/${project.slug}`}
      className="card-interactive group overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-muted">
        {image ? (
          <Image
            src={image}
            alt={alt}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : null}
      </div>
      <div className="p-5">
        <span className="inline-block rounded-full bg-accent-tertiary/15 px-2.5 py-0.5 text-xs font-semibold text-accent-tertiary">
          {project.category}
        </span>
        <h3 className="mt-1 font-display text-lg font-semibold">{project.title}</h3>
        <p className="mt-2 text-sm text-muted line-clamp-2">
          {project.excerpt ?? project.result ?? ""}
        </p>
      </div>
    </Link>
  );
}
