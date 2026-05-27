import { NextResponse } from "next/server";
import { fetchFifaRankings } from "@/lib/football-proxy/services";

export const revalidate = 86400;

const CACHE = "s-maxage=86400, stale-while-revalidate=3600";

export async function GET() {
  try {
    const rankings = await fetchFifaRankings();
    return NextResponse.json(rankings, { headers: { "Cache-Control": CACHE } });
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST() {
  return GET();
}
