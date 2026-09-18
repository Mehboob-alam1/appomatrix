import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityReadClient } from "@/sanity/client";

const builder = createImageUrlBuilder(sanityReadClient);

export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}
