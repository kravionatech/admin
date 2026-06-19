"use client";

import { useRef, useState } from "react";
import { ImagePlus, X, Upload } from "lucide-react";

export default function BannerUpload({ value, onChange }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const readFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onChange?.(reader.result, file);
    reader.readAsDataURL(file);
    // TODO: swap for a real upload — POST to /api/upload, then onChange(hostedUrl, file)
  };

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-ink">Featured image</p>

      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-border">
          <img src={value} alt="Banner preview" className="h-44 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-surface-card px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-soft"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange?.(null, null)}
              className="rounded-md bg-surface-card px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-surface-soft"
            >
              <X size={14} className="inline -mt-0.5 mr-1" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            readFile(e.dataTransfer.files?.[0]);
          }}
          className={[
            "flex h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors",
            dragOver ? "border-accent bg-accent/5" : "border-border hover:border-border-soft hover:bg-surface-soft",
          ].join(" ")}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-accent">
            <ImagePlus size={18} />
          </div>
          <p className="text-sm text-ink-muted">
            <span className="text-accent font-medium">Click to upload</span> or drag & drop
          </p>
          <p className="text-xs text-ink-faint">Recommended 1200×630 · PNG or JPG</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => readFile(e.target.files?.[0])}
      />
    </div>
  );
}