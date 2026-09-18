import { adminSectionClass } from "@/components/admin/admin-form-styles";

export function AdminFormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={adminSectionClass}>
      <div className="mb-4 border-b border-white/10 pb-3">
        <h2 className="text-sm font-semibold tracking-wide text-white">{title}</h2>
        {description ? <p className="mt-1 text-xs text-slate-400">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
