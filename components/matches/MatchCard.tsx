"use client";

import { Link } from "@/i18n/routing";
import type { Match } from "@/types/match";
import type { Locale } from "@/store/features/localeSlice";
import { TeamBadge } from "@/components/ui/TeamBadge";
import { Badge } from "@/components/ui/Badge";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

function matchHref(match: Match): string | undefined {
  if (match.fixtureId) return `/matches/${match.fixtureId}`;
  if (/^m\d+$/.test(match.id)) return `/matches/${match.id}`;
  return undefined;
}

export function MatchCard({
  match,
  locale,
  className,
}: {
  match: Match;
  locale: Locale;
  className?: string;
}) {
  const t = useTranslations("match");
  const href = matchHref(match);
  const homeName = locale === "ar" ? match.homeTeamAr : match.homeTeam;
  const awayName = locale === "ar" ? match.awayTeamAr : match.awayTeam;

  const content = (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {match.round && <span className="text-kora-teal">{match.round} · </span>}
          {locale === "ar" ? match.leagueAr : match.league}
        </p>
        {match.status === "live" && (
          <Badge variant="live">
            <span className="h-2 w-2 rounded-full bg-kora-alert animate-pulse-live" />
            {t("live")} {match.minute}&apos;
          </Badge>
        )}
        {match.status === "upcoming" && (
          <span className="text-xs text-slate-400">{match.kickoffKsa} KSA</span>
        )}
        {match.status === "finished" && (
          <span className="text-xs text-slate-500">{t("results")}</span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <TeamBadge name={homeName} logo={match.homeTeamLogo} size="sm" />
          <span className="truncate font-semibold text-slate-100">{homeName}</span>
        </div>

        <div className="shrink-0 px-2 text-center">
          {match.homeScore !== undefined ? (
            <span className="text-lg font-bold text-kora-green">
              {match.homeScore} - {match.awayScore}
            </span>
          ) : (
            <span className="text-sm text-slate-500">vs</span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span className="truncate text-end font-semibold text-slate-100">{awayName}</span>
          <TeamBadge name={awayName} logo={match.awayTeamLogo} size="sm" />
        </div>
      </div>

      {match.venue && (
        <p className="mt-2 text-xs text-slate-600">{match.venue}</p>
      )}
    </>
  );

  const baseClass = cn(
    "block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition",
    href && "hover:border-kora-green/40 hover:bg-white/[0.07]",
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {content}
      </Link>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
