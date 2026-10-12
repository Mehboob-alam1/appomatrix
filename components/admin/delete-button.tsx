"use client";

import { useRouter } from "next/navigation";
import { deleteContent } from "@/lib/actions";
import { Button } from "@/components/ui/button";

export function DeleteButton({ section, id, label }: { section: string; id: string; label: string }) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      onClick={async () => {
        if (!confirm(`Delete “${label}”?`)) return;
        const result = await deleteContent(section, id);
        if (!result.ok) {
          alert(result.error);
          return;
        }
        router.refresh();
      }}
    >
      Delete
    </Button>
  );
}
