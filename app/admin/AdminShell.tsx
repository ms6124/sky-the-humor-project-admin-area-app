"use client";

import { useState } from "react";
import AdminNav from "./AdminNav";

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`mx-auto grid w-full max-w-6xl items-start gap-10 px-6 py-10 ${
        isCollapsed ? "lg:grid-cols-[72px_1fr]" : "lg:grid-cols-[240px_1fr]"
      }`}
    >
      <aside
        className={`sticky top-24 self-start rounded-3xl border border-black/10 bg-white/85 p-4 shadow-md ${
          isCollapsed ? "px-3" : "px-4"
        }`}
      >
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#6b5f57]">
              Admin sections
            </p>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed((value) => !value)}
            className="rounded-full border border-black/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white"
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? "Expand navigation" : "Collapse navigation"}
          >
            {isCollapsed ? ">>" : "<<"}
          </button>
        </div>
        {!isCollapsed && (
          <p className="mt-2 text-lg font-semibold text-[#151515]">
            Navigation
          </p>
        )}
        <div className="mt-6">
          <AdminNav collapsed={isCollapsed} />
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
