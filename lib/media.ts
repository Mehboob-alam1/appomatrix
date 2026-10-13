import { randomBytes } from "crypto";
import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { all, get, run } from "@/lib/db";

const MAX_BYTES = 5 * 1024 * 1024;

export function uploadDir() {
  const configured = process.env.UPLOAD_DIR?.trim();
  return path.resolve(configured || path.join(process.cwd(), "data", "uploads"));
}

export function safeUploadName(name: string) {
  return /^[a-zA-Z0-9._-]+$/.test(name) && !name.includes("..");
}

function sniff(buf: Buffer) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: "png", mime: "image/png" };
  }
  if (buf.length >= 6) {
    const head = buf.subarray(0, 6).toString("ascii");
    if (head === "GIF87a" || head === "GIF89a") return { ext: "gif", mime: "image/gif" };
  }
  if (buf.length >= 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") {
    return { ext: "webp", mime: "image/webp" };
  }
  return null;
}

export async function saveUpload(file: File) {
  if (file.size <= 0 || file.size > MAX_BYTES) {
    throw new Error("Images must be under 5 MB.");
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_BYTES) throw new Error("Images must be under 5 MB.");
  const kind = sniff(buffer);
  if (!kind) throw new Error("Use a JPG, PNG, WEBP, or GIF.");
  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${kind.ext}`;
  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  const target = path.join(dir, filename);
  if (!target.startsWith(dir)) throw new Error("Invalid upload path.");
  await writeFile(target, buffer);
  const id = `med_${randomBytes(6).toString("hex")}`;
  const url = `/uploads/${filename}`;
  const original = path.basename(file.name || "image").replace(/[^\w.\- ]+/g, "").slice(0, 180);
  await run(
    `INSERT INTO media (id, filename, original_name, mime, size_bytes, alt, url, created_at)
     VALUES (?, ?, ?, ?, ?, '', ?, ?)`,
    [id, filename, original, kind.mime, buffer.length, url, new Date().toISOString()],
  );
  return { id, url, filename, mime: kind.mime };
}

export async function readUpload(filename: string) {
  if (!safeUploadName(filename)) return null;
  const dir = uploadDir();
  const target = path.join(dir, filename);
  if (!target.startsWith(`${dir}${path.sep}`)) return null;
  try {
    const data = await readFile(target);
    const kind = sniff(data);
    if (!kind) return null;
    return { data, mime: kind.mime };
  } catch {
    return null;
  }
}

async function clearUrl(url: string) {
  const tables: [string, string][] = [
    ["services", "image"],
    ["projects", "cover_image"],
    ["posts", "featured_image"],
    ["team_members", "photo"],
    ["scholarships", "cover_image"],
    ["homepage_sections", "image"],
    ["page_meta", "image"],
  ];
  for (const [table, column] of tables) {
    await run(`UPDATE ${table} SET ${column} = '' WHERE ${column} = ?`, [url]);
  }
  const projects = await all("SELECT id, gallery FROM projects");
  for (const project of projects) {
    const raw = String(project.gallery || "");
    if (!raw.includes(url)) continue;
    try {
      const gallery = JSON.parse(raw) as { url?: string }[];
      if (!Array.isArray(gallery)) continue;
      const next = gallery.filter((item) => item?.url !== url);
      if (next.length !== gallery.length) {
        await run("UPDATE projects SET gallery = ? WHERE id = ?", [JSON.stringify(next), String(project.id)]);
      }
    } catch {
      continue;
    }
  }
  const settings = await get("SELECT value FROM settings WHERE `key` = 'site'");
  if (!settings) return;
  try {
    const value = JSON.parse(String(settings.value)) as Record<string, string>;
    let changed = false;
    for (const key of ["logoUrl", "faviconUrl", "seoImage", "heroImage"]) {
      if (value[key] === url) {
        value[key] = "";
        changed = true;
      }
    }
    if (changed) {
      await run("UPDATE settings SET value = ? WHERE `key` = 'site'", [JSON.stringify(value)]);
    }
  } catch {
    return;
  }
}

export async function deleteUpload(urlOrName: string) {
  const filename = urlOrName.startsWith("/uploads/") ? urlOrName.slice("/uploads/".length) : urlOrName;
  if (!safeUploadName(filename)) throw new Error("Unknown file.");
  const url = `/uploads/${filename}`;
  const dir = uploadDir();
  const target = path.join(dir, filename);
  if (!target.startsWith(`${dir}${path.sep}`)) throw new Error("Unknown file.");
  await clearUrl(url);
  await run("DELETE FROM media WHERE filename = ?", [filename]);
  try {
    await unlink(target);
  } catch {
    return { url, removed: false as const };
  }
  return { url, removed: true as const };
}
