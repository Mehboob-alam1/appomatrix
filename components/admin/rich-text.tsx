"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
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
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { editorHtml, richTextPlain } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

function htmlForForm(editor: { isEmpty: boolean; getHTML: () => string } | null) {
  if (!editor || editor.isEmpty) return "";
  return editor.getHTML();
}

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [html, setHtml] = useState(() => {
    const initial = editorHtml(defaultValue);
    return richTextPlain(initial) ? initial : "";
  });

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
    shouldRerenderOnTransaction: true,
    onCreate: ({ editor: instance }) => {
      const next = htmlForForm(instance);
      setHtml(next);
      if (inputRef.current) inputRef.current.value = next;
    },
    onUpdate: ({ editor: instance }) => {
      const next = htmlForForm(instance);
      setHtml(next);
      if (inputRef.current) inputRef.current.value = next;
    },
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
    const current = editor.getHTML();
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
      const formValue = htmlForForm(editor);
      setHtml(formValue);
      if (inputRef.current) inputRef.current.value = formValue;
    }
  }, [defaultValue, editor]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.value = html;
  }, [html]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <input
        ref={inputRef}
        type="hidden"
        id={name}
        name={name}
        data-rich-text={name}
        required={required}
        value={html}
        onChange={() => {
          /* controlled for React; FormData reads the live DOM value */
        }}
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
  const state = useEditorState({
    editor,
    selector: ({ editor: instance }) => ({
      bold: instance.isActive("bold"),
      italic: instance.isActive("italic"),
      underline: instance.isActive("underline"),
      highlight: instance.isActive("highlight"),
      h2: instance.isActive("heading", { level: 2 }),
      h3: instance.isActive("heading", { level: 3 }),
      bullet: instance.isActive("bulletList"),
      ordered: instance.isActive("orderedList"),
      quote: instance.isActive("blockquote"),
      left: instance.isActive({ textAlign: "left" }),
      center: instance.isActive({ textAlign: "center" }),
      right: instance.isActive({ textAlign: "right" }),
      justify: instance.isActive({ textAlign: "justify" }),
      link: instance.isActive("link"),
    }),
  });

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
      {button(state.bold, () => editor.chain().focus().toggleBold().run(), <Bold className="size-4" />, "Bold")}
      {button(state.italic, () => editor.chain().focus().toggleItalic().run(), <Italic className="size-4" />, "Italic")}
      {button(state.underline, () => editor.chain().focus().toggleUnderline().run(), <UnderlineIcon className="size-4" />, "Underline")}
      {button(state.highlight, () => editor.chain().focus().toggleHighlight().run(), <Highlighter className="size-4" />, "Highlight")}
      <span className="mx-1 w-px self-stretch bg-border" />
      {button(state.h2, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="size-4" />, "Heading")}
      {button(state.h3, () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="size-4" />, "Subheading")}
      {button(state.bullet, () => editor.chain().focus().toggleBulletList().run(), <List className="size-4" />, "Bullet list")}
      {button(state.ordered, () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="size-4" />, "Numbered list")}
      {button(state.quote, () => editor.chain().focus().toggleBlockquote().run(), <Quote className="size-4" />, "Quote")}
      <span className="mx-1 w-px self-stretch bg-border" />
      {button(state.left, () => editor.chain().focus().setTextAlign("left").run(), <AlignLeft className="size-4" />, "Align left")}
      {button(state.center, () => editor.chain().focus().setTextAlign("center").run(), <AlignCenter className="size-4" />, "Align center")}
      {button(state.right, () => editor.chain().focus().setTextAlign("right").run(), <AlignRight className="size-4" />, "Align right")}
      {button(state.justify, () => editor.chain().focus().setTextAlign("justify").run(), <AlignJustify className="size-4" />, "Justify")}
      <span className="mx-1 w-px self-stretch bg-border" />
      {button(state.link, () => {
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
