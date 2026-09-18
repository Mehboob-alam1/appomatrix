"use client";

import { useState } from "react";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { ReadingTimeField } from "@/components/admin/reading-time-field";
import { AdminFormSection } from "@/components/admin/admin-form-section";
import { adminHintClass, adminLabelClass, adminTextareaClass } from "@/components/admin/admin-form-styles";

export function PostContentEditor({
  defaultContent = "",
  defaultExcerpt = "",
  defaultReadingTime = 5,
}: {
  defaultContent?: string;
  defaultExcerpt?: string;
  defaultReadingTime?: number;
}) {
  const [readingTime, setReadingTime] = useState(defaultReadingTime);
  const [wordStats, setWordStats] = useState({ words: 0, minutes: defaultReadingTime });

  return (
    <AdminFormSection
      title="Article content"
      description="Use the toolbar for H1–H4, emphasis, lists, quotes, and links. The post title is already the page H1—use H1 in the body only if you need a second top-level heading."
    >
      <label className={adminLabelClass}>
        Excerpt (used in listings & can supplement meta description)
        <textarea
          name="excerpt"
          required
          rows={3}
          defaultValue={defaultExcerpt}
          className={adminTextareaClass}
          maxLength={320}
          placeholder="1–2 sentence hook for blog index and RSS."
        />
        <p className={adminHintClass}>Max 320 characters · aim for 140–160 for snippet-style excerpts.</p>
      </label>
      <RichTextEditor
        name="content"
        label="Body"
        defaultValue={defaultContent}
        minHeight={320}
        hint={`${wordStats.words} words · ~${wordStats.minutes} min read (updates as you type)`}
        onWordStatsChange={(stats) => {
          setWordStats(stats);
          setReadingTime(stats.minutes);
        }}
      />
      <ReadingTimeField minutes={readingTime} onChange={setReadingTime} />
    </AdminFormSection>
  );
}
