"use client"
import React, { useState } from "react";
import {
  Newspaper,
  Mail,
  Sparkles,
  Globe,
  UserPlus,
  TrendingUp,
  TrendingDown,
  Plus,
  ExternalLink,
  Eye,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Frame from "@/components/Frame/Frame";

/* ----------------------------------------------------------------------
 * KRAVIONA — Admin Dashboard
 * Stack: React + Tailwind (core utilities only) + lucide-react + Recharts
 * Drop-in note for Next.js: save as components/admin/Dashboard.jsx,
 * add "use client" at the very top of the file, then render it from
 * app/admin/page.jsx. Swap the mock arrays below for real data fetched
 * in a Server Component / API route and passed down as props.
 * ------------------------------------------------------------------- */

const C = {
  bg: "#F4F5F7",
  surface: "#FFFFFF",
  ink: "#11151C",
  inkSoft: "#5B6472",
  inkFaint: "#8A93A1",
  border: "#E5E7EB",
  primary: "#2E5BFF",
  primarySoft: "#EAF0FF",
  accent: "#FF6B4A",
  accentSoft: "#FFE9E1",
  violet: "#8B5CF6",
  violetSoft: "#F1ECFE",
  success: "#15A95C",
  successSoft: "#E7F8EE",
  sidebar: "#11151D",
  sidebarBorder: "#1E2430",
  sidebarText: "#8E97A6",
  sidebarTextActive: "#FFFFFF",
};

const FONT = {
  display: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

/* ---------------------------- Mock data --------------------------- */

const STATS = [
  { label: "Total Visitors", value: "48.2K", delta: "+12.4%", up: true, icon: Globe, accent: C.primary, accentSoft: C.primarySoft },
  { label: "New Leads", value: "186", delta: "+8.1%", up: true, icon: Mail, accent: C.violet, accentSoft: C.violetSoft },
  { label: "Published Posts", value: "42", delta: "+3 this mo.", up: true, icon: Newspaper, accent: C.success, accentSoft: C.successSoft },
  { label: "New Signups", value: "73", delta: "+15.6%", up: true, icon: UserPlus, accent: C.accent, accentSoft: C.accentSoft },
];

const TRAFFIC = {
  "7D": [
    { label: "Mon", visitors: 980, leads: 22 },
    { label: "Tue", visitors: 1240, leads: 28 },
    { label: "Wed", visitors: 1080, leads: 19 },
    { label: "Thu", visitors: 1460, leads: 31 },
    { label: "Fri", visitors: 1320, leads: 26 },
    { label: "Sat", visitors: 760, leads: 14 },
    { label: "Sun", visitors: 690, leads: 12 },
  ],
  "30D": [
    { label: "W1", visitors: 6200, leads: 96 },
    { label: "W2", visitors: 7100, leads: 112 },
    { label: "W3", visitors: 6800, leads: 104 },
    { label: "W4", visitors: 8400, leads: 138 },
  ],
  "90D": [
    { label: "Apr", visitors: 24800, leads: 360 },
    { label: "May", visitors: 27600, leads: 402 },
    { label: "Jun", visitors: 31200, leads: 458 },
  ],
};

const LEAD_SOURCES = [
  { name: "Organic Search", value: 38, color: C.primary },
  { name: "Blog", value: 24, color: C.violet },
  { name: "Referral", value: 18, color: C.success },
  { name: "Direct", value: 12, color: C.accent },
  { name: "Social", value: 8, color: C.inkFaint },
];

const LEADS = [
  { name: "Rohan Mehta", email: "rohan.mehta@nimbus.co", service: "Web Development", status: "New", date: "Jun 16" },
  { name: "Sara Ali", email: "sara.ali@brightleaf.io", service: "AI Integration", status: "Contacted", date: "Jun 15" },
  { name: "David Kim", email: "david.kim@forgeworks.com", service: "SEO Audit", status: "Converted", date: "Jun 14" },
  { name: "Priya Nair", email: "priya.nair@studiolume.in", service: "UI/UX Redesign", status: "New", date: "Jun 14" },
  { name: "Marcus Webb", email: "marcus.webb@nordhaus.co", service: "Next.js Migration", status: "Closed", date: "Jun 12" },
];

const POSTS = [
  { title: "10 Benefits of Artificial Intelligence", category: "AI", status: "Published", views: "2.4K", date: "Apr 12" },
  { title: "What's New in Next.js 15", category: "Next.js", status: "Published", views: "1.8K", date: "Jun 02" },
  { title: "Tailwind CSS v4: A Practical Guide", category: "Tailwind", status: "Published", views: "1.2K", date: "May 22" },
  { title: "Web 3.0 Explained for Businesses", category: "Web3", status: "Draft", views: "—", date: "Jun 10" },
];

/* --------------------------- Small bits ---------------------------- */

const STATUS_STYLES = {
  New: { bg: C.primarySoft, fg: C.primary },
  Contacted: { bg: C.violetSoft, fg: C.violet },
  Converted: { bg: C.successSoft, fg: C.success },
  Closed: { bg: "#F0F1F3", fg: C.inkFaint },
  Published: { bg: C.successSoft, fg: C.success },
  Draft: { bg: C.accentSoft, fg: C.accent },
};

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || { bg: "#F0F1F3", fg: C.inkFaint };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: s.bg, color: s.fg, fontFamily: FONT.mono, letterSpacing: "0.01em" }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.fg }} />
      {status}
    </span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-sm"
      style={{ background: C.surface, borderColor: C.border, fontFamily: FONT.mono }}
    >
      <div className="mb-1 font-medium" style={{ color: C.ink }}>{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5" style={{ color: C.inkSoft }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
          {p.dataKey === "visitors" ? "Visitors" : "Leads"}: {p.value}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ App --------------------------------- */

export default function KravionaAdminDashboard() {
  const [range, setRange] = useState("7D");
  const data = TRAFFIC[range];
  const totalLeadSources = LEAD_SOURCES.reduce((a, b) => a + b.value, 0);

  return (
    <Frame>
      <div
        className="min-h-screen w-full"
        style={{ background: C.bg, fontFamily: FONT.body, color: C.ink }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        `}</style>

        <div className="flex">
          {/* ---------------- Main content ---------------- */}
          <div className="flex-1 min-w-0">
            {/* Page content */}
            <main className="px-4 py-6 sm:px-6 lg:px-8">
              {/* Page header */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="mb-1 text-[11px]" style={{ color: C.inkFaint, fontFamily: FONT.mono, letterSpacing: "0.06em" }}>
                    ADMIN / DASHBOARD
                  </div>
                  <h1 className="text-2xl font-semibold" style={{ fontFamily: FONT.display }}>
                    Good evening, Aarav
                  </h1>
                  <p className="mt-1 text-sm" style={{ color: C.inkSoft }}>
                    Here's what's happening across kraviona.com today.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm"
                    style={{ border: `1px solid ${C.border}`, color: C.inkSoft }}
                  >
                    <ExternalLink size={15} />
                    View site
                  </button>
                  <button
                    className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-white"
                    style={{ background: C.primary }}
                  >
                    <Plus size={16} />
                    New post
                  </button>
                </div>
              </div>

              {/* Stat cards */}
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {STATS.map((s) => {
                  const Icon = s.icon;
                  const Trend = s.up ? TrendingUp : TrendingDown;
                  return (
                    <div
                      key={s.label}
                      className="rounded-xl p-4"
                      style={{ background: C.surface, border: `1px solid ${C.border}` }}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-lg"
                          style={{ background: s.accentSoft }}
                        >
                          <Icon size={17} style={{ color: s.accent }} />
                        </div>
                        <div
                          className="flex items-center gap-1 text-xs font-medium"
                          style={{ color: s.up ? C.success : C.accent, fontFamily: FONT.mono }}
                        >
                          <Trend size={13} />
                          {s.delta}
                        </div>
                      </div>
                      <div className="text-2xl font-semibold" style={{ fontFamily: FONT.display }}>
                        {s.value}
                      </div>
                      <div className="mt-0.5 text-xs" style={{ color: C.inkSoft }}>
                        {s.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Charts row */}
              <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Traffic chart */}
                <div
                  className="rounded-xl p-5 lg:col-span-2"
                  style={{ background: C.surface, border: `1px solid ${C.border}` }}
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Visitor & lead trends</div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs" style={{ color: C.inkSoft }}>
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.primary }} /> Visitors
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.accent }} /> Leads
                        </span>
                      </div>
                    </div>
                    <div className="flex rounded-lg p-0.5" style={{ background: C.bg }}>
                      {["7D", "30D", "90D"].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRange(r)}
                          className="rounded-md px-2.5 py-1 text-xs font-medium"
                          style={{
                            fontFamily: FONT.mono,
                            background: range === r ? C.surface : "transparent",
                            color: range === r ? C.ink : C.inkFaint,
                            boxShadow: range === r ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                          }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ width: "100%", height: 240 }}>
                    <ResponsiveContainer>
                      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={C.primary} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={C.primary} stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={C.accent} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke={C.border} />
                        <XAxis dataKey="label" tick={{ fontSize: 11, fill: C.inkFaint, fontFamily: FONT.mono }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: C.inkFaint, fontFamily: FONT.mono }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="visitors" stroke={C.primary} strokeWidth={2} fill="url(#visitorsFill)" />
                        <Area type="monotone" dataKey="leads" stroke={C.accent} strokeWidth={2} fill="url(#leadsFill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Lead sources donut */}
                <div className="rounded-xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="mb-4 text-sm font-semibold">Lead sources</div>
                  <div className="relative" style={{ width: "100%", height: 170 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={LEAD_SOURCES}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={48}
                          outerRadius={70}
                          paddingAngle={2}
                          strokeWidth={0}
                        >
                          {LEAD_SOURCES.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-xl font-semibold" style={{ fontFamily: FONT.display }}>{totalLeadSources}%</div>
                      <div className="text-[10px]" style={{ color: C.inkFaint, fontFamily: FONT.mono }}>tracked</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    {LEAD_SOURCES.map((s) => (
                      <div key={s.name} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2" style={{ color: C.inkSoft }}>
                          <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                          {s.name}
                        </span>
                        <span style={{ fontFamily: FONT.mono, color: C.ink }}>{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tables row */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Recent leads */}
                <div className="rounded-xl lg:col-span-2" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <div className="text-sm font-semibold">Recent inquiries</div>
                    <button className="flex items-center gap-1 text-xs font-medium" style={{ color: C.primary }}>
                      View all <ArrowUpRight size={13} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ color: C.inkFaint }}>
                          {["Name", "Service", "Status", "Date", ""].map((h) => (
                            <th key={h} className="px-5 py-2 text-left text-[11px] font-medium" style={{ fontFamily: FONT.mono, letterSpacing: "0.04em" }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {LEADS.map((l) => (
                          <tr key={l.email} style={{ borderTop: `1px solid ${C.border}` }}>
                            <td className="px-5 py-3">
                              <div className="font-medium">{l.name}</div>
                              <div className="text-xs" style={{ color: C.inkFaint }}>{l.email}</div>
                            </td>
                            <td className="px-5 py-3" style={{ color: C.inkSoft }}>{l.service}</td>
                            <td className="px-5 py-3"><StatusPill status={l.status} /></td>
                            <td className="px-5 py-3 text-xs" style={{ color: C.inkFaint, fontFamily: FONT.mono }}>{l.date}</td>
                            <td className="px-5 py-3 text-right">
                              <MoreHorizontal size={16} style={{ color: C.inkFaint }} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent posts */}
                <div className="rounded-xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${C.border}` }}>
                    <div className="text-sm font-semibold">Recent blog posts</div>
                    <button className="flex items-center gap-1 text-xs font-medium" style={{ color: C.primary }}>
                      View all <ArrowUpRight size={13} />
                    </button>
                  </div>
                  <div>
                    {POSTS.map((p, i) => (
                      <div
                        key={p.title}
                        className="flex items-start justify-between gap-3 px-5 py-3"
                        style={{ borderTop: i === 0 ? "none" : `1px solid ${C.border}` }}
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{p.title}</div>
                          <div className="mt-1 flex items-center gap-2 text-xs" style={{ color: C.inkFaint }}>
                            <span style={{ fontFamily: FONT.mono }}>{p.category}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Eye size={12} /> {p.views}
                            </span>
                          </div>
                        </div>
                        <StatusPill status={p.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: "New blog post", icon: Newspaper },
                  { label: "Add service", icon: Sparkles },
                  { label: "Invite team member", icon: UserPlus },
                  { label: "View live site", icon: Globe },
                ].map((a) => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.label}
                      className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-left text-sm font-medium"
                      style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.ink }}
                    >
                      <Icon size={16} style={{ color: C.primary }} />
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </main>
          </div>
        </div>
      </div>
    </Frame>
  );
}