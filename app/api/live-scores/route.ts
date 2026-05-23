import { NextResponse } from "next/server";
import { fetchLiveMatches } from "@/lib/football-proxy/services";
import { withMockFallback } from "@/lib/football-proxy/fallback";

export const revalidate = 60;

export async function GET() {
  const all = await withMockFallback(fetchLiveMatches, () => []);
  return NextResponse.json({ matches: all });
}

export async function POST() {
  return GET();
}
