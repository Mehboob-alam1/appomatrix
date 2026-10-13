import { readFile } from "fs/promises";
import path from "path";
import { readUpload } from "@/lib/media";
import { getSettings } from "@/lib/queries";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const BRAND_ICON = path.join(process.cwd(), "public/brand/favicon-32.png");

async function png(data: Buffer | Uint8Array) {
  return new Response(new Uint8Array(data), {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=3600" },
  });
}

export default async function Icon() {
  try {
    const settings = await getSettings();
    if (settings.faviconUrl.startsWith("/uploads/") && settings.faviconUrl.endsWith(".png")) {
      const file = await readUpload(settings.faviconUrl.slice("/uploads/".length));
      if (file?.mime === "image/png") return png(file.data);
    }
  } catch {
    // The bundled mark is used when MySQL or an uploaded favicon is unavailable.
  }
  return png(await readFile(BRAND_ICON));
}
