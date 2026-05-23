import type { Match } from "@/types/match";
import type {
  FixtureDetail,
  FixtureEvent,
  FixtureLineup,
  FixtureStatRow,
} from "@/types/fixture-detail";
import { readJsonData } from "@/lib/data";

export function mockMatchesList(): Match[] {
  return readJsonData<{ matches: Match[] }>("matches.json").matches;
}

/** Resolve a mock match by slug (m6) or numeric fixtureId (1006). */
export function resolveMockMatch(id: string | number): Match | undefined {
  const matches = mockMatchesList();
  const raw = String(id);

  if (/^m\d+$/.test(raw)) {
    return matches.find((m) => m.id === raw);
  }

  const num = Number(raw);
  if (!Number.isNaN(num)) {
    return matches.find((m) => m.fixtureId === num);
  }

  return undefined;
}

export function isMockMatchId(id: string | number): boolean {
  return resolveMockMatch(id) !== undefined;
}

function buildLineups(match: Match): FixtureLineup[] {
  const homePlayers = [
    { id: 101, name: `${match.homeTeam} GK`, number: 1, position: "GK" },
    { id: 102, name: `${match.homeTeam} DEF`, number: 4, position: "DEF" },
    { id: 103, name: `${match.homeTeam} MID`, number: 8, position: "MID" },
    { id: 104, name: `${match.homeTeam} FWD`, number: 9, position: "FWD" },
  ];
  const awayPlayers = [
    { id: 201, name: `${match.awayTeam} GK`, number: 1, position: "GK" },
    { id: 202, name: `${match.awayTeam} DEF`, number: 5, position: "DEF" },
    { id: 203, name: `${match.awayTeam} MID`, number: 10, position: "MID" },
    { id: 204, name: `${match.awayTeam} FWD`, number: 11, position: "FWD" },
  ];

  return [
    {
      team: match.homeTeam,
      teamId: match.homeTeamId,
      formation: "4-3-3",
      startXI: homePlayers,
      substitutes: [],
    },
    {
      team: match.awayTeam,
      teamId: match.awayTeamId,
      formation: "4-4-2",
      startXI: awayPlayers,
      substitutes: [],
    },
  ];
}

function buildEvents(match: Match): FixtureEvent[] {
  const events: FixtureEvent[] = [];
  const homeGoals = match.homeScore ?? 0;
  const awayGoals = match.awayScore ?? 0;

  for (let i = 0; i < homeGoals; i++) {
    events.push({
      time: 12 + i * 25,
      team: match.homeTeam,
      teamId: match.homeTeamId,
      player: `${match.homeTeam} Scorer ${i + 1}`,
      playerId: 104,
      type: "Goal",
      detail: "Normal Goal",
    });
  }
  for (let i = 0; i < awayGoals; i++) {
    events.push({
      time: 30 + i * 20,
      team: match.awayTeam,
      teamId: match.awayTeamId,
      player: `${match.awayTeam} Scorer ${i + 1}`,
      playerId: 204,
      type: "Goal",
      detail: "Normal Goal",
    });
  }

  if (match.status === "live" && match.minute) {
    events.push({
      time: match.minute,
      team: match.homeTeam,
      teamId: match.homeTeamId,
      player: "Match in progress",
      type: "Status",
      detail: "Live",
    });
  }

  return events.sort((a, b) => a.time - b.time);
}

function buildStats(match: Match): FixtureStatRow[] {
  const h = match.homeScore ?? 0;
  const a = match.awayScore ?? 0;
  return [
    { type: "Ball Possession", home: `${45 + h * 5}%`, away: `${45 + a * 5}%` },
    { type: "Total Shots", home: 8 + h * 3, away: 6 + a * 3 },
    { type: "Shots on Goal", home: 3 + h, away: 2 + a },
    { type: "Corner Kicks", home: 4 + h, away: 3 + a },
    { type: "Fouls", home: 10, away: 12 },
  ];
}

function buildH2h(match: Match): Match[] {
  return mockMatchesList()
    .filter(
      (m) =>
        m.status === "finished" &&
        m.id !== match.id &&
        (m.homeTeam === match.homeTeam ||
          m.awayTeam === match.awayTeam ||
          m.homeTeam === match.awayTeam ||
          m.awayTeam === match.homeTeam)
    )
    .slice(0, 3);
}

export function buildFixtureDetailFromMatch(match: Match): FixtureDetail {
  const statusLabel =
    match.status === "live"
      ? "Live"
      : match.status === "finished"
        ? "Full Time"
        : "Scheduled";

  const h2h = buildH2h(match);
  const fallbackH2h = mockMatchesList()
    .filter((m) => m.status === "finished" && m.id !== match.id)
    .slice(0, 3);

  return {
    fixtureId: match.fixtureId ?? (Number(match.id.replace(/\D/g, "")) || 0),
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeTeamId: match.homeTeamId,
    awayTeamId: match.awayTeamId,
    homeTeamLogo: match.homeTeamLogo,
    awayTeamLogo: match.awayTeamLogo,
    homeScore: match.homeScore ?? null,
    awayScore: match.awayScore ?? null,
    status: statusLabel,
    date: match.kickoff,
    venue: match.venue ?? "Stadium TBD",
    round: match.round,
    league: match.league,
    lineups: buildLineups(match),
    events: buildEvents(match),
    stats: buildStats(match),
    h2h: h2h.length > 0 ? h2h : fallbackH2h,
  };
}

export function buildMockFixtureDetail(id: string | number): FixtureDetail | null {
  const match = resolveMockMatch(id);
  if (!match) return null;
  return buildFixtureDetailFromMatch(match);
}

/** Ensure list has finished/upcoming when proxy returns only live fixtures. */
export function mergeMatchCoverage(proxy: Match[]): Match[] {
  const mock = mockMatchesList();
  const out = [...proxy];
  const has = (status: Match["status"]) => out.some((m) => m.status === status);

  if (!has("finished")) {
    out.push(...mock.filter((m) => m.status === "finished"));
  }
  if (!has("upcoming")) {
    out.push(...mock.filter((m) => m.status === "upcoming"));
  }

  const seen = new Set<string>();
  return out.filter((m) => {
    const key = m.fixtureId ? String(m.fixtureId) : m.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
