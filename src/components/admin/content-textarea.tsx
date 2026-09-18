"use client";

import { useMemo, useState } from "react";
import { adminHintClass, adminLabelClass, adminTextareaClass } from "@/components/admin/admin-form-styles";

export function ContentTextarea({
  name,
  label,
  defaultValue = "",
  rows = 10,
  required,
  hint,
  showStats,
  onReadingTimeChange,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
  hint?: string;
  showStats?: boolean;
  onReadingTimeChange?: (minutes: number) => void;
}) {
  const [value, setValue] = useState(defaultValue);

  const stats = useMemo(() => {
    const words = value.trim() ? value.trim().split(/\s+/).length : 0;
    const minutes = Math.max(1, Math.round(words / 200));
    return { words, minutes, paragraphs: value.split(/\n\n+/).filter(Boolean).length };
  }, [value]);

  return (
    <label className={adminLabelClass}>
      {label}
      <textarea
        name={name}
        required={required}
        rows={rows}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (showStats && onReadingTimeChange) {
            const words = e.target.value.trim() ? e.target.value.trim().split(/\s+/).length : 0;
            onReadingTimeChange(Math.max(1, Math.round(words / 200)));
          }
        }}
        className={`${adminTextareaClass} min-h-[220px] font-[450]`}
        placeholder="Write for humans first. Use blank lines between paragraphs."
      />
      {hint ? <p className={adminHintClass}>{hint}</p> : null}
      {showStats ? (
        <p className={adminHintClass}>
          {stats.words} words · ~{stats.minutes} min read · {stats.paragraphs} paragraph
          {stats.paragraphs === 1 ? "" : "s"}
        </p>
      ) : null}
    </label>
  );
}
