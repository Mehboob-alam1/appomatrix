import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { randomBytes } from "crypto";

export type OutboundAttachment = {
  filename: string;
  contentType?: string;
  content: Buffer;
  path?: string;
};

export type SendMailInput = {
  from: string;
  fromName?: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
  inReplyTo?: string;
  references?: string[];
  attachments?: OutboundAttachment[];
};

let transporter: Transporter | null = null;

export function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function mailFromAddress(fallback = "hello@appomatrix.com") {
  return (process.env.SMTP_FROM || process.env.MAIL_FROM || fallback).trim();
}

function getTransporter() {
  if (!smtpConfigured()) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS.");
  }
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 465);
    const secure =
      process.env.SMTP_SECURE === "true" || (!process.env.SMTP_SECURE && port === 465);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export function newMessageId(domain = "appomatrix.com") {
  const host = (process.env.SMTP_FROM || process.env.MAIL_FROM || `noreply@${domain}`)
    .split("@")[1]
    ?.replace(/>/g, "")
    .trim() || domain;
  return `<${randomBytes(12).toString("hex")}@${host}>`;
}

export async function sendMail(input: SendMailInput) {
  const transport = getTransporter();
  const messageId = newMessageId();
  const fromName = input.fromName || "Appo Matrix";
  const info = await transport.sendMail({
    from: `"${fromName}" <${input.from}>`,
    to: input.to,
    replyTo: input.replyTo || undefined,
    subject: input.subject,
    text: input.text,
    html: input.html || undefined,
    messageId,
    inReplyTo: input.inReplyTo || undefined,
    references: input.references?.length ? input.references.join(" ") : undefined,
    attachments: input.attachments?.map((file) => ({
      filename: file.filename,
      contentType: file.contentType,
      content: file.content,
      path: file.path,
    })),
  });
  return {
    messageId: String(info.messageId || messageId),
    accepted: info.accepted,
    rejected: info.rejected,
  };
}

export function plainToHtml(text: string) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap">${escaped}</div>`;
}
