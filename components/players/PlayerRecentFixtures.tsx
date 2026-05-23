"use client";

import { Link } from "@/i18n/routing";
import type { Match } from "@/types/match";
import type { Locale } from "@/store/features/localeSlice";

export function PlayerRecentFixtures({
  fixtures,
  locale,
}: {
  fixtures: Match[];
  locale: Locale;
}) {
  if (!fixtures.length) return null;
  const isAr = locale === "ar";

  return (
    <section className="kora-card rounded-2xl p-5">
      <h2 className="mb-3 text-xl font-semibold text-slate-100">
        {isAr ? "آخر المباريات" : "Recent Matches"}
      </h2>
      <ul className="space-y-2">
        {fixtures.slice(0, 5).map((m) => (
          <li key={m.id}>
            <Link
              href={`/matches/${m.fixtureId ?? m.id}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition hover:bg-white/5"
            >
              <span className="w-20 text-xs text-slate-500">
                {m.kickoff?.slice(0, 10)}
              </span>
              <span className="flex-1 text-slate-200">
                {isAr ? m.homeTeamAr : m.homeTeam} {m.homeScore ?? "–"} –{" "}
                {m.awayScore ?? "–"} {isAr ? m.awayTeamAr : m.awayTeam}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
