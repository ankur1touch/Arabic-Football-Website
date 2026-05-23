export interface ApiStandingTeam {
  id: number;
  name: string;
  logo?: string;
}

export interface ApiStandingEntry {
  rank: number;
  team: ApiStandingTeam;
  points: number;
  goalsDiff: number;
  group?: string;
  form?: string;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
    goals: { for: number; against: number };
  };
}

export interface ApiStandingsLeague {
  league: {
    id: number;
    name: string;
    season: number;
  };
  standings: ApiStandingEntry[][];
}
