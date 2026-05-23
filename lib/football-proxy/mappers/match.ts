import type { ApiFixtureItem } from "@/types/api-football/fixture";
import type { Match, MatchStatus } from "@/types/match";

const LIVE_SHORT = new Set(["1H", "2H", "HT", "ET", "BT", "P", "LIVE"]);
const FINISHED_SHORT = new Set(["FT", "AET", "PEN"]);

function mapStatus(short: string): MatchStatus {
  const s = short?.toUpperCase() ?? "";
  if (LIVE_SHORT.has(s)) return "live";
  if (FINISHED_SHORT.has(s)) return "finished";
  if (s === "NS" || s === "TBD" || s === "PST") return "upcoming";
  return "upcoming";
}

function formatKsaTime(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Riyadh",
      hour12: false,
    }).format(new Date(isoDate));
  } catch {
    return "";
  }
}

export function mapFixtureToMatch(item: ApiFixtureItem, leagueLabel?: string): Match {
  const status = mapStatus(item.fixture.status.short);
  const homeScore = item.goals.home ?? undefined;
  const awayScore = item.goals.away ?? undefined;

  return {
    id: String(item.fixture.id),
    fixtureId: item.fixture.id,
    homeTeamId: item.teams.home.id,
    awayTeamId: item.teams.away.id,
    homeTeamLogo: item.teams.home.logo,
    awayTeamLogo: item.teams.away.logo,
    homeTeam: item.teams.home.name,
    homeTeamAr: item.teams.home.name,
    awayTeam: item.teams.away.name,
    awayTeamAr: item.teams.away.name,
    homeScore: homeScore ?? undefined,
    awayScore: awayScore ?? undefined,
    status,
    minute: item.fixture.status.elapsed ?? undefined,
    league: leagueLabel ?? item.league.name,
    leagueAr: leagueLabel ?? item.league.name,
    kickoff: item.fixture.date,
    kickoffKsa: formatKsaTime(item.fixture.date),
    round: item.league.round ?? item.fixture.round,
    venue: item.fixture.venue?.name,
    group: item.league.round,
  };
}

export function mapFixturesList(
  items: ApiFixtureItem[],
  leagueLabel?: string
): Match[] {
  return items.map((item) => mapFixtureToMatch(item, leagueLabel));
}
