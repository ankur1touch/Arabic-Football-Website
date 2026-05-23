import type { Match } from "./match";

export interface FixtureLineupPlayer {
  id: number;
  name: string;
  number: number | null;
  position: string | null;
}

export interface FixtureLineup {
  team: string;
  teamId?: number;
  formation: string | null;
  startXI: FixtureLineupPlayer[];
  substitutes: FixtureLineupPlayer[];
}

export interface FixtureEvent {
  time: number;
  team: string;
  teamId?: number;
  player: string;
  playerId?: number;
  assist?: string;
  assistId?: number;
  type: string;
  detail: string;
}

export interface FixtureStatRow {
  type: string;
  home: string | number | null;
  away: string | number | null;
}

export interface FixtureDetail {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  homeTeamId?: number;
  awayTeamId?: number;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  date: string;
  venue?: string;
  round?: string;
  league: string;
  lineups: FixtureLineup[];
  events: FixtureEvent[];
  stats: FixtureStatRow[];
  h2h: Match[];
}
