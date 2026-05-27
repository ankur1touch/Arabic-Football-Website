import { NextRequest, NextResponse } from "next/server";
import { readJsonData } from "@/lib/data";
import { getAggregatedNews } from "@/lib/news-feed";
import type { Country } from "@/types/country";
import type { NewsArticle } from "@/types/news";

function matchesCountry(article: NewsArticle, country: Country): boolean {
  const haystack = `${article.titleEn} ${article.titleAr} ${article.excerptEn} ${article.excerptAr} ${article.category}`.toLowerCase();
  return country.keywords.some((k) => haystack.includes(k.toLowerCase()));
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const countries = readJsonData<Country[]>("countries.json");
  const country = countries.find((c) => c.id === id);
  if (!country) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const news = (await getAggregatedNews()).filter((a) => matchesCountry(a, country));

  return NextResponse.json({ country, news }, {
    headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
  });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  return GET(req, ctx);
}
