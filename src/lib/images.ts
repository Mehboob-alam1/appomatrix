export function resolveImageUrl(image: string | undefined, _width = 1200): string | undefined {
  if (!image) return undefined;
  return image.startsWith("/") ? image : image;
}

export function resolveImageAlt(
  image: string | undefined,
  explicitAlt: string | undefined,
  fallback: string,
): string {
  return explicitAlt?.trim() || fallback;
}
