"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteButton } from "@/components/admin/delete-button";
import { moveContent, publishContent } from "@/lib/actions";
import { csrfTokenFromDocument } from "@/lib/csrf-client";

export function RecordActions({
  section,
  id,
  label,
  published,
}: {
  section: string;
  id: string;
  label: string;
  published: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function run(action: Promise<{ ok: boolean; error?: string }>) {
    const result = await action;
    if (!result.ok) {
      setError(result.error || "Could not update.");
      return;
    }
    setError("");
    router.refresh();
  }

  const token = () => csrfTokenFromDocument();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/admin/${section}/${id}`} className="inline-flex h-7 items-center rounded-lg border border-border px-2 text-xs">
        Edit
      </Link>
      <button type="button" className="inline-flex h-7 items-center rounded-lg border border-border px-2 text-xs" onClick={() => run(publishContent(section, id, !published, token()))}>
        {published ? "Unpublish" : "Publish"}
      </button>
      <button type="button" className="inline-flex h-7 items-center rounded-lg border border-border px-2 text-xs" onClick={() => run(moveContent(section, id, "up", token()))}>
        Up
      </button>
      <button type="button" className="inline-flex h-7 items-center rounded-lg border border-border px-2 text-xs" onClick={() => run(moveContent(section, id, "down", token()))}>
        Down
      </button>
      <DeleteButton section={section} id={id} label={label} />
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </div>
  );
}
