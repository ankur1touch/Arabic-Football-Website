"use client";

import { Link } from "@/i18n/routing";
import { TeamBadge } from "@/components/ui/TeamBadge";
import { Badge } from "@/components/ui/Badge";
import type { FixtureDetail } from "@/types/fixture-detail";
import type { Locale } from "@/store/features/localeSlice";
import { formatMatchStatusLabel } from "@/lib/match-dates";

export function MatchScoreHeader({
  detail,
  locale,
}: {
  detail: FixtureDetail;
  locale: Locale;
}) {
  const isLive = detail.status.toLowerCase().includes("live");
  const isFinished =
    detail.status.toLowerCase().includes("full") ||
    detail.status.toLowerCase().includes("ft");
  const statusLabel = formatMatchStatusLabel(detail, locale);

  const TeamBlock = ({
    name,
    logo,
    teamId,
  }: {
    name: string;
    logo?: string;
    teamId?: number;
  }) => {
    const inner = (
      <>
        <TeamBadge name={name} logo={logo} size="lg" />
        <span className="mt-2 text-sm font-semibold text-slate-100">{name}</span>
      </>
    );

    if (teamId) {
      return (
        <Link
          href={`/teams/${teamId}`}
          className="flex flex-1 flex-col items-center text-center transition hover:opacity-80"
        >
          {inner}
        </Link>
      );
    }

    return <div className="flex flex-1 flex-col items-center text-center">{inner}</div>;
  };

  return (
    <div className="kora-card overflow-hidden rounded-2xl">
      <div className="border-b border-white/10 bg-white/5 px-6 py-3 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-kora-teal">
          {detail.league}
        </p>
        {detail.round && (
          <p className="mt-0.5 text-xs text-slate-500">{detail.round}</p>
        )}
      </div>

      <div className="px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <TeamBlock
            name={detail.homeTeam}
            logo={detail.homeTeamLogo}
            teamId={detail.homeTeamId}
          />

          <div className="shrink-0 text-center">
            <div className="text-4xl font-bold tracking-tight text-kora-green">
              {detail.homeScore ?? "–"} : {detail.awayScore ?? "–"}
            </div>
            {isLive ? (
              <Badge variant="live" className="mt-2">
                {detail.status}
              </Badge>
            ) : (
              <span
                className={`mt-2 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
                  isFinished
                    ? "bg-white/10 text-slate-400"
                    : "bg-kora-green/15 text-kora-green"
                }`}
              >
                {statusLabel}
              </span>
            )}
          </div>

          <TeamBlock
            name={detail.awayTeam}
            logo={detail.awayTeamLogo}
            teamId={detail.awayTeamId}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 border-t border-white/10 pt-4 text-xs text-slate-500">
          {detail.venue && (
            <span>
              {locale === "ar" ? "الملعب:" : "Venue:"} {detail.venue}
            </span>
          )}
          <span>
            {new Date(detail.date).toLocaleString(
              locale === "ar" ? "ar-SA" : "en-GB",
              { dateStyle: "medium", timeStyle: "short" }
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
