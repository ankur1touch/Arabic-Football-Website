import type { ApiTopScorerItem } from "@/types/api-football/player";
import type { ApiFixtureItem } from "@/types/api-football/fixture";
import type { PlayerDetailResponse, PlayerInfo, PlayerStatistics } from "@/types/player";
import { mapFixturesList } from "./match";

function extractArray<T>(data: unknown): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data as T[];
  if (typeof data === "object" && data !== null && "response" in data) {
    const r = (data as { response: unknown }).response;
    return Array.isArray(r) ? (r as T[]) : [];
  }
  return [];
}

function mapPlayerInfo(item: ApiTopScorerItem): PlayerInfo {
  const p = item.player;
  return {
    id: p.id,
    name: p.name,
    firstname: p.firstname ?? "",
    lastname: p.lastname ?? "",
    age: p.age ?? 0,
    nationality: p.nationality ?? "",
    height: "",
    weight: "",
    injured: false,
    photo: p.photo ?? "",
  };
}

function mapStatistics(items: ApiTopScorerItem[]): PlayerStatistics[] {
  return items.flatMap((item) =>
    (item.statistics ?? []).map((stat) => ({
      team: {
        id: stat.team?.id ?? 0,
        name: stat.team?.name ?? "",
        logo: stat.team?.logo,
      },
      league: {
        id: 0,
        name: "FIFA World Cup",
        country: "",
        logo: "",
        season: new Date().getFullYear(),
      },
      games: {
        appearences: stat.games?.appearences ?? 0,
        lineups: 0,
        minutes: 0,
        position: stat.games?.position ?? "",
        rating: "",
      },
      goals: {
        total: stat.goals?.total ?? 0,
        assists: stat.assists?.total ?? 0,
        saves: null,
      },
      shots: { total: 0, on: 0 },
      passes: { total: 0, key: 0, accuracy: 0 },
      tackles: { total: 0, blocks: 0, interceptions: 0 },
      cards: { yellow: 0, yellowred: 0, red: 0 },
    }))
  );
}

export function mapPlayerDetailResponse(
  playerData: unknown,
  fixturesData: unknown
): PlayerDetailResponse {
  const items = extractArray<ApiTopScorerItem>(playerData);
  const first = items[0];
  const fixtures = mapFixturesList(
    extractArray<ApiFixtureItem>(fixturesData),
    "FIFA World Cup"
  );

  if (!first) {
    return {
      player: {
        id: 0,
        name: "Unknown",
        firstname: "",
        lastname: "",
        age: 0,
        nationality: "",
        height: "",
        weight: "",
        injured: false,
        photo: "",
      },
      statistics: [],
      recentFixtures: fixtures,
    };
  }

  return {
    player: mapPlayerInfo(first),
    statistics: mapStatistics(items),
    recentFixtures: fixtures,
  };
}
