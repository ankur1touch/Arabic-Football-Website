"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFixtureDetail, clearFixture } from "@/store/features/fixtureSlice";
import type { Locale } from "@/store/features/localeSlice";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { MatchScoreHeader } from "./MatchScoreHeader";
import { MatchEventTimeline } from "./MatchEventTimeline";
import { MatchLineups } from "./MatchLineups";
import { MatchStatsSection } from "./MatchStatsSection";
import { MatchH2H } from "./MatchH2H";

export function MatchDetailClient({
  locale,
  matchId,
}: {
  locale: Locale;
  matchId: number | string;
}) {
  const dispatch = useAppDispatch();
  const { detail, status, error } = useAppSelector((s) => s.fixture);

  useEffect(() => {
    dispatch(fetchFixtureDetail(matchId));
    return () => {
      dispatch(clearFixture());
    };
  }, [dispatch, matchId]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (status === "failed" || !detail) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-kora-alert">{error ?? "Failed to load match"}</p>
        <Button className="mt-4" onClick={() => dispatch(fetchFixtureDetail(matchId))}>
          {locale === "ar" ? "إعادة المحاولة" : "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/matches" className="text-sm text-kora-green hover:underline">
        ← {locale === "ar" ? "المباريات" : "Matches"}
      </Link>

      <div className="mt-6">
        <MatchScoreHeader detail={detail} locale={locale} />
      </div>

      {detail.events.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">
            {locale === "ar" ? "أحداث المباراة" : "Match Events"}
          </h2>
          <MatchEventTimeline events={detail.events} locale={locale} />
        </section>
      ) : null}

      {detail.lineups.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">
            {locale === "ar" ? "التشكيلات" : "Lineups"}
          </h2>
          <MatchLineups lineups={detail.lineups} locale={locale} />
        </section>
      ) : null}

      {detail.stats.length > 0 ? (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">
            {locale === "ar" ? "إحصائيات" : "Statistics"}
          </h2>
          <MatchStatsSection
            stats={detail.stats}
            homeTeam={detail.homeTeam}
            awayTeam={detail.awayTeam}
            locale={locale}
          />
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-slate-100">
          {locale === "ar" ? "المواجهات المباشرة" : "Head to Head"}
        </h2>
        <MatchH2H matches={detail.h2h} locale={locale} />
      </section>
    </div>
  );
}
