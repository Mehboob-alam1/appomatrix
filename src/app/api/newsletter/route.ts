import { NextResponse } from "next/server";
import { Resend } from "resend";
import { newsletterSchema } from "@/lib/validations/contact";
import { saveFormSubmission } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await saveFormSubmission({
      name: "Newsletter",
      email: parsed.data.email,
      projectType: "newsletter",
      budget: "n/a",
      timeline: "n/a",
      details: "Newsletter / lead magnet signup",
      source: "newsletter",
    });

    const resendKey = process.env.RESEND_API_KEY;
    const notifyTo = process.env.CONTACT_NOTIFY_EMAIL;

    if (resendKey && notifyTo) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "Appo Matrix <onboarding@resend.dev>",
        to: notifyTo,
        subject: "New newsletter / lead magnet signup",
        text: `Email: ${parsed.data.email}`,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Unable to subscribe" }, { status: 500 });
  }
}
