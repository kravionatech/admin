"use client";

import { useEffect, useRef, useState } from "react";

export default function TextEditor({ content, setContent }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [error, setError] = useState(null);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    // Quill accesses `document` on import — must be loaded client-side only.
    // Dynamic import inside useEffect guarantees this never runs on the server.
    let quillInstance = null;

    const init = async () => {
      if (!editorRef.current || quillRef.current) return;

      try {
        const [{ default: Quill }] = await Promise.all([
          import("quill"),
          import("quill/dist/quill.snow.css"),
        ]);

        quillInstance = new Quill(editorRef.current, {
          theme: "snow",
          placeholder: "Write your blog here...",
          modules: {
            toolbar: [
              [{ font: [] }],
              [{ size: ["small", false, "large", "huge"] }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ color: [] }, { background: [] }],
              [{ script: "sub" }, { script: "super" }],
              [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ align: [] }],
              ["blockquote", "code-block"],
              ["link", "image", "video"],
              ["formula"],
              ["clean"],
            ],
            history: {
              delay: 1000,
              maxStack: 100,
              userOnly: true,
            },
          },
        });

        quillRef.current = quillInstance;

        // Set initial content if provided
        if (content) {
          quillInstance.root.innerHTML = content;
          setCharCount(quillInstance.getText().trim().length);
        }

        // Sync content to parent on every change
        quillInstance.on("text-change", () => {
          try {
            const html = quillInstance.root.innerHTML;
            const text = quillInstance.getText();
            const isEmpty =
              quillInstance.getLength() === 1 && text.trim() === "";
            setContent(isEmpty ? "" : html);
            setCharCount(isEmpty ? 0 : text.trim().length);
            setError(null);
          } catch (err) {
            setError("Failed to sync editor content. Please try again.");
            console.error("[TextEditor] text-change error:", err);
          }
        });
      } catch (err) {
        setError("Failed to initialize the editor. Please refresh the page.");
        console.error("[TextEditor] init error:", err);
      }
    };

    init();

    return () => {
      quillRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-6xl mx-auto mt-10 w-full">
      {error && (
        <div className="mb-3 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="mt-0.5">⚠️</span>
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
        <div
          ref={editorRef}
          className="shadow-2xl border"
          style={{ height: "500px" }}
        />
      </div>

      <div className="mt-2 text-right text-xs text-gray-400">
        {charCount} character{charCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
}
