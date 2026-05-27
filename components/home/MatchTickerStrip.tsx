"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { Badge } from "@/components/ui/Badge";
import { useAppSelector } from "@/store/hooks";
import type { Match } from "@/types/match";
import type { Locale } from "@/store/features/localeSlice";

export function MatchTickerStrip({
  locale,
  initialMatches = [],
}: {
  locale: Locale;
  initialMatches?: Match[];
}) {
  const t = useTranslations("match");
  const storeMatches = useAppSelector((s) => s.matches.matches);

  const matches = useMemo(() => {
    const list = storeMatches.length > 0 ? storeMatches : initialMatches;
    const live = list.filter((m) => m.status === "live");
    const rest = list.filter((m) => m.status !== "live").slice(0, 8);
    return [...live, ...rest].slice(0, 12);
  }, [storeMatches, initialMatches]);

  if (matches.length === 0) return null;

  return (
    <div className="border-b border-white/5 bg-kora-mid/80">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
        <Badge variant="live" className="shrink-0">
          {t("live")}
        </Badge>
        <div className="scrollbar-none flex flex-1 gap-3 overflow-x-auto">
          {matches.map((m) => {
            const home = locale === "ar" ? m.homeTeamAr : m.homeTeam;
            const away = locale === "ar" ? m.awayTeamAr : m.awayTeam;
            const score =
              m.status === "live" && m.homeScore !== undefined
                ? `${m.homeScore}-${m.awayScore}`
                : null;
            const inner = (
              <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-200 transition hover:border-kora-green/40">
                <TeamCrest name={home} logo={m.homeTeamLogo} size="sm" />
                <span className="max-w-[72px] truncate font-medium">{home}</span>
                <span className="font-display text-kora-gold">
                  {score ?? "vs"}
                </span>
                <span className="max-w-[72px] truncate font-medium">{away}</span>
                <TeamCrest name={away} logo={m.awayTeamLogo} size="sm" />
                {m.status === "live" && (
                  <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-kora-alert" />
                )}
              </div>
            );
            return m.fixtureId ? (
              <Link key={m.id} href={`/matches/${m.fixtureId}`}>
                {inner}
              </Link>
            ) : (
              <div key={m.id}>{inner}</div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
