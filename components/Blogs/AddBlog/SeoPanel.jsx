"use client";

import { useState } from "react";
import { ChevronDown, X, Plus } from "lucide-react";

function Section({ title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-ink"
      >
        {title}
        <ChevronDown size={15} className={`text-ink-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="space-y-3 px-4 pb-4">{children}</div>}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink-faint">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-border bg-surface-soft px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent";

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-md border border-border bg-surface-soft px-3 py-2"
    >
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? "bg-accent" : "bg-border-soft"}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}

function TagInput({ values = [], onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const v = draft.trim();
    if (!v) return;
    if (!values.includes(v)) onChange([...values, v]);
    setDraft("");
  };

  return (
    <div className="rounded-md border border-border bg-surface-soft p-2">
      <div className="flex flex-wrap gap-1.5">
        {values.map((tag) => (
          <span key={tag} className="flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-1 text-xs text-accent">
            {tag}
            <button type="button" onClick={() => onChange(values.filter((t) => t !== tag))}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
          }}
          placeholder={placeholder}
          className="min-w-[100px] flex-1 bg-transparent py-1 text-sm text-ink placeholder:text-ink-faint focus:outline-none"
        />
      </div>
      {draft && (
        <button type="button" onClick={addTag} className="mt-1.5 flex items-center gap-1 text-[11px] text-accent">
          <Plus size={12} /> Add "{draft}"
        </button>
      )}
    </div>
  );
}

export default function SeoPanel({ data, onChange }) {
  const set = (key) => (e) => onChange({ ...data, [key]: e.target?.value ?? e });

  return (
    <div className="rounded-xl border border-border bg-surface-card">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-ink">SEO &amp; metadata</h3>
        <p className="text-xs text-ink-faint mt-0.5">Controls how this post appears in search &amp; shares</p>
      </div>

      <Section title="Search appearance">
        <Field label="Meta title">
          <input className={inputClass} value={data.metaTitle || ""} onChange={set("metaTitle")} placeholder="SEO title (50–60 chars)" />
        </Field>
        <Field label="Meta description">
          <textarea rows={3} className={inputClass} value={data.metaDescription || ""} onChange={set("metaDescription")} placeholder="SEO description (150–160 chars)" />
        </Field>
        <Field label="Canonical URL">
          <input className={inputClass} value={data.canonicalUrl || ""} onChange={set("canonicalUrl")} placeholder="https://kraviona.com/blog/..." />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Toggle label="No index" checked={!!data.isNoIndex} onChange={(v) => onChange({ ...data, isNoIndex: v })} />
          <Toggle label="No follow" checked={!!data.isNoFollow} onChange={(v) => onChange({ ...data, isNoFollow: v })} />
        </div>
      </Section>

      <Section title="Keywords" defaultOpen={false}>
        <Field label="Keywords">
          <TagInput values={data.keywords || []} onChange={(v) => onChange({ ...data, keywords: v })} placeholder="Add keyword + Enter" />
        </Field>
        <Field label="Focus keywords">
          <TagInput values={data.focusKeywords || []} onChange={(v) => onChange({ ...data, focusKeywords: v })} placeholder="Add focus keyword + Enter" />
        </Field>
        <Field label="Semantic keywords">
          <TagInput values={data.semanticKeywords || []} onChange={(v) => onChange({ ...data, semanticKeywords: v })} placeholder="Add related term + Enter" />
        </Field>
      </Section>

      <Section title="Social sharing" defaultOpen={false}>
        <Field label="OG title (Facebook/LinkedIn)">
          <input className={inputClass} value={data.ogTitle || ""} onChange={set("ogTitle")} />
        </Field>
        <Field label="OG description">
          <textarea rows={2} className={inputClass} value={data.ogDescription || ""} onChange={set("ogDescription")} />
        </Field>
        <Field label="Twitter title">
          <input className={inputClass} value={data.twitterTitle || ""} onChange={set("twitterTitle")} />
        </Field>
        <Field label="Twitter description">
          <textarea rows={2} className={inputClass} value={data.twitterDescription || ""} onChange={set("twitterDescription")} />
        </Field>
      </Section>

      <Section title="Publishing" defaultOpen={false}>
        <Field label="Status">
          <select className={inputClass} value={data.status || "draft"} onChange={set("status")}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </Field>
        <Field label="Content source">
          <select className={inputClass} value={data.contentSourceType || "manual"} onChange={set("contentSourceType")}>
            <option value="manual">Manual</option>
            <option value="ai-assisted">AI-assisted</option>
            <option value="imported">Imported</option>
          </select>
        </Field>
        <Field label="Primary topic cluster">
          <input className={inputClass} value={data.primaryTopicCluster || ""} onChange={set("primaryTopicCluster")} placeholder="e.g. Web Development" />
        </Field>
        <Field label="Reading time (minutes)">
          <input type="number" min={1} className={inputClass} value={data.readingTimeMinutes || ""} onChange={set("readingTimeMinutes")} />
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Toggle label="Comments" checked={!!data.isCommentEnabled} onChange={(v) => onChange({ ...data, isCommentEnabled: v })} />
          <Toggle label="Free access" checked={!!data.isAccessibleForFree} onChange={(v) => onChange({ ...data, isAccessibleForFree: v })} />
        </div>
      </Section>
    </div>
  );
}