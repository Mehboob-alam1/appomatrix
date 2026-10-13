"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { csrfTokenFromDocument } from "@/lib/csrf-client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setPending(true);
        setError("");
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-csrf-token": csrfTokenFromDocument() },
          body: JSON.stringify({
            username: String(data.get("username") || ""),
            password: String(data.get("password") || ""),
          }),
        });
        const result = (await response.json()) as { ok?: boolean; error?: string };
        setPending(false);
        if (!response.ok || !result.ok) {
          setError(result.error || "Could not sign in.");
          return;
        }
        router.push("/admin");
        router.refresh();
      }}
    >
      <label className="block space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input id="username" name="username" autoComplete="username" required className="h-10" />
      </label>
      <label className="block space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-10" />
      </label>
      {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
      <Button type="submit" className="h-10 w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
