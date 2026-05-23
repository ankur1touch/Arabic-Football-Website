"use client";

import { Link } from "@/i18n/routing";
import type { Match } from "@/types/match";
import type { Locale } from "@/store/features/localeSlice";

export function TeamFixturesList({
  matches,
  label,
  locale,
}: {
  matches: Match[];
  label: string;
  locale: Locale;
}) {
  const isAr = locale === "ar";

  if (!matches.length) {
    return (
      <p className="py-8 text-center text-slate-400">
        {label}: {isAr ? "لا توجد بيانات" : "no data"}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {matches.map((m) => (
        <li key={m.id}>
          <Link
            href={`/matches/${m.fixtureId ?? m.id}`}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:border-kora-green/30"
          >
            <span className="w-24 text-xs text-slate-500">
              {m.kickoff?.slice(0, 10)}
            </span>
            <span className="flex-1 font-medium text-slate-200">
              {isAr ? m.homeTeamAr : m.homeTeam}
            </span>
            <span className="font-bold tabular-nums text-kora-green">
              {m.homeScore ?? "–"} – {m.awayScore ?? "–"}
            </span>
            <span className="flex-1 text-end font-medium text-slate-200">
              {isAr ? m.awayTeamAr : m.awayTeam}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
