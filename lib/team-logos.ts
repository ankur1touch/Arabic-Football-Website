import type { Team } from "@/types/team";

const SLUG_LOGOS: Record<string, number> = {
  argentina: 26,
  france: 2,
  spain: 9,
  england: 10,
  morocco: 31,
  saudi: 23,
  brazil: 6,
  germany: 11,
  portugal: 27,
  netherlands: 24,
  italy: 768,
  usa: 2384,
  mexico: 16,
  japan: 15,
  "south-korea": 17,
  croatia: 3,
  belgium: 1,
};

export function resolveTeamLogo(team: Pick<Team, "id" | "logo" | "name">): string {
  if (team.logo) return team.logo;
  if (/^\d+$/.test(team.id)) {
    return `https://media.api-sports.io/football/teams/${team.id}.png`;
  }
  const slugId = SLUG_LOGOS[team.id];
  if (slugId) {
    return `https://media.api-sports.io/football/teams/${slugId}.png`;
  }
  return "";
}
