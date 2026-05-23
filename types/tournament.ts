export type TournamentCategory = "club" | "international" | "domestic";

export interface StandingRow {
  rank: number;
  teamId?: number;
  team: string;
  teamAr: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gd: number;
  points: number;
}

export interface TopScorer {
  rank: number;
  playerId?: number;
  player: string;
  playerAr: string;
  teamId?: number;
  team: string;
  goals: number;
}

export interface Tournament {
  id: string;
  name: string;
  nameAr: string;
  category: TournamentCategory;
  season: string;
  featured?: boolean;
  standings: StandingRow[];
  topScorers: TopScorer[];
}
