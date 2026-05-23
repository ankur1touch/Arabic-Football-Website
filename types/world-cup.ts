export interface WorldCupConfig {
  id: string;
  leagueId: number;
  season: number;
  name: string;
  nameAr: string;
}

export interface TournamentRound {
  name: string;
  current?: boolean;
}
