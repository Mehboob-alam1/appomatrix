"use client";

import { adminHintClass, adminInputClass, adminLabelClass } from "@/components/admin/admin-form-styles";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function SlugField({
  formId,
  defaultSlug = "",
  defaultTitle = "",
  pathPrefix,
}: {
  formId: string;
  defaultSlug?: string;
  defaultTitle?: string;
  pathPrefix: string;
}) {
  return (
    <div>
      <label className={adminLabelClass}>
        URL slug
        <input name="slug" defaultValue={defaultSlug} className={adminInputClass} placeholder="auto-from-title" />
        <p className={adminHintClass}>
          Public URL: {pathPrefix}
          <span className="text-slate-300">{defaultSlug || "your-slug"}</span>
        </p>
      </label>
      <button
        type="button"
        className="mt-2 text-xs font-medium text-sky-400 hover:text-sky-300"
        onClick={() => {
          const form = document.getElementById(formId) as HTMLFormElement | null;
          const title = (form?.elements.namedItem("title") as HTMLInputElement | null)?.value;
          const slugInput = form?.elements.namedItem("slug") as HTMLInputElement | null;
          if (slugInput && title) slugInput.value = slugify(title);
          slugInput?.dispatchEvent(new Event("input", { bubbles: true }));
        }}
      >
        Generate slug from title
      </button>
      {!defaultSlug && defaultTitle ? (
        <p className={`${adminHintClass} mt-1`}>Suggested: {slugify(defaultTitle)}</p>
      ) : null}
    </div>
  );
}
