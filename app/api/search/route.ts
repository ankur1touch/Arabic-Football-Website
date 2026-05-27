import { NextResponse } from "next/server";
import { readJsonData } from "@/lib/data";
import type { NewsArticle } from "@/types/news";
import type { Team } from "@/types/team";
import type { Player } from "@/types/player";
import type { Match } from "@/types/match";

export const revalidate = 60;

const CACHE = "s-maxage=60, stale-while-revalidate=120";

function matchesQuery(text: string, q: string): boolean {
  return text.toLowerCase().includes(q.toLowerCase());
}

async function runSearch(q: string, request: Request) {
  if (!q) {
    return { news: [], teams: [], players: [], matches: [] };
  }

  const news = readJsonData<{ articles: NewsArticle[] }>("news.json").articles.filter(
    (a) =>
      matchesQuery(a.titleEn, q) ||
      matchesQuery(a.titleAr, q) ||
      matchesQuery(a.excerptEn, q) ||
      matchesQuery(a.excerptAr, q)
  );

  const teams = readJsonData<{ teams: Team[] }>("teams.json").teams.filter(
    (t) => matchesQuery(t.name, q) || matchesQuery(t.nameAr, q)
  );

  const players = readJsonData<{ players: Player[] }>("players.json").players.filter(
    (p) =>
      matchesQuery(p.name, q) ||
      matchesQuery(p.nameAr, q) ||
      matchesQuery(p.club, q)
  );

  let matches: Match[] = [];
  try {
    const res = await fetch(new URL("/api/matches", request.url).toString(), {
      method: "POST",
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = (await res.json()) as { matches: Match[] };
      matches = data.matches.filter(
        (m) =>
          matchesQuery(m.homeTeam, q) ||
          matchesQuery(m.awayTeam, q) ||
          matchesQuery(m.homeTeamAr, q) ||
          matchesQuery(m.awayTeamAr, q) ||
          matchesQuery(m.league, q)
      );
    }
  } catch {
    matches = [];
  }

  return { news, teams, players, matches };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const result = await runSearch(q, request);
  return NextResponse.json(result, { headers: { "Cache-Control": CACHE } });
}

export async function POST(request: Request) {
  let q = "";
  try {
    const body = await request.json();
    q = String(body?.q ?? "").trim();
  } catch {
    /* empty */
  }
  const result = await runSearch(q, request);
  return NextResponse.json(result, { headers: { "Cache-Control": CACHE } });
}
