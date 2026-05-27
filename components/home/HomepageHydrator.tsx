"use client";

import { useLayoutEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateNews } from "@/store/features/newsSlice";
import { hydrateMatches } from "@/store/features/matchesSlice";
import { hydrateRankings } from "@/store/features/rankingsSlice";
import { hydrateTournaments } from "@/store/features/tournamentsSlice";
import type { HomepageData } from "@/lib/homepage-data";

export function HomepageHydrator({ data }: { data: HomepageData }) {
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(hydrateNews(data.articles));
    dispatch(hydrateMatches(data.matches));
    dispatch(hydrateRankings({ men: data.rankings.men, women: data.rankings.women }));
    dispatch(hydrateTournaments(data.tournaments));
  }, [dispatch, data]);

  return null;
}
