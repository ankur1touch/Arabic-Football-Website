import { NextRequest, NextResponse } from "next/server";
import {
  fetchWcTopScorerPlayers,
  searchPlayers,
} from "@/lib/football-proxy/services";
import { withMockFallback, mockPlayers } from "@/lib/football-proxy/fallback";

export const revalidate = 300;

export async function POST(request: NextRequest) {
  let search: string | undefined;
  try {
    const body = await request.json();
    search = body?.search;
  } catch {
    search = undefined;
  }

  const players = await withMockFallback(
    () => (search ? searchPlayers(search) : fetchWcTopScorerPlayers()),
    mockPlayers
  );

  return NextResponse.json({ players });
}
