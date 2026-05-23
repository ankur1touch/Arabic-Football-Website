import { NextResponse } from "next/server";
import { fetchWcTeams } from "@/lib/football-proxy/services";
import { withMockFallback, mockTeams } from "@/lib/football-proxy/fallback";

export const revalidate = 300;

export async function POST() {
  const teams = await withMockFallback(fetchWcTeams, mockTeams);
  return NextResponse.json({ teams });
}
