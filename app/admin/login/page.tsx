import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  return (
    <div className="grid min-h-screen place-items-center px-5 py-16">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-sm">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Appo Matrix</p>
        <h1 className="font-display mt-2 text-3xl tracking-tight">Studio</h1>
        <p className="mt-2 mb-6 text-sm text-muted-foreground">
          Sign in to edit services, portfolio, blog, careers, scholarships, and incoming inquiries.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
