import type { ApiFootballTeam } from "@/types/api-football/team";
import type { ApiFixtureItem } from "@/types/api-football/fixture";
import type { TeamDetailResponse, TeamInfo, SquadPlayer } from "@/types/team";
import type { StandingRow } from "@/types/tournament";
import { mapFixturesList } from "./match";

/* eslint-disable @typescript-eslint/no-explicit-any */

function extractArray<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (typeof data === "object" && data !== null && "response" in data) {
    const r = (data as { response: unknown }).response;
    return Array.isArray(r) ? (r as T[]) : [];
  }
  return [];
}

function mapTeamInfo(item: ApiFootballTeam): TeamInfo {
  const t = item.team;
  return {
    id: t.id,
    name: t.name,
    code: t.code ?? "",
    country: t.country ?? "",
    founded: t.founded ?? 0,
    logo: t.logo ?? "",
    venue: {
      id: 0,
      name: item.venue?.name ?? "",
      address: "",
      city: item.venue?.city ?? "",
      capacity: 0,
      image: "",
    },
  };
}

function mapSquad(data: unknown): SquadPlayer[] {
  const blocks = extractArray<any>(data);
  const players = blocks[0]?.players ?? blocks.flatMap((b) => b.players ?? []);
  return (players as any[]).map((p) => ({
    id: p.id,
    name: p.name ?? "",
    nameAr: p.name ?? "",
    position: p.position ?? "",
    club: "",
    number: p.number ?? null,
    age: p.age,
    photo: p.photo,
  }));
}

export function mapTeamDetailResponse(
  teamData: unknown,
  squadData: unknown,
  fixturesData: unknown,
  resultsData: unknown,
  standings: StandingRow[]
): TeamDetailResponse {
  const teams = extractArray<ApiFootballTeam>(teamData);
  const team = teams[0] ? mapTeamInfo(teams[0]) : null;

  return {
    team: team ?? {
      id: 0,
      name: "Unknown",
      code: "",
      country: "",
      founded: 0,
      logo: "",
      venue: { id: 0, name: "", address: "", city: "", capacity: 0, image: "" },
    },
    squad: mapSquad(squadData),
    fixtures: mapFixturesList(extractArray<ApiFixtureItem>(fixturesData), "FIFA World Cup"),
    results: mapFixturesList(extractArray<ApiFixtureItem>(resultsData), "FIFA World Cup"),
    standings,
  };
}
