"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews } from "@/store/features/newsSlice";
import { fetchMatches } from "@/store/features/matchesSlice";
import { fetchRankings } from "@/store/features/rankingsSlice";
import { fetchTournaments } from "@/store/features/tournamentsSlice";
import type { Locale } from "@/store/features/localeSlice";
import { LiveMatchTicker } from "./LiveMatchTicker";
import { HeroSection } from "./HeroSection";
import { VideoNewsStrip } from "./VideoNewsStrip";
import { NewsGrid } from "./NewsGrid";
import { RankingsSnippet } from "./RankingsSnippet";
import { UpcomingMatchesWidget } from "@/components/scores/LiveScoresWidget";
import { SourcesWidget } from "./SourcesWidget";
import { TournamentSpotlight } from "./TournamentSpotlight";
import { Button } from "@/components/ui/Button";

export function HomePageClient({ locale }: { locale: Locale }) {
  const t = useTranslations("home");
  const dispatch = useAppDispatch();
  const newsStatus = useAppSelector((s) => s.news.status);
  const matchesStatus = useAppSelector((s) => s.matches.status);
  const failed = newsStatus === "failed" || matchesStatus === "failed";

  useEffect(() => {
    dispatch(fetchNews());
    dispatch(fetchMatches());
    dispatch(fetchRankings());
    dispatch(fetchTournaments());
  }, [dispatch]);

  const retry = () => {
    dispatch(fetchNews());
    dispatch(fetchMatches());
    dispatch(fetchRankings());
    dispatch(fetchTournaments());
  };

  return (
    <>
      <LiveMatchTicker locale={locale} />
      <HeroSection locale={locale} />

      {failed && (
        <div className="mx-auto max-w-7xl px-4 py-4 text-center">
          <p className="text-kora-alert">{t("noResults")}</p>
          <Button className="mt-2" onClick={retry}>
            {t("retry")}
          </Button>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <VideoNewsStrip locale={locale} />
          <NewsGrid locale={locale} />
        </div>
        <div className="min-w-0 space-y-6">
          <RankingsSnippet locale={locale} />
          <UpcomingMatchesWidget locale={locale} />
          <SourcesWidget />
          <TournamentSpotlight locale={locale} />
        </div>
      </div>
    </>
  );
}
