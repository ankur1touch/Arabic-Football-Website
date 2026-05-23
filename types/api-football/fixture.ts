export interface ApiTeamInfo {
  id: number;
  name: string;
  logo?: string;
}

export interface ApiFixtureGoals {
  home: number | null;
  away: number | null;
}

export interface ApiFixtureStatus {
  long: string;
  short: string;
  elapsed: number | null;
}

export interface ApiFixtureItem {
  fixture: {
    id: number;
    date: string;
    timestamp?: number;
    venue?: { name?: string; city?: string };
    status: ApiFixtureStatus;
    round?: string;
  };
  league: {
    id: number;
    name: string;
    season: number;
    round?: string;
  };
  teams: {
    home: ApiTeamInfo;
    away: ApiTeamInfo;
  };
  goals: ApiFixtureGoals;
  score?: {
    halftime?: ApiFixtureGoals;
    fulltime?: ApiFixtureGoals;
  };
}
