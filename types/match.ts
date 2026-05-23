export type MatchStatus = "live" | "upcoming" | "finished";

export interface Match {
  id: string;
  fixtureId?: number;
  homeTeamId?: number;
  awayTeamId?: number;
  homeTeam: string;
  homeTeamAr: string;
  awayTeam: string;
  awayTeamAr: string;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  minute?: number;
  league: string;
  leagueAr: string;
  kickoff: string;
  kickoffKsa?: string;
  round?: string;
  venue?: string;
  group?: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
}
