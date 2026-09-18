"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminHintClass,
  adminInputClass,
  adminLabelClass,
  adminSectionClass,
  adminTextareaClass,
} from "@/components/admin/admin-form-styles";

const TITLE_MAX = 60;
const TITLE_HARD = 70;
const DESC_MAX = 160;

function counterClass(length: number, soft: number, hard: number) {
  if (length > hard) return "text-red-400";
  if (length > soft) return "text-amber-400";
  return "text-slate-500";
}

export function SeoFieldGroup({
  formId,
  pathPrefix,
  defaultSeoTitle = "",
  defaultSeoDescription = "",
  defaultSlug = "",
  defaultPageTitle = "",
  siteName = "Appo Matrix",
}: {
  formId: string;
  pathPrefix: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultSlug?: string;
  defaultPageTitle?: string;
  siteName?: string;
}) {
  const [seoTitle, setSeoTitle] = useState(defaultSeoTitle);
  const [seoDescription, setSeoDescription] = useState(defaultSeoDescription);
  const [slug, setSlug] = useState(defaultSlug);
  const [pageTitle, setPageTitle] = useState(defaultPageTitle);

  const syncFromForm = useCallback(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;
    const title = (form.elements.namedItem("title") as HTMLInputElement | null)?.value ?? "";
    const slugVal = (form.elements.namedItem("slug") as HTMLInputElement | null)?.value ?? slug;
    setPageTitle(title);
    setSlug(slugVal);
  }, [formId, slug]);

  useEffect(() => {
    syncFromForm();
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener("input", syncFromForm);
    return () => form.removeEventListener("input", syncFromForm);
  }, [formId, syncFromForm]);

  const displayTitle = seoTitle.trim() || pageTitle || "Page title";
  const previewTitle =
    displayTitle.length > TITLE_HARD ? `${displayTitle.slice(0, TITLE_HARD)}…` : displayTitle;
  const previewDesc =
    seoDescription.trim() ||
    "Add a meta description to improve click-through rate from Google search results.";
  const urlPath = `${pathPrefix}${slug || "your-slug"}`.replace(/\/+/g, "/");

  return (
    <aside className={`${adminSectionClass} space-y-4`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-300">SEO toolkit</p>
        <p className="mt-1 text-xs text-slate-400">
          Titles, descriptions, and URL slug for search & social previews.
        </p>
      </div>

      <label className={adminLabelClass}>
        Meta title
        <input
          form={formId}
          name="seoTitle"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          className={adminInputClass}
          placeholder={pageTitle || "Defaults to page title"}
        />
        <p className={`mt-1 text-xs ${counterClass(seoTitle.length, TITLE_MAX, TITLE_HARD)}`}>
          {seoTitle.length}/{TITLE_MAX} recommended · max {TITLE_HARD}
        </p>
      </label>

      <label className={adminLabelClass}>
        Meta description
        <textarea
          form={formId}
          name="seoDescription"
          rows={4}
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          className={adminTextareaClass}
          placeholder="Summarize the page in 1–2 sentences with a clear benefit."
        />
        <p className={`mt-1 text-xs ${counterClass(seoDescription.length, DESC_MAX, DESC_MAX + 20)}`}>
          {seoDescription.length}/{DESC_MAX} characters
        </p>
      </label>

      <div className="rounded-xl border border-white/10 bg-black/30 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Google preview
        </p>
        <p className="mt-2 truncate text-xs text-slate-500">appomatrix.com{urlPath}</p>
        <p className="mt-1 text-base leading-snug text-[#8ab4f8]">{previewTitle}</p>
        <p className="mt-1 line-clamp-2 text-sm text-slate-400">{previewDesc}</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-slate-400">
        <p className="font-medium text-slate-300">Open Graph / Twitter</p>
        <p className="mt-2">
          Uses the same meta title & description. Set a featured/cover image with descriptive{" "}
          <strong className="text-slate-200">alt text</strong> for rich shares.
        </p>
        <p className="mt-2">
          Public title: <span className="text-slate-200">{displayTitle}</span>
          {seoTitle.trim() ? "" : " (fallback)"}
        </p>
      </div>

      <ul className="space-y-1 text-xs text-slate-500">
        <li className={slug ? "text-emerald-400/90" : "text-amber-400/90"}>
          {slug ? "✓" : "○"} URL slug set
        </li>
        <li className={seoTitle.trim() ? "text-emerald-400/90" : "text-amber-400/90"}>
          {seoTitle.trim() ? "✓" : "○"} Custom meta title
        </li>
        <li
          className={
            seoDescription.length >= 120 && seoDescription.length <= DESC_MAX
              ? "text-emerald-400/90"
              : "text-amber-400/90"
          }
        >
          {seoDescription.length >= 120 ? "✓" : "○"} Description length (aim 120–160)
        </li>
      </ul>

      <p className={adminHintClass}>
        Site name in browser tab: {siteName}
      </p>
    </aside>
  );
}
