"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Youtube } from "@tiptap/extension-youtube";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { TextAlign } from "@tiptap/extension-text-align";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Code, Code2, Link2, Unlink, Image as ImageIcon, Video as YoutubeIcon,
  AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Highlighter,
  Pilcrow, Minus,
} from "lucide-react";

const HIGHLIGHT_SWATCHES = [
  { name: "Yellow", value: "#fde68a" },
  { name: "Green", value: "#bbf7d0" },
  { name: "Blue", value: "#bfdbfe" },
  { name: "Pink", value: "#fbcfe8" },
  { name: "Purple", value: "#ddd6fe" },
  { name: "Orange", value: "#fed7aa" },
];

const TEXT_COLORS = [
  "#e7ecf6", "#fb7a3c", "#34d399", "#60a5fa", "#f472b6", "#fbbf24", "#a78bfa",
];

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors",
        "disabled:opacity-30 disabled:cursor-not-allowed",
        active
          ? "bg-accent/20 text-accent"
          : "text-ink-muted hover:bg-surface-soft hover:text-ink",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-border self-center" />;
}

function Popover({ open, onClose, children, width = 240 }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="absolute z-50 mt-2 rounded-lg border border-border bg-surface-card p-3 shadow-xl"
        style={{ width }}
      >
        {children}
      </div>
    </>
  );
}

