import type { ApiTopScorerItem } from "@/types/api-football/player";
import type { TopScorer } from "@/types/tournament";
import type { Player, PlayerPosition } from "@/types/player";

function mapPosition(pos?: string): PlayerPosition {
  const p = (pos ?? "").toUpperCase();
  if (p.includes("G")) return "GK";
  if (p.includes("D")) return "DEF";
  if (p.includes("M")) return "MID";
  return "FWD";
}

export function mapTopScorers(items: ApiTopScorerItem[]): TopScorer[] {
  return items
    .map((item, index) => {
      const stat = item.statistics[0];
      return {
        rank: index + 1,
        playerId: item.player.id,
        player: item.player.name,
        playerAr: item.player.name,
        teamId: stat?.team?.id,
        team: stat?.team?.name ?? "",
        goals: stat?.goals?.total ?? 0,
      };
    })
    .sort((a, b) => b.goals - a.goals)
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

export function mapTopScorersToPlayers(items: ApiTopScorerItem[]): Player[] {
  return items.map((item) => {
    const stat = item.statistics[0];
    const goals = stat?.goals?.total ?? 0;
    const assists = stat?.assists?.total ?? 0;
    const apps = stat?.games?.appearences ?? 0;

    return {
      id: String(item.player.id),
      name: item.player.name,
      nameAr: item.player.name,
      position: mapPosition(stat?.games?.position),
      nationality: item.player.nationality ?? stat?.team?.name ?? "",
      nationalityAr: item.player.nationality ?? stat?.team?.name ?? "",
      club: stat?.team?.name ?? "",
      clubAr: stat?.team?.name ?? "",
      age: item.player.age ?? 0,
      imageUrl: item.player.photo,
      bioAr: `${item.player.name} — هداف كأس العالم`,
      bioEn: `${item.player.name} — World Cup scorer`,
      career: [],
      stats: { goals, assists, appearances: apps },
    };
  });
}
