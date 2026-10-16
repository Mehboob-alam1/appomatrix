"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Underline as UnderlineIcon,
} from "lucide-react";
import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { editorHtml } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

export function RichTextField({
  label,
  name,
  defaultValue = "",
  required,
  hint,
  minHeight = "220px",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  hint?: string;
  minHeight?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({
        placeholder: "Write here. Use the toolbar for headings, lists, highlight, and alignment.",
      }),
    ],
    content: editorHtml(defaultValue),
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[180px] px-4 py-3 text-sm leading-relaxed outline-none focus:outline-none",
        style: `min-height:${minHeight}`,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const next = editorHtml(defaultValue);
    if (editor.getHTML() !== next) editor.commands.setContent(next, { emitUpdate: false });
  }, [defaultValue, editor]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <input
        type="hidden"
        id={name}
        name={name}
        required={required}
        value={editor?.isEmpty ? "" : editor?.getHTML() || ""}
        readOnly
      />
      <div className="overflow-hidden rounded-xl border border-input bg-background">
        {editor ? <Toolbar editor={editor} /> : null}
        {editor ? <EditorContent editor={editor} /> : <div className="min-h-[180px] px-4 py-3 text-sm text-muted-foreground">Loading editor…</div>}
      </div>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Toolbar({ editor }: { editor: NonNullable<ReturnType<typeof useEditor>> }) {

  const button = (
    active: boolean,
    onClick: () => void,
    icon: React.ReactNode,
    title: string,
  ) => (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
        active && "bg-muted text-foreground",
      )}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      {icon}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-0.5 border-b border-border bg-muted/40 px-2 py-1.5">
      {button(editor.isActive("bold"), () => editor.chain().focus().toggleBold().run(), <Bold className="size-4" />, "Bold")}
      {button(editor.isActive("italic"), () => editor.chain().focus().toggleItalic().run(), <Italic className="size-4" />, "Italic")}
      {button(editor.isActive("underline"), () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon className="size-4" />, "Underline")}
      {button(editor.isActive("highlight"), () => editor.chain().focus().toggleHighlight().run(), <Highlighter className="size-4" />, "Highlight")}
      <span className="mx-1 w-px self-stretch bg-border" />
      {button(editor.isActive("heading", { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="size-4" />, "Heading")}
      {button(editor.isActive("heading", { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="size-4" />, "Subheading")}
      {button(editor.isActive("bulletList"), () => editor.chain().focus().toggleBulletList().run(), <List className="size-4" />, "Bullet list")}
      {button(editor.isActive("orderedList"), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="size-4" />, "Numbered list")}
      {button(editor.isActive("blockquote"), () => editor.chain().focus().toggleBlockquote().run(), <Quote className="size-4" />, "Quote")}
      <span className="mx-1 w-px self-stretch bg-border" />
      {button(editor.isActive({ textAlign: "left" }), () => editor.chain().focus().setTextAlign("left").run(), <AlignLeft className="size-4" />, "Align left")}
      {button(editor.isActive({ textAlign: "center" }), () => editor.chain().focus().setTextAlign("center").run(), <AlignCenter className="size-4" />, "Align center")}
      {button(editor.isActive({ textAlign: "right" }), () => editor.chain().focus().setTextAlign("right").run(), <AlignRight className="size-4" />, "Align right")}
      {button(editor.isActive({ textAlign: "justify" }), () => editor.chain().focus().setTextAlign("justify").run(), <AlignJustify className="size-4" />, "Justify")}
      <span className="mx-1 w-px self-stretch bg-border" />
      {button(editor.isActive("link"), () => {
        if (editor.isActive("link")) {
          editor.chain().focus().unsetLink().run();
          return;
        }
        const href = window.prompt("Link URL", "https://");
        if (!href) return;
        editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
      }, <Link2 className="size-4" />, "Link")}
    </div>
  );
}
