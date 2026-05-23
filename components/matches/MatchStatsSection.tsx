"use client";

import type { FixtureStatRow } from "@/types/fixture-detail";
import type { Locale } from "@/store/features/localeSlice";

function parseNum(v: string | number | null): number {
  if (v === null) return 0;
  const n = parseFloat(String(v).replace("%", ""));
  return Number.isNaN(n) ? 0 : n;
}

function StatBar({
  label,
  home,
  away,
}: {
  label: string;
  home: string | number | null;
  away: string | number | null;
}) {
  const h = parseNum(home);
  const a = parseNum(away);
  const total = h + a || 1;
  const homePct = Math.round((h / total) * 100);
  const awayPct = 100 - homePct;

  return (
    <div className="mb-4">
      <div className="mb-1.5 flex justify-between text-xs font-semibold text-slate-200">
        <span>{home}</span>
        <span className="font-normal text-slate-500">{label}</span>
        <span>{away}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="bg-kora-green transition-all"
          style={{ width: `${homePct}%` }}
        />
        <div
          className="bg-kora-teal transition-all"
          style={{ width: `${awayPct}%` }}
        />
      </div>
    </div>
  );
}

export function MatchStatsSection({
  stats,
  homeTeam,
  awayTeam,
  locale,
}: {
  stats: FixtureStatRow[];
  homeTeam: string;
  awayTeam: string;
  locale: Locale;
}) {
  if (!stats.length) {
    return (
      <p className="py-8 text-center text-slate-400">
        {locale === "ar" ? "الإحصائيات غير متاحة" : "Statistics not available"}
      </p>
    );
  }

  return (
    <div className="kora-card rounded-2xl p-6">
      <div className="mb-6 flex justify-between text-sm font-medium text-slate-400">
        <span>{homeTeam}</span>
        <span>{awayTeam}</span>
      </div>
      {stats.map((row) => (
        <StatBar key={row.type} label={row.type} home={row.home} away={row.away} />
      ))}
    </div>
  );
}
