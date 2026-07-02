"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Globe,
  Mail,
  Inbox,
  Link2,
} from "lucide-react";

/* ── Dummy data ─────────────────────────────────────── */
const LEADS = [
  {
    id: 1,
    name: "Priya Sharma",
    email: "priya@techcorp.in",
    status: "Qualified",
    source: "LinkedIn",
    score: 88,
    value: "₹1,20,000",
    date: "24 Jun 2026",
    initials: "PS",
    color: "orange",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    email: "rahul@startupx.io",
    status: "New",
    source: "Website",
    score: 42,
    value: "₹45,000",
    date: "26 Jun 2026",
    initials: "RM",
    color: "blue",
  },
  {
    id: 3,
    name: "Ananya Singh",
    email: "ananya@bigco.com",
    status: "Proposal",
    source: "Referral",
    score: 74,
    value: "₹2,80,000",
    date: "20 Jun 2026",
    initials: "AS",
    color: "green",
  },
  {
    id: 4,
    name: "Vikram Nair",
    email: "v.nair@venturex.com",
    status: "Won",
    source: "Cold Email",
    score: 95,
    value: "₹5,00,000",
    date: "18 Jun 2026",
    initials: "VN",
    color: "purple",
  },
  {
    id: 5,
    name: "Deepa Iyer",
    email: "deepa@cloudbase.io",
    status: "Contacted",
    source: "LinkedIn",
    score: 58,
    value: "₹75,000",
    date: "25 Jun 2026",
    initials: "DI",
    color: "rose",
  },
  {
    id: 6,
    name: "Arjun Kapoor",
    email: "arjun@medfintech.in",
    status: "Lost",
    source: "Website",
    score: 30,
    value: "₹90,000",
    date: "15 Jun 2026",
    initials: "AK",
    color: "blue",
  },
  {
    id: 7,
    name: "Sneha Reddy",
    email: "sneha@retailnow.com",
    status: "New",
    source: "Inbound",
    score: 51,
    value: "₹60,000",
    date: "27 Jun 2026",
    initials: "SR",
    color: "green",
  },
  {
    id: 8,
    name: "Karan Bose",
    email: "karan@infratech.co",
    status: "Qualified",
    source: "Referral",
    score: 80,
    value: "₹3,50,000",
    date: "22 Jun 2026",
    initials: "KB",
    color: "orange",
  },
];

/* ── Config maps ─────────────────────────────────────── */
const STATUS_STYLES = {
  New: "bg-blue-50   text-blue-700   border border-blue-200",
  Contacted: "bg-amber-50  text-amber-700  border border-amber-200",
  Qualified: "bg-green-50  text-green-700  border border-green-200",
  Proposal: "bg-purple-50 text-purple-700 border border-purple-200",
  Won: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Lost: "bg-red-50    text-red-600    border border-red-200",
};

const AVATAR_STYLES = {
  orange: "bg-orange-100 text-orange-700",
  blue: "bg-blue-100   text-blue-700",
  green: "bg-green-100  text-green-700",
  purple: "bg-purple-100 text-purple-700",
  rose: "bg-rose-100   text-rose-700",
};

const LinkedInIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />
  </svg>
);

const SOURCE_ICONS = {
  LinkedIn: <LinkedInIcon />,
  Website: <Globe size={13} />,
  Referral: <Users size={13} />,
  "Cold Email": <Mail size={13} />,
  Inbound: <Inbox size={13} />,
};

const TABS = ["All", "New", "Qualified", "Proposal", "Won"];

/* ── Score bar ───────────────────────────────────────── */
const ScoreBar = ({ score }) => {
  const color =
    score >= 80 ? "bg-green-500" : score >= 55 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 min-w-[22px]">{score}</span>
    </div>
  );
};

/* ── Stat card ───────────────────────────────────────── */
const StatCard = ({ label, value, delta, deltaType }) => (
  <div className="bg-white rounded-xl border border-gray-200 px-4 py-3.5">
    <p className="text-xs text-gray-400 mb-1.5">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-semibold text-gray-900">{value}</span>
      {delta && (
        <span
          className={`flex items-center gap-0.5 text-xs font-medium ${deltaType === "up" ? "text-emerald-600" : "text-red-500"}`}
        >
          {deltaType === "up" ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          {delta}
        </span>
      )}
    </div>
  </div>
);

/* ── Main component ──────────────────────────────────── */
const MainLeadsPage = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const filtered = LEADS.filter((l) => {
    const matchTab = activeTab === "All" || l.status === activeTab;
    const q = search.toLowerCase();
    const matchQ =
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.source.toLowerCase().includes(q);
    return matchTab && matchQ;
  });

  return (
    <div className="min-h-full w-full bg-[#F8F9FB] p-8">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-1">
            CRM
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors">
            <Download size={16} />
          </button>
          <button className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors text-white px-4 py-2 text-sm font-semibold rounded-lg shadow-sm shadow-orange-100">
            <Plus size={15} strokeWidth={2.5} /> Add lead
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <StatCard label="Total leads" value="284" delta="12%" deltaType="up" />
        <StatCard label="New this week" value="38" delta="+6" deltaType="up" />
        <StatCard label="Qualified" value="91" delta="32%" />
        <StatCard label="Deals won" value="23" delta="+4" deltaType="up" />
        <StatCard label="Lost" value="17" delta="−2" deltaType="down" />
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] max-w-[260px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads…"
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-150 ${
                  activeTab === tab
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                {[
                  "Name",
                  "Status",
                  "Source",
                  "Score",
                  "Value",
                  "Date",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider"
                    style={{ textAlign: h === "Actions" ? "center" : "left" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? (
                filtered.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-orange-50/30 transition-colors duration-100 group"
                  >
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${AVATAR_STYLES[lead.color]}`}
                        >
                          {lead.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {lead.name}
                          </p>
                          <p className="text-xs text-gray-400">{lead.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-semibold ${STATUS_STYLES[lead.status] || STATUS_STYLES.New}`}
                      >
                        {lead.status}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs text-gray-600">
                        {SOURCE_ICONS[lead.source]}
                        {lead.source}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-5 py-3.5">
                      <ScoreBar score={lead.score} />
                    </td>

                    {/* Value */}
                    <td className="px-5 py-3.5 font-semibold text-sm text-gray-800">
                      {lead.value}
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 text-xs text-gray-400">
                      {lead.date}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-0.5">
                        <button
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                          title="View"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users size={18} className="text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-400 font-medium">
                        {search
                          ? `No leads matching "${search}"`
                          : "No leads found"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Showing {filtered.length} of {LEADS.length} leads
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  className={`w-7 h-7 text-xs rounded-md border transition-colors ${
                    n === 1
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainLeadsPage;
