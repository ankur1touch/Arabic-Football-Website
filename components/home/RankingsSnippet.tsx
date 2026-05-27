"use client";

import { useTranslations } from "next-intl";
import { List } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAppSelector } from "@/store/hooks";
import type { Locale } from "@/store/features/localeSlice";
import { Skeleton } from "@/components/ui/Skeleton";

import type { RankingEntry } from "@/types/ranking";
import type { Tournament } from "@/types/tournament";

export function RankingsSnippet({
  locale,
  initialMen = [],
  initialTournaments = [],
}: {
  locale: Locale;
  initialMen?: RankingEntry[];
  initialTournaments?: Tournament[];
}) {
  const t = useTranslations();
  const { men: storeMen, status: rankingsStatus } = useAppSelector((s) => s.rankings);
  const { tournaments: storeTournaments, status: tournamentsStatus } = useAppSelector(
    (s) => s.tournaments
  );
  const men = storeMen.length > 0 ? storeMen : initialMen;
  const tournaments =
    storeTournaments.length > 0 ? storeTournaments : initialTournaments;
  const wc =
    tournaments.find((t) => t.id === "wc2026") ??
    tournaments.find((t) => t.featured);
  const top5 = wc?.standings?.length
    ? wc.standings.slice(0, 5)
    : men.slice(0, 5).map((r) => ({
        rank: r.rank,
        team: r.team,
        teamAr: r.teamAr,
        gd: 0,
        points: r.points,
      }));

  const loading =
    (rankingsStatus === "loading" && men.length === 0) ||
    (tournamentsStatus === "loading" && tournaments.length === 0);

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="kora-card rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <List className="h-5 w-5 text-kora-teal" />
        <h3 className="font-semibold text-slate-100">
          {t("home.standings")} — {t("rankings.worldRankings")}
        </h3>
      </div>
      <p className="mb-3 text-sm text-slate-400">
        {locale === "ar" ? "كأس العالم 2026" : "FIFA World Cup 2026"}
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500 rtl:text-right">
            <th className="pb-2">#</th>
            <th className="pb-2">{locale === "ar" ? "فريق" : "Team"}</th>
            <th className="pb-2 text-center">{t("rankings.gd")}</th>
            <th className="pb-2 text-end">{t("rankings.points")}</th>
          </tr>
        </thead>
        <tbody>
          {top5.map((row) => (
            <tr key={row.rank} className="border-t border-white/5">
              <td className="py-2 text-slate-400">{row.rank}</td>
              <td className="py-2 font-medium text-slate-100">
                {"teamId" in row && row.teamId ? (
                  <Link
                    href={`/teams/${row.teamId}`}
                    className="hover:text-kora-green hover:underline"
                  >
                    {locale === "ar" ? row.teamAr : row.team}
                  </Link>
                ) : (
                  locale === "ar" ? row.teamAr : row.team
                )}
              </td>
              <td className="py-2 text-center text-kora-teal">
                {"gd" in row && typeof row.gd === "number" && row.gd !== 0
                  ? `${row.gd > 0 ? "+" : ""}${row.gd}`
                  : "gd" in row && row.gd === 0
                    ? "—"
                    : "—"}
              </td>
              <td className="py-2 text-end font-bold text-kora-green">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