export default function RichTextEditor({ value, onChange, placeholder = "Start writing your post…" }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const fileInputRef = useRef(null);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: "rte-codeblock" } },
        underline: false, // added separately below with custom class
        link: false,      // added separately below with custom config
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { class: "rte-link" },
      }),
      Image.configure({ HTMLAttributes: { class: "rte-image" } }),
      Youtube.configure({ width: 640, height: 360, nocookie: true, HTMLAttributes: { class: "rte-video" } }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: "rte-prose prose prose-invert max-w-none focus:outline-none min-h-[420px] px-5 py-4",
      },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  });

  // Keep editor in sync if `value` is reset from the parent (e.g. loading a draft)
  useEffect(() => {
    if (editor && value !== undefined && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  // ---- Replace this with a real upload call to your backend ----
  const uploadImage = useCallback((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // base64 data URL fallback
      reader.readAsDataURL(file);
      // TODO: swap for:
      // const fd = new FormData(); fd.append("file", file);
      // const res = await fetch("/api/upload", { method: "POST", body: fd });
      // const { url } = await res.json(); resolve(url);
    });
  }, []);

  const handleImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const url = await uploadImage(file);
    editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    e.target.value = "";
  };

  const applyLink = () => {
    if (!editor) return;
    if (!linkUrl.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl.trim() }).run();
    }
    setLinkOpen(false);
    setLinkUrl("");
  };

  const applyVideo = () => {
    if (!editor || !videoUrl.trim()) return;
    editor.commands.setYoutubeVideo({ src: videoUrl.trim() });
    setVideoOpen(false);
    setVideoUrl("");
  };

  if (!editor) return null;

  const words = editor.storage.characterCount.words();
  const chars = editor.storage.characterCount.characters();

  return (
    <div className="rounded-xl border border-border bg-surface-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-surface-raised px-2 py-1.5 relative">
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 size={16} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Paragraph" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
          <Pilcrow size={16} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough size={16} />
        </ToolbarButton>

        {/* Highlight color */}
        <div className="relative">
          <ToolbarButton title="Highlight color" active={editor.isActive("highlight")} onClick={() => setHighlightOpen((v) => !v)}>
            <Highlighter size={16} />
          </ToolbarButton>
          <Popover open={highlightOpen} onClose={() => setHighlightOpen(false)} width={180}>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">Highlight</p>
            <div className="grid grid-cols-3 gap-2">
              {HIGHLIGHT_SWATCHES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  title={s.name}
                  onClick={() => { editor.chain().focus().toggleHighlight({ color: s.value }).run(); setHighlightOpen(false); }}
                  className="h-7 w-7 rounded-md border border-border/60"
                  style={{ backgroundColor: s.value }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => { editor.chain().focus().unsetHighlight().run(); setHighlightOpen(false); }}
              className="mt-2 w-full rounded-md border border-border py-1 text-xs text-ink-muted hover:bg-surface-soft"
            >
              Remove highlight
            </button>
          </Popover>
        </div>

        {/* Text color */}
        <div className="relative">
          <ToolbarButton title="Text color" onClick={() => setColorOpen((v) => !v)}>
            <span className="flex h-4 w-4 items-center justify-center text-[13px] font-bold leading-none">A</span>
          </ToolbarButton>
          <Popover open={colorOpen} onClose={() => setColorOpen(false)} width={180}>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">Text color</p>
            <div className="grid grid-cols-4 gap-2">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => { editor.chain().focus().setColor(c).run(); setColorOpen(false); }}
                  className="h-7 w-7 rounded-full border border-border/60"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </Popover>
        </div>

        <Divider />

        <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote size={16} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          <AlignRight size={16} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <Code2 size={16} />
        </ToolbarButton>
        <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={16} />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <div className="relative">
          <ToolbarButton
            title="Insert link"
            active={editor.isActive("link")}
            onClick={() => { setLinkUrl(editor.getAttributes("link").href || ""); setLinkOpen((v) => !v); }}
          >
            <Link2 size={16} />
          </ToolbarButton>
          <Popover open={linkOpen} onClose={() => setLinkOpen(false)} width={260}>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">Link URL</p>
            <input
              autoFocus
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyLink()}
              placeholder="https://example.com"
              className="w-full rounded-md border border-border bg-surface-soft px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
            />
            <div className="mt-2 flex gap-2">
              <button type="button" onClick={applyLink} className="flex-1 rounded-md bg-accent py-1.5 text-xs font-medium text-white hover:bg-accent-hover">
                Apply
              </button>
              <button type="button" onClick={() => { editor.chain().focus().unsetLink().run(); setLinkOpen(false); }} className="rounded-md border border-border px-2 text-ink-muted hover:bg-surface-soft">
                <Unlink size={14} />
              </button>
            </div>
          </Popover>
        </div>

        <ToolbarButton title="Insert image" onClick={() => fileInputRef.current?.click()}>
          <ImageIcon size={16} />
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />

        {/* Video */}
        <div className="relative">
          <ToolbarButton title="Embed video" onClick={() => setVideoOpen((v) => !v)}>
            <YoutubeIcon size={16} />
          </ToolbarButton>
          <Popover open={videoOpen} onClose={() => setVideoOpen(false)} width={260}>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">YouTube URL</p>
            <input
              autoFocus
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyVideo()}
              placeholder="https://youtube.com/watch?v=…"
              className="w-full rounded-md border border-border bg-surface-soft px-2.5 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
            />
            <button type="button" onClick={applyVideo} className="mt-2 w-full rounded-md bg-accent py-1.5 text-xs font-medium text-white hover:bg-accent-hover">
              Embed
            </button>
          </Popover>
        </div>
      </div>

      {/* Editor surface */}
      <EditorContent editor={editor} />

      {/* Footer: word / char count */}
      <div className="flex items-center justify-between border-t border-border bg-surface-raised px-4 py-2 text-xs text-ink-faint">
        <span>{words} words</span>
        <span>{chars} characters</span>
      </div>

      {/* Prose theming scoped to the editor */}
      <style jsx global>{`
        .rte-prose {
          color: #cbd5e1;
        }
        .rte-prose h1, .rte-prose h2, .rte-prose h3 {
          color: #e7ecf6;
          font-weight: 700;
        }
        .rte-prose p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #5d6c8c;
          pointer-events: none;
          height: 0;
        }
        .rte-prose a.rte-link {
          color: #fb7a3c;
          text-decoration: underline;
        }
        .rte-image, .rte-video {
          border-radius: 0.5rem;
          margin: 0.75rem 0;
        }
        .rte-prose code {
          background: #16223c;
          color: #fbbf24;
          padding: 0.15rem 0.35rem;
          border-radius: 0.3rem;
          font-size: 0.85em;
        }
        .rte-codeblock {
          background: #0e1830 !important;
          border: 1px solid #1f2c47;
          border-radius: 0.5rem;
          padding: 0.9rem 1rem;
          overflow-x: auto;
        }
        .rte-codeblock code {
          background: transparent;
          color: #cbd5e1;
          padding: 0;
        }
        .rte-prose blockquote {
          border-left: 3px solid #fb7a3c;
          padding-left: 1rem;
          color: #8d9bb8;
        }
        .rte-prose mark {
          border-radius: 0.2rem;
          padding: 0 0.1rem;
          color: #0b1322;
        }
      `}</style>
    </div>
  );
}