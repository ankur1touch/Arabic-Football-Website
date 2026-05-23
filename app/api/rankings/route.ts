import { NextResponse } from "next/server";
import { readJsonData } from "@/lib/data";
import type { RankingsData } from "@/types/ranking";

export async function POST() {
  const data = readJsonData<RankingsData>("rankings.json");
  return NextResponse.json(data);
}
