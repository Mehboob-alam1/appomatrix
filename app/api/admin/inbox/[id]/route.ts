import { requireAdmin, ok, fail, publicError, readJson } from "@/lib/http";
import {
  getEmailThread,
  markThreadRead,
  replyToThread,
  updateThreadFlags,
} from "@/lib/email-inbox";
import { getSettings } from "@/lib/queries";

type Params = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: Params) {
  const gate = await requireAdmin(request);
  if (gate.error) return gate.error;
  try {
    const { id } = await params;
    const thread = await getEmailThread(id);
    if (!thread) return fail("Conversation not found.", 404);
    await markThreadRead(id, true);
    const refreshed = await getEmailThread(id);
    return ok(refreshed);
  } catch (error) {
    return publicError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const gate = await requireAdmin(request);
  if (gate.error) return gate.error;
  try {
    const { id } = await params;
    const body = await readJson(request);
    if (!body) return fail("Invalid JSON body.");
    if (typeof body.read === "boolean") await markThreadRead(id, body.read);
    await updateThreadFlags(id, {
      starred: typeof body.starred === "boolean" ? body.starred : undefined,
      status: body.status === "archived" || body.status === "open" ? body.status : undefined,
    });
    const thread = await getEmailThread(id);
    if (!thread) return fail("Conversation not found.", 404);
    return ok(thread);
  } catch (error) {
    return publicError(error);
  }
}

export async function POST(request: Request, { params }: Params) {
  const gate = await requireAdmin(request);
  if (gate.error) return gate.error;
  try {
    const { id } = await params;
    const contentType = request.headers.get("content-type") || "";
    let bodyText = "";
    let html = "";
    const attachments: { filename: string; contentType?: string; content: Buffer }[] = [];

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      bodyText = String(form.get("body") || "");
      html = String(form.get("html") || "");
      const files = form.getAll("attachments");
      for (const file of files) {
        if (!(file instanceof File) || !file.size) continue;
        if (file.size > 8 * 1024 * 1024) return fail("Each attachment must be under 8 MB.");
        const buffer = Buffer.from(await file.arrayBuffer());
        attachments.push({
          filename: file.name || "attachment",
          contentType: file.type || "application/octet-stream",
          content: buffer,
        });
      }
    } else {
      const body = await readJson(request);
      if (!body) return fail("Invalid JSON body.");
      bodyText = String(body.body || body.bodyText || "");
      html = String(body.html || "");
    }

    const settings = await getSettings();
    const result = await replyToThread({
      threadId: id,
      bodyText,
      html: html || undefined,
      fromEmail: settings.email,
      fromName: settings.siteName,
      attachments,
    });
    if (!result.ok) return fail(result.error, 400);
    const thread = await getEmailThread(id);
    return ok(thread);
  } catch (error) {
    return publicError(error);
  }
}
