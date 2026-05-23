import type { ApiFootballTeam } from "@/types/api-football/team";
import type { Team, Confederation } from "@/types/team";

function guessConfederation(country?: string): Confederation {
  const c = (country ?? "").toLowerCase();
  if (["brazil", "argentina", "uruguay", "colombia", "ecuador", "chile", "peru", "paraguay"].some((x) => c.includes(x)))
    return "CONMEBOL";
  if (["saudi", "japan", "korea", "iran", "australia", "qatar"].some((x) => c.includes(x)))
    return "AFC";
  if (["morocco", "senegal", "nigeria", "egypt", "ghana", "cameroon"].some((x) => c.includes(x)))
    return "CAF";
  if (["usa", "mexico", "canada", "costa"].some((x) => c.includes(x)))
    return "CONCACAF";
  if (["france", "germany", "spain", "england", "italy", "portugal", "netherlands", "belgium"].some((x) => c.includes(x)))
    return "UEFA";
  return "UEFA";
}

export function mapApiTeamToTeam(item: ApiFootballTeam, index: number): Team {
  const t = item.team;
  return {
    id: String(t.id),
    name: t.name,
    nameAr: t.name,
    logo: t.logo ?? "",
    code: t.code ?? "",
    confederation: guessConfederation(t.country),
    fifaRank: index + 1,
    coach: "—",
    coachAr: "—",
    form: [],
    squad: [],
    stats: {
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
    },
  };
}

export function mapTeamsList(items: ApiFootballTeam[]): Team[] {
  return items.map((item, i) => mapApiTeamToTeam(item, i));
}
