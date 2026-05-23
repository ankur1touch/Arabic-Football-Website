"use client";

import { Link } from "@/i18n/routing";
import { TeamBadge } from "@/components/ui/TeamBadge";
import type { Match } from "@/types/match";
import type { Locale } from "@/store/features/localeSlice";

export function MatchH2H({
  matches,
  locale,
}: {
  matches: Match[];
  locale: Locale;
}) {
  if (!matches.length) {
    return (
      <p className="py-8 text-center text-slate-400">
        {locale === "ar" ? "لا يوجد سجل مواجهات" : "No head-to-head history"}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      <p className="mb-3 text-xs text-slate-500">
        {locale === "ar"
          ? `آخر ${matches.length} مواجهات`
          : `Last ${matches.length} meetings`}
      </p>
      {matches.map((m) => {
        const href = m.fixtureId
          ? `/matches/${m.fixtureId}`
          : /^m\d+$/.test(m.id)
            ? `/matches/${m.id}`
            : null;
        if (!href) return null;

        return (
        <li key={m.id}>
          <Link
            href={href}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:border-kora-green/30"
          >
            <TeamBadge
              name={locale === "ar" ? m.homeTeamAr : m.homeTeam}
              logo={m.homeTeamLogo}
              size="sm"
            />
            <span className="w-20 text-xs text-slate-500">
              {m.kickoff?.slice(0, 10)}
            </span>
            <span className="flex-1 text-end font-medium text-slate-200">
              {locale === "ar" ? m.homeTeamAr : m.homeTeam}
            </span>
            <span className="mx-2 font-bold text-kora-green">
              {m.homeScore ?? "–"} – {m.awayScore ?? "–"}
            </span>
            <span className="flex-1 font-medium text-slate-200">
              {locale === "ar" ? m.awayTeamAr : m.awayTeam}
            </span>
            <TeamBadge
              name={locale === "ar" ? m.awayTeamAr : m.awayTeam}
              logo={m.awayTeamLogo}
              size="sm"
            />
          </Link>
        </li>
        );
      })}
    </ul>
  );
}
