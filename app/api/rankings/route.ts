import { NextResponse } from "next/server";
import { readJsonData } from "@/lib/data";
import type { RankingsData } from "@/types/ranking";

export const revalidate = 600;

const CACHE = "s-maxage=600, stale-while-revalidate=1800";

export async function POST() {
  const data = readJsonData<RankingsData>("rankings.json");
  return NextResponse.json(data, { headers: { "Cache-Control": CACHE } });
}

export async function GET() {
  return POST();
}
