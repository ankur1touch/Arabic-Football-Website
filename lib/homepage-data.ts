import { readJsonData } from "@/lib/data";
import { getAggregatedNews } from "@/lib/news-feed";
import { fetchAllWcMatches, fetchFifaRankings, fetchWcTournaments } from "@/lib/football-proxy/services";
import { withMockFallback, mockTournaments } from "@/lib/football-proxy/fallback";
import type { Match } from "@/types/match";
import type { FifaRanking, RankingsData } from "@/types/ranking";
import type { NewsArticle } from "@/types/news";
import type { Tournament } from "@/types/tournament";

export interface HomepageData {
  matches: Match[];
  articles: NewsArticle[];
  fifaRankings: FifaRanking[];
  rankings: RankingsData;
  tournaments: Tournament[];
}

export async function getHomepageData(): Promise<HomepageData> {
  const rankings = readJsonData<RankingsData>("rankings.json");

  const [articlesResult, matchesResult, fifaResult, tournamentsResult] =
    await Promise.allSettled([
      getAggregatedNews(),
      fetchAllWcMatches(),
      fetchFifaRankings(),
      withMockFallback(fetchWcTournaments, mockTournaments),
    ]);

  const articles =
    articlesResult.status === "fulfilled"
      ? articlesResult.value
      : readJsonData<{ articles: NewsArticle[] }>("news.json").articles;

  const matches =
    matchesResult.status === "fulfilled"
      ? matchesResult.value
      : readJsonData<{ matches: Match[] }>("matches.json").matches ?? [];

  const fifaRankings =
    fifaResult.status === "fulfilled" ? fifaResult.value : [];

  const tournaments =
    tournamentsResult.status === "fulfilled"
      ? tournamentsResult.value
      : mockTournaments();

  return { articles, matches, fifaRankings, rankings, tournaments };
}
