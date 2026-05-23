import type { FixtureDetail, FixtureEvent, FixtureLineup } from "@/types/fixture-detail";
import type { Match } from "@/types/match";
import type { ApiFixtureItem } from "@/types/api-football/fixture";
import { mapFixtureToMatch, mapFixturesList } from "./match";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function mapMatchDetailResponse(
  matchData: unknown,
  lineupsData: unknown,
  eventsData: unknown,
  statsData: unknown,
  h2hData?: unknown
): FixtureDetail {
  const matchArr = extractArray<ApiFixtureItem>(matchData);
  const base = matchArr[0];
  const mapped = base ? mapFixtureToMatch(base) : null;

  return {
    fixtureId: mapped?.fixtureId ?? 0,
    homeTeam: mapped?.homeTeam ?? "",
    awayTeam: mapped?.awayTeam ?? "",
    homeTeamId: base?.teams.home.id,
    awayTeamId: base?.teams.away.id,
    homeTeamLogo: base?.teams.home.logo,
    awayTeamLogo: base?.teams.away.logo,
    homeScore: mapped?.homeScore ?? null,
    awayScore: mapped?.awayScore ?? null,
    status: base?.fixture.status.long ?? "",
    date: mapped?.kickoff ?? "",
    venue: mapped?.venue,
    round: mapped?.round,
    league: mapped?.league ?? "FIFA World Cup",
    lineups: mapLineups(lineupsData),
    events: mapEvents(eventsData),
    stats: mapStats(statsData),
    h2h: mapH2H(h2hData),
  };
}

function extractArray<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (typeof data === "object" && data !== null && "response" in data) {
    const r = (data as { response: unknown }).response;
    return Array.isArray(r) ? (r as T[]) : [];
  }
  return [];
}

function mapH2H(data: unknown): Match[] {
  return mapFixturesList(extractArray<ApiFixtureItem>(data), "FIFA World Cup");
}

function mapLineups(data: unknown): FixtureLineup[] {
  return extractArray<any>(data).map((row) => ({
    team: row.team?.name ?? "",
    teamId: row.team?.id,
    formation: row.formation ?? null,
    startXI: (row.startXI ?? []).map((p: any) => ({
      id: p.player?.id ?? 0,
      name: p.player?.name ?? "",
      number: p.player?.number ?? null,
      position: p.player?.pos ?? null,
    })),
    substitutes: (row.substitutes ?? []).map((p: any) => ({
      id: p.player?.id ?? 0,
      name: p.player?.name ?? "",
      number: p.player?.number ?? null,
      position: p.player?.pos ?? null,
    })),
  }));
}

function mapEvents(data: unknown): FixtureEvent[] {
  return extractArray<any>(data).map((e) => ({
    time: e.time?.elapsed ?? 0,
    team: e.team?.name ?? "",
    teamId: e.team?.id,
    player: e.player?.name ?? e.assist?.name ?? "",
    playerId: e.player?.id,
    assist: e.assist?.name ?? undefined,
    assistId: e.assist?.id ?? undefined,
    type: e.type ?? "",
    detail: e.detail ?? "",
  }));
}

function mapStats(data: unknown): FixtureDetail["stats"] {
  const blocks = extractArray<any>(data);
  if (blocks.length < 2) return [];

  const home = blocks[0]?.statistics ?? [];
  const away = blocks[1]?.statistics ?? [];

  return home.map((h: any, i: number) => ({
    type: h.type ?? "",
    home: h.value ?? null,
    away: away[i]?.value ?? null,
  }));
}
