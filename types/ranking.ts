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

export interface FifaRanking {
  rank: number;
  country: string;
  countryAr: string;
  flag: string;
  logo?: string;
  points: number;
  change: number;
}
