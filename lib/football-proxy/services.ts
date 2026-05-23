import { proxyGet, FootballProxyError } from "./client";
import { getWcLeagueId, getWcSeason, worldCupConfig } from "./config";
import { footballEndpoints } from "./endpoints";
import { unwrapResponse } from "@/types/api-football/common";
import type { ApiFixtureItem } from "@/types/api-football/fixture";
import type { ApiStandingsLeague } from "@/types/api-football/standings";
import type { ApiFootballTeam } from "@/types/api-football/team";
import type { ApiTopScorerItem } from "@/types/api-football/player";
import { mapFixturesList } from "./mappers/match";
import { flattenStandings } from "./mappers/standings";
import { mapTeamsList } from "./mappers/team";
import { mapTopScorers, mapTopScorersToPlayers } from "./mappers/player";
import { mapMatchDetailResponse } from "./mappers/fixture-detail";
import { mapPlayerDetailResponse } from "./mappers/player-detail";
import { mapTeamDetailResponse } from "./mappers/team-detail";
import { buildFixtureDetailFromMatch, buildMockFixtureDetail, mockMatchesList } from "@/lib/mock-match-data";
import type { Match } from "@/types/match";
import type { Team } from "@/types/team";
import type { Player } from "@/types/player";
import type { Tournament, TopScorer } from "@/types/tournament";
import type { FixtureDetail } from "@/types/fixture-detail";
import type { PlayerDetailResponse } from "@/types/player";
import type { TeamDetailResponse } from "@/types/team";
import type { TournamentRound } from "@/types/world-cup";

function wcParams(extra?: Record<string, string | number>) {
  return {
    league: getWcLeagueId(),
    season: getWcSeason(),
    ...extra,
  };
}

function filterWcFixtures(items: ApiFixtureItem[]): ApiFixtureItem[] {
  const wcLeagueId = getWcLeagueId();
  const wcSeason = getWcSeason();
  return items.filter(
    (item) => item.league.id === wcLeagueId && item.league.season === wcSeason
  );
}

export async function fetchLiveMatches(): Promise<Match[]> {
  try {
    const raw = await proxyGet(footballEndpoints.fixtures, {
      ...wcParams(),
      live: "all",
    });
    const items = unwrapResponse<ApiFixtureItem[]>(raw);
    return mapFixturesList(Array.isArray(items) ? items : []);
  } catch {
    const raw = await proxyGet(footballEndpoints.live);
    const items = unwrapResponse<ApiFixtureItem[]>(raw);
    return mapFixturesList(filterWcFixtures(Array.isArray(items) ? items : []));
  }
}

export async function fetchUpcomingFixtures(next = 15): Promise<Match[]> {
  const raw = await proxyGet(footballEndpoints.fixtures, {
    ...wcParams(),
    next,
  });
  const items = unwrapResponse<ApiFixtureItem[]>(raw);
  return mapFixturesList(Array.isArray(items) ? items : []);
}

export async function fetchPastFixtures(last = 15): Promise<Match[]> {
  const raw = await proxyGet(footballEndpoints.fixtures, {
    ...wcParams(),
    last,
  });
  const items = unwrapResponse<ApiFixtureItem[]>(raw);
  return mapFixturesList(Array.isArray(items) ? items : []);
}

export async function fetchAllWcMatches(): Promise<Match[]> {
  const [live, upcoming, past] = await Promise.all([
    fetchLiveMatches().catch(() => []),
    fetchUpcomingFixtures(20).catch(() => []),
    fetchPastFixtures(20).catch(() => []),
  ]);

  const seen = new Set<string>();
  return [...live, ...upcoming, ...past].filter((m) => {
    if (seen.has(m.id)) return false;
    seen.add(m.id);
    return true;
  });
}

export async function fetchWcStandings(): Promise<Tournament> {
  const raw = await proxyGet(footballEndpoints.standings, wcParams());
  const groups = unwrapResponse<ApiStandingsLeague[]>(raw);
  const standings = flattenStandings(Array.isArray(groups) ? groups : []);

  let topScorers: TopScorer[] = [];
  try {
    topScorers = await fetchWcTopScorers();
  } catch {
    topScorers = [];
  }

  return {
    id: worldCupConfig.id,
    name: worldCupConfig.name,
    nameAr: worldCupConfig.nameAr,
    category: "international",
    season: String(getWcSeason()),
    featured: true,
    standings,
    topScorers,
  };
}

export async function fetchWcTournaments(): Promise<Tournament[]> {
  const wc = await fetchWcStandings();
  return [wc];
}

export async function fetchWcTeams(): Promise<Team[]> {
  const raw = await proxyGet(footballEndpoints.teams, wcParams());
  const items = unwrapResponse<ApiFootballTeam[]>(raw);
  return mapTeamsList(Array.isArray(items) ? items : []);
}

export async function fetchWcTopScorers(): Promise<TopScorer[]> {
  const raw = await proxyGet(footballEndpoints.topscorers, wcParams());
  const items = unwrapResponse<ApiTopScorerItem[]>(raw);
  return mapTopScorers(Array.isArray(items) ? items : []);
}

export async function fetchWcTopScorerPlayers(): Promise<Player[]> {
  const raw = await proxyGet(footballEndpoints.topscorers, wcParams());
  const items = unwrapResponse<ApiTopScorerItem[]>(raw);
  return mapTopScorersToPlayers(Array.isArray(items) ? items : []);
}

