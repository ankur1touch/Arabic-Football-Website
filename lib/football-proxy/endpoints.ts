const PREFIX = "/api/football";

export const footballEndpoints = {
  live: `${PREFIX}/live`,
  fixtures: `${PREFIX}/fixtures`,
  standings: `${PREFIX}/standings`,
  teams: `${PREFIX}/teams`,
  topscorers: `${PREFIX}/topscorers`,
  topassists: `${PREFIX}/topassists`,
  rounds: `${PREFIX}/rounds`,
  leagues: `${PREFIX}/leagues`,
  match: (id: number | string) => `${PREFIX}/match/${id}`,
  lineups: `${PREFIX}/lineups`,
  events: `${PREFIX}/events`,
  stats: `${PREFIX}/stats`,
  players: `${PREFIX}/players`,
  playersSquads: `${PREFIX}/players-squads`,
  headtohead: `${PREFIX}/headtohead`,
} as const;
