"use client";

import React, { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Hash,
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2"; // Make sure to run: npm install sweetalert2

/* ----------------------------------------------------------------------
 * KRAVIONA — Admin · Categories (Table Only / Static)
 * Stack: React + Tailwind (core utilities only) + lucide-react
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
  teal: "#14B8A6",
  danger: "#E0393E",
  dangerSoft: "#FDEAEA",
};

const FONT = {
  display: "'Space Grotesk', sans-serif",
  body: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

/* ------------------------------ Components --------------------------------- */

function StatusPill({ status }) {
  const s = status?.toLowerCase() || "";
  
  // Default to neutral/archived styling
  let bg = "#F1F5F9"; // slate-100
  let fg = "#64748B"; // slate-500

  if (s === "published" || s === "public") {
    bg = C.successSoft;
    fg = C.success;
  } else if (s === "draft") {
    bg = "#FEF3C7"; // amber-50
    fg = "#D97706"; // amber-600
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize"
      style={{
        background: bg,
        color: fg,
        fontFamily: FONT.mono,
      }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: fg }} />
      {status}
    </span>
  );
}

/* --------------------------- Page content ----------------------------- */

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      // Helper function to read cookies on the client side
      const getCookie = (name) => {
        if (typeof document === "undefined") return "";
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return "";
      };

      const token = getCookie("accessToken");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/all`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}` // Changed from "Auth" to standard "Authorization"
        }
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setCategories(json.data || []);
      } else {
        throw new Error(json.message || "Failed to fetch categories");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error Loading Data",
        text: error.message || "Something went wrong while fetching categories.",
        confirmButtonColor: C.primary
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      {/* Table Only */}
      <div className="rounded-xl shadow-sm" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ color: C.inkFaint }}>
                {["Category", "Slug", "Posts", "Status", "Created", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-medium" style={{ fontFamily: FONT.mono, letterSpacing: "0.04em" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr style={{ borderTop: `1px solid ${C.border}` }}>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm" style={{ color: C.inkFaint }}>
                    <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr style={{ borderTop: `1px solid ${C.border}` }}>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm" style={{ color: C.inkFaint }}>
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((c) => (
                  <tr key={c._id || c.id} className="transition-colors hover:bg-slate-50/50" style={{ borderTop: `1px solid ${C.border}` }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ background: c.color || C.primary }} />
                        <div>
                          <div className="font-medium text-slate-900">{c.name}</div>
                          <div className="max-w-xs truncate text-xs" style={{ color: C.inkFaint }}>{c.description || "No description"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1 text-xs" style={{ color: C.inkSoft, fontFamily: FONT.mono }}>
                        <Hash size={11} />{c.slug}
                      </span>
                    </td>
                    <td className="px-5 py-3" style={{ color: C.inkSoft, fontFamily: FONT.mono }}>{c.postCount || c.posts || 0}</td>
                    <td className="px-5 py-3"><StatusPill status={c.status} /></td>
                    <td className="px-5 py-3 text-xs" style={{ color: C.inkFaint, fontFamily: FONT.mono }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : c.created}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="rounded-md p-1.5 transition-colors hover:bg-slate-100 cursor-default" style={{ color: C.inkSoft }}>
                          <Pencil size={15} />
                        </button>
                        <button className="rounded-md p-1.5 transition-colors hover:bg-red-50 cursor-default" style={{ color: C.danger }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}