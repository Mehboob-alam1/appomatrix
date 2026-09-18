import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactFormSchema } from "@/lib/validations/contact";
import { saveFormSubmission } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    await saveFormSubmission(data);

    const resendKey = process.env.RESEND_API_KEY;
    const notifyTo = process.env.CONTACT_NOTIFY_EMAIL;

    if (resendKey && notifyTo) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "Appo Matrix <onboarding@resend.dev>",
        to: notifyTo,
        subject: `New project inquiry from ${data.name}`,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone ?? "—"}`,
          `Project type: ${data.projectType}`,
          `Budget: ${data.budget}`,
          `Timeline: ${data.timeline}`,
          `Source: ${data.source ?? "website"}`,
          "",
          data.details,
        ].join("\n"),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Unable to submit form" }, { status: 500 });
  }
}
