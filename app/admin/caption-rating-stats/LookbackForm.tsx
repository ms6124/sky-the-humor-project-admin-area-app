"use client";

import { useState } from "react";

type LookbackFormProps = {
  initialDays: number;
  minDays: number;
  maxDays: number;
};

export default function LookbackForm({
  initialDays,
  minDays,
  maxDays,
}: LookbackFormProps) {
  const [days, setDays] = useState(initialDays);

  return (
    <form
      method="get"
      className="flex flex-wrap items-center gap-4 rounded-3xl border border-black/10 bg-white/85 p-5 shadow-md"
    >
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <label className="text-xs uppercase tracking-[0.3em] text-[#6b5f57]">
          Lookback window
        </label>
        <input
          type="range"
          name="window"
          min={minDays}
          max={maxDays}
          step={1}
          value={days}
          onChange={(event) => setDays(Number(event.target.value))}
          className="flex-1 accent-[#151515]"
        />
        <span className="text-sm font-semibold text-[#151515]">{days} days</span>
      </div>
      <button
        type="submit"
        className="rounded-full border border-black/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#151515] transition hover:border-black/30 hover:bg-white/70"
      >
        Update
      </button>
    </form>
  );
}
