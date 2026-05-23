export function getProxyBaseUrl(): string {
  return (
    process.env.FOOTBALL_PROXY_BASE_URL?.replace(/\/$/, "") ||
    "https://api.labenditaec.com"
  );
}

export function getWcLeagueId(): number {
  return Number(process.env.FOOTBALL_WC_LEAGUE_ID ?? "1");
}

export function getWcSeason(): number {
  return Number(process.env.FOOTBALL_WC_SEASON ?? "2026");
}

export function getProxyTimeoutMs(): number {
  return Number(process.env.FOOTBALL_PROXY_TIMEOUT_MS ?? "12000");
}

export function shouldUseMockFallback(): boolean {
  return process.env.USE_MOCK_FALLBACK !== "false";
}

export const WC_TOURNAMENT_ID = "wc2026";

export const worldCupConfig = {
  id: WC_TOURNAMENT_ID,
  leagueId: getWcLeagueId(),
  season: getWcSeason(),
  name: "FIFA World Cup 2026",
  nameAr: "كأس العالم 2026",
};
