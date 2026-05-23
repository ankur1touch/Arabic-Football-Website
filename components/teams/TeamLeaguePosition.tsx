"use client";

import type { StandingRow } from "@/types/tournament";
import type { Locale } from "@/store/features/localeSlice";

export function TeamLeaguePosition({
  standings,
  teamId,
  locale,
}: {
  standings: StandingRow[];
  teamId: number;
  locale: Locale;
}) {
  const row = standings.find((s) => s.teamId === teamId);
  if (!row) return null;
  const isAr = locale === "ar";

  return (
    <div className="kora-card flex items-center gap-6 rounded-2xl px-5 py-4 text-sm">
      <div className="text-center">
        <div className="text-2xl font-bold text-kora-green">{row.rank}</div>
        <div className="text-xs text-slate-500">{isAr ? "المركز" : "Rank"}</div>
      </div>
      <div className="flex flex-1 gap-6 text-center">
        {[
          { label: "P", val: row.played },
          { label: "W", val: row.won },
          { label: "D", val: row.drawn },
          { label: "L", val: row.lost },
          { label: "GD", val: row.gd },
          { label: "Pts", val: row.points },
        ].map((s) => (
          <div key={s.label}>
            <div className="font-semibold text-slate-100">{s.val}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
