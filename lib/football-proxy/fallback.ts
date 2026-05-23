import { readJsonData } from "@/lib/data";
import { shouldUseMockFallback } from "./config";
import {
  buildMockFixtureDetail,
  mockMatchesList,
} from "@/lib/mock-match-data";
import type { Match } from "@/types/match";
import type { Team } from "@/types/team";
import type { Player } from "@/types/player";
import type { Tournament } from "@/types/tournament";
import type { FixtureDetail } from "@/types/fixture-detail";
import type { PlayerDetailResponse } from "@/types/player";
import type { TeamDetailResponse } from "@/types/team";

export async function withMockFallback<T>(
  fetcher: () => Promise<T>,
  mock: () => T | Promise<T>
): Promise<T> {
  try {
    return await fetcher();
  } catch (err) {
    if (!shouldUseMockFallback()) throw err;
    console.warn("[football-proxy] falling back to mock:", err);
    return await mock();
  }
}

export function mockMatches(): Match[] {
  return mockMatchesList();
}

export function mockTeams(): Team[] {
  return readJsonData<{ teams: Team[] }>("teams.json").teams;
}

export function mockPlayers(): Player[] {
  return readJsonData<{ players: Player[] }>("players.json").players;
}

export function mockTournaments(): Tournament[] {
  return readJsonData<{ tournaments: Tournament[] }>("tournaments.json").tournaments;
}

export function mockFixtureDetail(id: string | number): FixtureDetail {
  const detail = buildMockFixtureDetail(id);
  if (detail) return detail;
  throw new Error(`Mock match not found: ${id}`);
}

export function mockPlayerDetail(playerId: string): PlayerDetailResponse {
  const player =
    mockPlayers().find((p) => p.id === playerId) ?? mockPlayers()[0];

  return {
    player: {
      id: Number.isNaN(Number(playerId)) ? 0 : Number(playerId),
      name: player.name,
      firstname: player.name.split(" ")[0] ?? "",
      lastname: player.name.split(" ").slice(1).join(" "),
      age: player.age,
      nationality: player.nationality,
      height: "",
      weight: "",
      injured: false,
      photo: player.imageUrl ?? "",
    },
    statistics: [
      {
        team: { id: 0, name: player.club, logo: "" },
        league: {
          id: 1,
          name: "FIFA World Cup",
          country: "",
          logo: "",
          season: 2026,
        },
        games: {
          appearences: player.stats.appearances,
          lineups: 0,
          minutes: 0,
          position: player.position,
          rating: "",
        },
        goals: {
          total: player.stats.goals,
          assists: player.stats.assists,
          saves: null,
        },
        shots: { total: 0, on: 0 },
        passes: { total: 0, key: 0, accuracy: 0 },
        tackles: { total: 0, blocks: 0, interceptions: 0 },
        cards: { yellow: 0, yellowred: 0, red: 0 },
      },
    ],
    recentFixtures: mockMatches().slice(0, 5),
  };
}

export function mockTeamDetail(teamId: string): TeamDetailResponse {
  const team = mockTeams().find((t) => t.id === teamId) ?? mockTeams()[0];
  const wc = mockTournaments().find((t) => t.id === "wc2026");

  return {
    team: {
      id: Number.isNaN(Number(teamId)) ? 0 : Number(teamId),
      name: team.name,
      code: team.id.slice(0, 3).toUpperCase(),
      country: team.name,
      founded: 1900,
      logo: "",
      venue: { id: 0, name: "", address: "", city: "", capacity: 0, image: "" },
    },
    squad: team.squad.map((p, i) => ({
      ...p,
      id: i + 1,
    })),
    fixtures: mockMatches().filter((m) => m.status === "upcoming").slice(0, 5),
    results: mockMatches().filter((m) => m.status === "finished").slice(0, 5),
    standings: wc?.standings ?? [],
  };
}

export { mergeMatchCoverage, buildMockFixtureDetail } from "@/lib/mock-match-data";
