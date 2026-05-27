import { NextResponse } from "next/server";
import { readJsonData } from "@/lib/data";
import type { Country } from "@/types/country";

export const revalidate = 3600;

export async function GET() {
  const countries = readJsonData<Country[]>("countries.json");
  return NextResponse.json(countries, {
    headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=7200" },
  });
}
