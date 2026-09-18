import { adminHintClass, adminInputClass, adminLabelClass } from "@/components/admin/admin-form-styles";

export function ImageSeoField({
  urlName,
  altName,
  urlDefault = "",
  altDefault = "",
  label = "Image",
}: {
  urlName: string;
  altName: string;
  urlDefault?: string;
  altDefault?: string;
  label?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className={adminLabelClass}>
        {label} URL
        <input name={urlName} defaultValue={urlDefault} className={adminInputClass} placeholder="/uploads/… or https://…" />
        <p className={adminHintClass}>Required for social previews when this is the main image.</p>
      </label>
      <label className={adminLabelClass}>
        Alt text (SEO & accessibility)
        <input name={altName} required defaultValue={altDefault} className={adminInputClass} placeholder="Describe the image clearly" />
        <p className={adminHintClass}>Required. Include subject + context, not &quot;image1&quot;.</p>
      </label>
    </div>
  );
}
