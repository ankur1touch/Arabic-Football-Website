import { NextResponse } from "next/server";
import { proxyGet } from "@/lib/football-proxy/client";
import { footballEndpoints } from "@/lib/football-proxy/endpoints";
import { getWcSeason } from "@/lib/football-proxy/config";
import { unwrapResponse } from "@/types/api-football/common";

export const revalidate = 3600;

export async function POST() {
  try {
    const raw = await proxyGet(footballEndpoints.leagues, {
      season: getWcSeason(),
    });
    const leagues = unwrapResponse(raw);
    return NextResponse.json({ leagues });
  } catch {
    return NextResponse.json({ leagues: [] });
  }
}
