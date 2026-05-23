import { NextResponse } from "next/server";
import { withMockFallback } from "@/lib/football-proxy/fallback";
import {
  fetchFixtureDetail,
  resolveFixtureDetailFallback,
} from "@/lib/football-proxy/services";
import { buildMockFixtureDetail, isMockMatchId } from "@/lib/mock-match-data";

export const revalidate = 60;

type Params = { params: Promise<{ id: string }> };

/** @deprecated Use /api/matches/[id] — kept for backward compatibility */
export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

  if (isMockMatchId(id)) {
    const detail = buildMockFixtureDetail(id);
    if (!detail) {
      return NextResponse.json({ error: "Match not found" }, { status: 404 });
    }
    return NextResponse.json({ detail });
  }

  const fixtureId = Number(id);
  if (Number.isNaN(fixtureId)) {
    return NextResponse.json({ error: "Invalid fixture id" }, { status: 400 });
  }

  try {
    const detail = await withMockFallback(
      () => fetchFixtureDetail(fixtureId),
      () => resolveFixtureDetailFallback(fixtureId)
    );
    return NextResponse.json({ detail });
  } catch {
    const detail = await resolveFixtureDetailFallback(fixtureId);
    return NextResponse.json({ detail });
  }
}

export async function POST(_request: Request, ctx: Params) {
  return GET(_request, ctx);
}
