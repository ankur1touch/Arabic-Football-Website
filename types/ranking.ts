export interface RankingEntry {
  rank: number;
  team: string;
  teamAr: string;
  points: number;
  previousRank?: number;
}

export interface RankingsData {
  men: RankingEntry[];
  women: RankingEntry[];
}
