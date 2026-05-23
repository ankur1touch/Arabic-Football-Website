import { NextResponse } from "next/server";
import { fetchWcTournaments } from "@/lib/football-proxy/services";
import { withMockFallback, mockTournaments } from "@/lib/football-proxy/fallback";

export const revalidate = 300;

export async function POST() {
  const tournaments = await withMockFallback(fetchWcTournaments, mockTournaments);
  return NextResponse.json({ tournaments });
}
