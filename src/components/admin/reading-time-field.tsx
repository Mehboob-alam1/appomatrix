"use client";

import { adminHintClass, adminInputClass, adminLabelClass } from "@/components/admin/admin-form-styles";

export function ReadingTimeField({
  minutes,
  onChange,
}: {
  minutes: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className={adminLabelClass}>
      Reading time (minutes)
      <input
        name="readingTimeMinutes"
        type="number"
        min={1}
        value={minutes}
        onChange={(e) => onChange(Number(e.target.value))}
        className={adminInputClass}
      />
      <p className={adminHintClass}>Auto-suggested from word count when editing body text.</p>
    </label>
  );
}
