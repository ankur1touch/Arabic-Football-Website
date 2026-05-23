"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPlayerDetail,
  clearPlayerDetail,
} from "@/store/features/playerDetailSlice";
import type { Locale } from "@/store/features/localeSlice";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { PlayerProfileCard } from "./PlayerProfileCard";
import { PlayerSeasonStats } from "./PlayerSeasonStats";
import { PlayerRecentFixtures } from "./PlayerRecentFixtures";

export function PlayerDetailClient({
  locale,
  playerId,
}: {
  locale: Locale;
  playerId: string;
}) {
  const dispatch = useAppDispatch();
  const { player, statistics, fixtures, status, error } = useAppSelector(
    (s) => s.playerDetail
  );
  const isAr = locale === "ar";

  useEffect(() => {
    dispatch(fetchPlayerDetail(playerId));
    return () => {
      dispatch(clearPlayerDetail());
    };
  }, [dispatch, playerId]);

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (status === "failed" || !player) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-kora-alert">{error ?? (isAr ? "لاعب غير موجود" : "Player not found")}</p>
        <Button className="mt-4" onClick={() => dispatch(fetchPlayerDetail(playerId))}>
          {isAr ? "إعادة المحاولة" : "Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/players" className="text-sm text-kora-green hover:underline">
        ← {isAr ? "اللاعبون" : "Players"}
      </Link>

      <div className="mt-4 space-y-8">
        <PlayerProfileCard player={player} statistics={statistics} locale={locale} />
        <PlayerSeasonStats statistics={statistics} locale={locale} />
        <PlayerRecentFixtures fixtures={fixtures} locale={locale} />
      </div>
    </div>
  );
}
