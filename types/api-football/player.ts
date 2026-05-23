export interface ApiTopScorerPlayer {
  id: number;
  name: string;
  firstname?: string;
  lastname?: string;
  age?: number;
  nationality?: string;
  photo?: string;
}

export interface ApiTopScorerItem {
  player: ApiTopScorerPlayer;
  statistics: Array<{
    team: { id: number; name: string; logo?: string };
    games: { appearences?: number; position?: string };
    goals: { total: number | null };
    assists: { total: number | null };
  }>;
}