export async function searchPlayers(query: string): Promise<Player[]> {
  const raw = await proxyGet(footballEndpoints.players, { search: query });
  const items = unwrapResponse<ApiTopScorerItem[]>(raw);
  return mapTopScorersToPlayers(Array.isArray(items) ? items : []);
}

export async function fetchWcRounds(): Promise<TournamentRound[]> {
  const raw = await proxyGet(footballEndpoints.rounds, wcParams());
  const items = unwrapResponse<string[] | { round: string }[]>(raw);
  if (!Array.isArray(items)) return [];

  return items.map((item) => {
    const name = typeof item === "string" ? item : item.round;
    return { name };
  });
}

export async function fetchMatchH2H(
  homeTeamId: number,
  awayTeamId: number,
  last = 5
): Promise<Match[]> {
  const raw = await proxyGet(footballEndpoints.headtohead, {
    h2h: `${homeTeamId}-${awayTeamId}`,
    last,
  });
  const items = unwrapResponse<ApiFixtureItem[]>(raw);
  return mapFixturesList(Array.isArray(items) ? items : []);
}

export async function fetchFixtureDetail(
  fixtureId: number
): Promise<FixtureDetail> {
  let match: unknown;
  try {
    match = await proxyGet(footballEndpoints.match(fixtureId));
  } catch {
    match = await proxyGet(footballEndpoints.fixtures, { id: fixtureId });
  }

  const matchArr = unwrapResponse<ApiFixtureItem[]>(match);
  const base = Array.isArray(matchArr) ? matchArr[0] : undefined;

  if (!base) {
    throw new FootballProxyError(`No fixture data for id ${fixtureId}`, 404);
  }

  const homeId = base.teams.home.id;
  const awayId = base.teams.away.id;

  const [lineups, events, stats, h2h] = await Promise.all([
    proxyGet(footballEndpoints.lineups, { fixture: fixtureId }).catch(() => null),
    proxyGet(footballEndpoints.events, { fixture: fixtureId }).catch(() => null),
    proxyGet(footballEndpoints.stats, { fixture: fixtureId }).catch(() => null),
    homeId && awayId
      ? fetchMatchH2H(homeId, awayId).catch(() => [])
      : Promise.resolve([]),
  ]);

  const detail = mapMatchDetailResponse(match, lineups, events, stats);
  detail.fixtureId = fixtureId;
  detail.h2h = Array.isArray(h2h) ? h2h : [];
  return detail;
}

/** Fallback when proxy match endpoint fails — search live/upcoming/past lists. */
export async function resolveFixtureDetailFallback(
  fixtureId: number
): Promise<FixtureDetail> {
  const fromJson = buildMockFixtureDetail(fixtureId);
  if (fromJson) return fromJson;

  const pools = await Promise.all([
    fetchLiveMatches().catch(() => []),
    fetchUpcomingFixtures(30).catch(() => []),
    fetchPastFixtures(30).catch(() => []),
  ]);

  const found = pools.flat().find((m) => m.fixtureId === fixtureId);
  if (found) {
    return buildFixtureDetailFromMatch(found);
  }

  try {
    const raw = await proxyGet(footballEndpoints.fixtures, { id: fixtureId });
    const items = unwrapResponse<ApiFixtureItem[]>(raw);
    const item = Array.isArray(items) ? items[0] : undefined;
    if (item) {
      const mapped = mapFixturesList([item], item.league?.name)[0];
      return buildFixtureDetailFromMatch({ ...mapped, fixtureId });
    }
  } catch {
    // continue to json fallback
  }

  const seed = mockMatchesList()[0];
  return buildFixtureDetailFromMatch({
    ...seed,
    fixtureId,
    id: String(fixtureId),
    homeTeam: `Home (${fixtureId})`,
    awayTeam: `Away (${fixtureId})`,
    homeTeamAr: `Home (${fixtureId})`,
    awayTeamAr: `Away (${fixtureId})`,
  });
}

export async function fetchPlayerDetail(playerId: number): Promise<PlayerDetailResponse> {
  const [playerRaw, fixturesRaw] = await Promise.all([
    proxyGet(footballEndpoints.players, { id: playerId, season: getWcSeason() }),
    proxyGet(footballEndpoints.fixtures, { player: playerId, last: 5 }),
  ]);
  return mapPlayerDetailResponse(playerRaw, fixturesRaw);
}

export async function fetchTeamDetail(teamId: number): Promise<TeamDetailResponse> {
  const [teamRaw, squadRaw, fixturesRaw, resultsRaw, standingsRaw] =
    await Promise.all([
      proxyGet(footballEndpoints.teams, { id: teamId }),
      proxyGet(footballEndpoints.playersSquads, { team: teamId }).catch(() => null),
      proxyGet(footballEndpoints.fixtures, { team: teamId, next: 5 }).catch(() => null),
      proxyGet(footballEndpoints.fixtures, { team: teamId, last: 5 }).catch(() => null),
      proxyGet(footballEndpoints.standings, wcParams()).catch(() => null),
    ]);

  const groups = unwrapResponse<ApiStandingsLeague[]>(standingsRaw ?? []);
  const standings = flattenStandings(Array.isArray(groups) ? groups : []);

  return mapTeamDetailResponse(teamRaw, squadRaw, fixturesRaw, resultsRaw, standings);
}
