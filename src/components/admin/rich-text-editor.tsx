"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { adminHintClass, adminLabelClass } from "@/components/admin/admin-form-styles";
import { htmlToPlainText } from "@/lib/sanitize-html";
import { cn } from "@/lib/cn";

function ToolbarButton({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition",
        active
          ? "bg-sky-500/25 text-sky-200 ring-1 ring-sky-400/40"
          : "text-slate-300 hover:bg-white/10 hover:text-white",
      )}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 border-b border-white/10 bg-black/20 px-2 py-2">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <span className="mx-1 w-px self-stretch bg-white/10" />
      <ToolbarButton
        label="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <ToolbarButton
        label="Heading 4"
        active={editor.isActive("heading", { level: 4 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        H4
      </ToolbarButton>
      <span className="mx-1 w-px self-stretch bg-white/10" />
      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </ToolbarButton>
      <ToolbarButton
        label="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        “ Quote
      </ToolbarButton>
      <span className="mx-1 w-px self-stretch bg-white/10" />
      <ToolbarButton label="Insert link" active={editor.isActive("link")} onClick={setLink}>
        Link
      </ToolbarButton>
      <ToolbarButton
        label="Undo"
        onClick={() => editor.chain().focus().undo().run()}
      >
        ↶
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        onClick={() => editor.chain().focus().redo().run()}
      >
        ↷
      </ToolbarButton>
    </div>
  );
}

function toInitialHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("<")) return trimmed;
  return trimmed
    .split(/\n\n+/)
    .map((block) => `<p>${block.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function RichTextEditor({
  name,
  label,
  defaultValue = "",
  hint,
  minHeight = 220,
  onWordStatsChange,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  minHeight?: number;
  onWordStatsChange?: (stats: { words: number; minutes: number }) => void;
}) {
  const [html, setHtml] = useState(() => toInitialHtml(defaultValue));

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer" } }),
      Placeholder.configure({
        placeholder: "Write your content… Use the toolbar for headings, bold, lists, and links.",
      }),
    ],
    content: toInitialHtml(defaultValue),
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none px-4 py-3 text-sm leading-relaxed focus:outline-none min-h-[180px] [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_h4]:text-base [&_h4]:font-semibold [&_p]:text-slate-200 [&_a]:text-sky-400 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-400/40 [&_blockquote]:pl-4",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const next = ed.getHTML();
      setHtml(next);
      if (onWordStatsChange) {
        const words = htmlToPlainText(next).split(/\s+/).filter(Boolean).length;
        onWordStatsChange({ words, minutes: Math.max(1, Math.round(words / 200)) });
      }
    },
  });

  useEffect(() => {
    if (!editor) return;
    const plain = htmlToPlainText(html);
    const words = plain.split(/\s+/).filter(Boolean).length;
    onWordStatsChange?.({ words, minutes: Math.max(1, Math.round(words / 200)) });
  }, [editor, html, onWordStatsChange]);

  return (
    <div className={adminLabelClass}>
      {label}
      <div
        className="mt-1.5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] shadow-inner shadow-black/10 focus-within:border-sky-400/60 focus-within:ring-2 focus-within:ring-sky-400/20"
        style={{ minHeight }}
      >
        <EditorToolbar editor={editor} />
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <div className="px-4 py-8 text-sm text-slate-500">Loading editor…</div>
        )}
      </div>
      <input type="hidden" name={name} value={html} readOnly />
      {hint ? <p className={adminHintClass}>{hint}</p> : null}
    </div>
  );
}
