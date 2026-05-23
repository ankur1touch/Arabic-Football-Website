"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTeamDetail, clearTeamDetail } from "@/store/features/teamDetailSlice";
import type { Locale } from "@/store/features/localeSlice";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { TeamHeaderCard } from "./TeamHeaderCard";
import { TeamLeaguePosition } from "./TeamLeaguePosition";
import { TeamSquadList } from "./TeamSquadList";
import { TeamFixturesList } from "./TeamFixturesList";

type Tab = "squad" | "fixtures" | "results";

export function TeamDetailClient({
  locale,
  teamId,
}: {
  locale: Locale;
  teamId: string;
}) {
  const dispatch = useAppDispatch();
  const { team, squad, fixtures, results, standings, status, error } =
    useAppSelector((s) => s.teamDetail);
  const [tab, setTab] = useState<Tab>("squad");
  const isAr = locale === "ar";

  useEffect(() => {
    dispatch(fetchTeamDetail(teamId));
    return () => {
      dispatch(clearTeamDetail());
    };
  }, [dispatch, teamId]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (status === "failed" || !team) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-kora-alert">{error ?? (isAr ? "فريق غير موجود" : "Team not found")}</p>
        <Button className="mt-4" onClick={() => dispatch(fetchTeamDetail(teamId))}>
          {isAr ? "إعادة المحاولة" : "Retry"}
        </Button>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "squad", label: isAr ? "التشكيلة" : "Squad" },
    { key: "fixtures", label: isAr ? "القادمة" : "Upcoming" },
    { key: "results", label: isAr ? "النتائج" : "Results" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/teams" className="text-sm text-kora-green hover:underline">
        ← {isAr ? "المنتخبات" : "Teams"}
      </Link>

      <div className="mt-4 space-y-6">
        <TeamHeaderCard team={team} locale={locale} />
        <TeamLeaguePosition
          standings={standings}
          teamId={team.id}
          locale={locale}
        />

        <div className="flex border-b border-white/10">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "border-kora-green text-kora-green"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "squad" && <TeamSquadList squad={squad} locale={locale} />}
        {tab === "fixtures" && (
          <TeamFixturesList
            matches={fixtures}
            label={isAr ? "المباريات القادمة" : "Upcoming matches"}
            locale={locale}
          />
        )}
        {tab === "results" && (
          <TeamFixturesList
            matches={results}
            label={isAr ? "آخر النتائج" : "Recent results"}
            locale={locale}
          />
        )}
      </div>
    </div>
  );
}
