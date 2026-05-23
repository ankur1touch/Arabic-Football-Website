"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLiveScores } from "@/store/features/matchesSlice";
import type { Locale } from "@/store/features/localeSlice";
import { MatchCard } from "@/components/matches/MatchCard";
import { Skeleton } from "@/components/ui/Skeleton";

export function LiveScoresPageClient({ locale }: { locale: Locale }) {
  const dispatch = useAppDispatch();
  const { matches, status } = useAppSelector((s) => s.matches);

  useEffect(() => {
    dispatch(fetchLiveScores());
  }, [dispatch]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-100">
        {locale === "ar" ? "كأس العالم — نتائج مباشرة" : "World Cup Live Scores"}
      </h1>
      {status === "loading" && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}
      {status === "succeeded" && matches.length === 0 && (
        <p className="text-center text-slate-400">
          {locale === "ar" ? "لا توجد مباريات مباشرة الآن" : "No live matches right now"}
        </p>
      )}
      <div className="space-y-4">
        {matches.map((m) => (
          <MatchCard key={m.id} match={m} locale={locale} />
        ))}
      </div>
    </div>
  );
}
