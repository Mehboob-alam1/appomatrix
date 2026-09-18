"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Testimonial } from "@/types/content";

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 6000, stopOnInteraction: true }),
  ]);

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex gap-4">
        {items.map((item) => (
          <article
            key={item._id}
            className="min-w-0 shrink-0 grow-0 basis-full md:basis-[calc(50%-0.5rem)] lg:basis-[calc(33.333%-0.67rem)]"
          >
            <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
              <p className="text-sm leading-relaxed text-muted">&ldquo;{item.quote}&rdquo;</p>
              <div className="mt-6">
                <p className="font-medium">{item.clientName}</p>
                <p className="text-sm text-muted">
                  {item.role}, {item.company}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
