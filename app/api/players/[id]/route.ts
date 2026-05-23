import { NextResponse } from "next/server";
import { mockPlayerDetail, withMockFallback } from "@/lib/football-proxy/fallback";
import { fetchPlayerDetail } from "@/lib/football-proxy/services";

export const revalidate = 300;

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const playerId = Number(id);

  if (Number.isNaN(playerId)) {
    return NextResponse.json({ error: "Invalid player id" }, { status: 400 });
  }

  try {
    const data = await withMockFallback(
      () => fetchPlayerDetail(playerId),
      () => mockPlayerDetail(id)
    );
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=300" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load player" },
      { status: 502 }
    );
  }
}

export async function POST(_request: Request, ctx: Params) {
  return GET(_request, ctx);
}
