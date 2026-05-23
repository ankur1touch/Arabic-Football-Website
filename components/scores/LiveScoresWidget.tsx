"use client";

import { useTranslations } from "next-intl";
import { Calendar } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useAppSelector } from "@/store/hooks";
import type { Locale } from "@/store/features/localeSlice";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { filterNextUpcoming, formatKickoffLabel } from "@/lib/match-dates";

export function UpcomingMatchesWidget({ locale }: { locale: Locale }) {
  const t = useTranslations("match");
  const { matches, status } = useAppSelector((s) => s.matches);
  const upcoming = filterNextUpcoming(matches, 3);

  if (status === "loading") {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <div className="kora-card rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-kora-teal" />
        <h3 className="font-semibold text-slate-100">
          {t("upcoming")} — {t("upcomingMatches")}
        </h3>
      </div>
      <ul className="space-y-3">
        {upcoming.length === 0 && (
          <li className="text-sm text-slate-400">
            {locale === "ar" ? "لا توجد مباريات" : "No upcoming matches"}
          </li>
        )}
        {upcoming.map((m) => {
          const inner = (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">
                  {locale === "ar" ? m.homeTeamAr : m.homeTeam}{" "}
                  {m.status === "live" && m.homeScore !== undefined
                    ? `${m.homeScore}-${m.awayScore}`
                    : "vs"}{" "}
                  {locale === "ar" ? m.awayTeamAr : m.awayTeam}
                </span>
                {m.status === "live" ? (
                  <Badge variant="live">
                    {t("live")} {m.minute}&apos;
                  </Badge>
                ) : (
                  <span className="text-xs text-slate-400">
                    {formatKickoffLabel(m.kickoff, locale)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {locale === "ar" ? m.leagueAr : m.league}
              </p>
            </>
          );

          return (
            <li key={m.id}>
              {m.fixtureId ? (
                <Link
                  href={`/matches/${m.fixtureId}`}
                  className="block rounded-xl border border-white/5 bg-black/30 px-4 py-3 text-sm text-slate-100 transition hover:border-kora-green/30 hover:bg-black/40"
                >
                  {inner}
                </Link>
              ) : (
                <div className="rounded-xl border border-white/5 bg-black/30 px-4 py-3 text-sm text-slate-100">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
