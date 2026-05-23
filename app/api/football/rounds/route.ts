import { NextResponse } from "next/server";
import { fetchWcRounds } from "@/lib/football-proxy/services";

export const revalidate = 300;

export async function POST() {
  try {
    const rounds = await fetchWcRounds();
    return NextResponse.json({ rounds });
  } catch {
    return NextResponse.json({ rounds: [] });
  }
}
