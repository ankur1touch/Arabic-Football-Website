import { NextResponse } from "next/server";
import { fetchAllWcMatches } from "@/lib/football-proxy/services";
import {
  withMockFallback,
  mockMatches,
  mergeMatchCoverage,
} from "@/lib/football-proxy/fallback";

export const revalidate = 60;

export async function POST() {
  const raw = await withMockFallback(fetchAllWcMatches, mockMatches);
  const matches = mergeMatchCoverage(raw);
  return NextResponse.json({ matches });
}
