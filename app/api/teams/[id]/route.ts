import { NextResponse } from "next/server";
import { mockTeamDetail, withMockFallback } from "@/lib/football-proxy/fallback";
import { fetchTeamDetail } from "@/lib/football-proxy/services";

export const revalidate = 300;

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const teamId = Number(id);

  if (Number.isNaN(teamId)) {
    return NextResponse.json({ error: "Invalid team id" }, { status: 400 });
  }

  try {
    const data = await withMockFallback(
      () => fetchTeamDetail(teamId),
      () => mockTeamDetail(id)
    );
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=300" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load team" },
      { status: 502 }
    );
  }
}

export async function POST(_request: Request, ctx: Params) {
  return GET(_request, ctx);
}
