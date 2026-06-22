"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Pencil,
  Trash2,
  Eye,
  X,
  FileText,
  CheckCircle2,
  Clock,
  Archive,
  Filter,
} from "lucide-react";
import Link from "next/link";

// ─── Mock Data ───────────────────────────────────────────────
const MOCK_POSTS = [
  {
    id: 1,
    title: "Why MERN Stack Is Still the Best Choice for Startups in 2026",
    slug: "mern-stack-best-choice-startups-2026",
    category: "Web Development",
    author: "Amar Singh",
    status: "published",
    views: 1842,
    publishedAt: "2026-05-12",
  },
  {
    id: 2,
    title: "A Complete Guide to Core Web Vitals Optimization",
    slug: "core-web-vitals-optimization-guide",
    category: "Technical SEO",
    author: "Priya Sharma",
    status: "published",
    views: 3021,
    publishedAt: "2026-04-28",
  },
  {
    id: 3,
    title: "Building Your First AI Agent with LangChain",
    slug: "building-first-ai-agent-langchain",
    category: "AI & Automation",
    author: "Amar Singh",
    status: "draft",
    views: 0,
    publishedAt: null,
  },
  {
    id: 4,
    title: "React vs Next.js: Which One Should You Pick in 2026?",
    slug: "react-vs-nextjs-2026",
    category: "Web Development",
    author: "Rahul Verma",
    status: "published",
    views: 2156,
    publishedAt: "2026-03-15",
  },
  {
    id: 5,
    title: "Dubai Business Website: Complete Development Roadmap",
    slug: "dubai-business-website-roadmap",
    category: "Web Development",
    author: "Priya Sharma",
    status: "draft",
    views: 0,
    publishedAt: null,
  },
  {
    id: 6,
    title: "How to Integrate ChatGPT Into Your Business Website",
    slug: "integrate-chatgpt-business-website",
    category: "AI & Automation",
    author: "Amar Singh",
    status: "published",
    views: 4502,
    publishedAt: "2026-02-09",
  },
  {
    id: 7,
    title: "Schema Markup: The Complete SEO Guide for 2026",
    slug: "schema-markup-complete-guide-2026",
    category: "Technical SEO",
    author: "Rahul Verma",
    status: "archived",
    views: 987,
    publishedAt: "2025-11-20",
  },
  {
    id: 8,
    title: "Node.js Performance Optimization: 10 Pro Tips",
    slug: "nodejs-performance-optimization-tips",
    category: "Web Development",
    author: "Priya Sharma",
    status: "published",
    views: 1654,
    publishedAt: "2026-01-30",
  },
];

// ─── Design tokens ───────────────────────────────────────────
const BRAND = "#235056";
const BRAND_DARK = "#1a3d42";
const ACCENT = "#d26c51";

