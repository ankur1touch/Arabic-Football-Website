import type { ApiStandingsLeague } from "@/types/api-football/standings";
import type { StandingRow } from "@/types/tournament";

export function flattenStandings(groups: ApiStandingsLeague[]): StandingRow[] {
  const rows: StandingRow[] = [];

  for (const block of groups) {
    const standingsGroups = block?.standings;
    if (!Array.isArray(standingsGroups)) continue;

    for (const group of standingsGroups) {
      if (!Array.isArray(group)) continue;
      for (const entry of group) {
        rows.push({
          rank: entry.rank,
          teamId: entry.team.id,
          team: entry.team.name,
          teamAr: entry.team.name,
          played: entry.all.played,
          won: entry.all.win,
          drawn: entry.all.draw,
          lost: entry.all.lose,
          gd: entry.goalsDiff,
          points: entry.points,
        });
      }
    }
  }

  return rows.sort((a, b) => a.rank - b.rank);
}
