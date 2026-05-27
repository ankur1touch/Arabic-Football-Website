import { NextResponse } from "next/server";
import { getAggregatedNews } from "@/lib/news-feed";

export const revalidate = 300;

export async function POST(request: Request) {
  let category: string | undefined;
  try {
    const body = await request.json();
    category = body?.category;
  } catch {
    /* no body */
  }

  const articles = await getAggregatedNews(category);

  return NextResponse.json(
    { articles },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" } }
  );
}