const STATUS_META = {
  published: { label: "Published", icon: CheckCircle2, classes: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  draft: { label: "Draft", icon: Clock, classes: "bg-amber-50 text-amber-700 ring-amber-200" },
  archived: { label: "Archived", icon: Archive, classes: "bg-slate-100 text-slate-500 ring-slate-200" },
};

const CATEGORY_META = {
  "Web Development": { dot: "bg-sky-500", text: "text-sky-700", bg: "bg-sky-50" },
  "Technical SEO": { dot: "bg-violet-500", text: "text-violet-700", bg: "bg-violet-50" },
  "AI & Automation": { dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
};

const CATEGORIES = ["Web Development", "Technical SEO", "AI & Automation"];

// ─── Status Badge ────────────────────────────────────────────
function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? STATUS_META.draft;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${meta.classes}`}>
      <Icon className="h-3 w-3" strokeWidth={2.5} />
      {meta.label}
    </span>
  );
}

// ─── Category Tag ────────────────────────────────────────────
function CategoryTag({ category }) {
  const meta = CATEGORY_META[category] ?? CATEGORY_META["Web Development"];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium ${meta.bg} ${meta.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {category}
    </span>
  );
}

// ─── Metric Card ─────────────────────────────────────────────
function MetricCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white px-4 py-3 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${accent.bg}`}>
        <Icon className={`h-4 w-4 ${accent.text}`} strokeWidth={2.2} />
      </div>
      <div>
        <p className="text-lg font-bold leading-none text-slate-900 tabular-nums">{value}</p>
        <p className="mt-1 text-[11px] font-medium text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// ─── Sortable Header Cell ────────────────────────────────────
function SortHeader({ label, field, sortField, sortDir, onSort, align = "left" }) {
  const isActive = sortField === field;
  return (
    <th scope="col" className={`px-4 py-3 text-${align} text-[11px] font-bold uppercase tracking-wider text-slate-400`}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`group inline-flex items-center gap-1 transition-colors hover:text-[#235056] ${isActive ? "text-[#235056]" : ""}`}
      >
        {label}
        {isActive ? (
          sortDir === "asc" ? (
            <ChevronUp className="h-3 w-3" strokeWidth={2.5} />
          ) : (
            <ChevronDown className="h-3 w-3" strokeWidth={2.5} />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 text-slate-300 group-hover:text-slate-400" />
        )}
      </button>
    </th>
  );
}

// ─── Add Post Drawer ─────────────────────────────────────────
function PostDrawer({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [status, setStatus] = useState("draft");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title, category, status });
    setTitle("");
    setCategory(CATEGORIES[0]);
    setStatus("draft");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
      <div className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">New post</h2>
            <p className="text-sm text-slate-400">Create a draft or publish right away</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Title</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to scale a Node.js API"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-shadow focus:border-[#235056] focus:outline-none focus:ring-2 focus:ring-[#235056]/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Category</label>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIES.map((c) => {
                const meta = CATEGORY_META[c];
                const active = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      active ? "border-[#235056] bg-[#235056]/[0.04] text-slate-800" : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Status</label>
            <div className="flex gap-2">
              {["draft", "published"].map((s) => {
                const meta = STATUS_META[s];
                const active = status === s;
                const Icon = meta.icon;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active ? "border-[#235056] bg-[#235056]/[0.04] text-[#235056]" : "border-slate-200 text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors"
            style={{ backgroundColor: BRAND }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_DARK)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
          >
            Save post
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function BlogPage() {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("publishedAt");
  const [sortDir, setSortDir] = useState("desc");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    let rows = [...posts];
    if (statusFilter !== "all") rows = rows.filter((p) => p.status === statusFilter);

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      rows = rows.filter(
        (p) => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    rows.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === "publishedAt") {
        valA = valA ? new Date(valA).getTime() : 0;
        valB = valB ? new Date(valB).getTime() : 0;
      } else if (typeof valA === "string") {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return rows;
  }, [posts, query, statusFilter, sortField, sortDir]);

  const handleDelete = (id) => setPosts((prev) => prev.filter((p) => p.id !== id));

  const handleSave = (newPost) => {
    setPosts((prev) => [
      {
        id: Date.now(),
        title: newPost.title,
        slug: newPost.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        category: newPost.category,
        author: "Amar Singh",
        status: newPost.status,
        views: 0,
        publishedAt: newPost.status === "published" ? new Date().toISOString().slice(0, 10) : null,
      },
      ...prev,
    ]);
    setDrawerOpen(false);
  };

  const counts = useMemo(() => {
    const c = { all: posts.length, published: 0, draft: 0, archived: 0 };
    posts.forEach((p) => { c[p.status] = (c[p.status] ?? 0) + 1; });
    return c;
  }, [posts]);

  const totalViews = useMemo(() => posts.reduce((sum, p) => sum + p.views, 0), [posts]);

  return (
    <div className="min-h-screen w-full bg-slate-50/70 py-4 ">
      <div className="mx-auto max-w-[95%]">

        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="h-1 w-5 rounded-full" style={{ backgroundColor: ACCENT }} />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Blog engine</span>
            </div>
            <h1 className="text-2xl font-extrabold leading-tight text-slate-900">Blog posts</h1>
          </div>
          <Link href="/blog/new">
          <button
           
           className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
            style={{ backgroundColor: BRAND }}
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add post
          </button></Link>
        </div>

        {/* Metric cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard label="Total posts" value={counts.all} icon={FileText} accent={{ bg: "bg-slate-100", text: "text-slate-600" }} />
          <MetricCard label="Published" value={counts.published} icon={CheckCircle2} accent={{ bg: "bg-emerald-50", text: "text-emerald-600" }} />
          <MetricCard label="Drafts" value={counts.draft} icon={Clock} accent={{ bg: "bg-amber-50", text: "text-amber-600" }} />
          <MetricCard label="Total views" value={totalViews.toLocaleString()} icon={Eye} accent={{ bg: "bg-sky-50", text: "text-sky-600" }} />
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, category"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition-shadow focus:border-[#235056] focus:outline-none focus:ring-2 focus:ring-[#235056]/15"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1">
            {[
              { key: "all", label: "All" },
              { key: "published", label: "Published" },
              { key: "draft", label: "Draft" },
              { key: "archived", label: "Archived" },
            ].map((f) => (
               <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={`shrink-0 rounded-md px-3 py-1 text-sm font-semibold transition-all ${
                  statusFilter === f.key ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f.label}
                <span className="ml-1.5 text-xs text-slate-400">{counts[f.key] ?? 0}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px]">
              <thead className="border-b border-slate-100">
                <tr>
                  <SortHeader label="Title" field="title" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Category" field="category" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Author" field="author" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <SortHeader label="Views" field="views" sortField={sortField} sortDir={sortDir} onSort={handleSort} align="right" />
                  <SortHeader label="Date" field="publishedAt" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                  <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((post) => (
                  <tr key={post.id} className="group transition-colors hover:bg-slate-50/70">
                    <td className="max-w-[280px] px-4 py-3">
                      <p className="truncate text-sm font-semibold text-slate-800">{post.title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">/{post.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <CategoryTag category={post.category} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-600">{post.author}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-semibold text-slate-700 tabular-nums">{post.views.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-500">
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : <span className="text-slate-300">—</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button title="View" className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button title="Edit" className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-[#235056]/10 hover:text-[#235056]">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => handleDelete(post.id)}
                          className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 rounded-full bg-slate-100 p-3">
                <Filter className="h-5 w-5 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No posts found</p>
              <p className="mt-1 text-sm text-slate-400">Try a different search term or filter.</p>
            </div>
          )}
        </div>
      </div>

      <PostDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSave={handleSave} />

      <style>{`
        @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-in { animation: slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}