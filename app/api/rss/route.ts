import { NextResponse } from "next/server";
import { readJsonData } from "@/lib/data";
import { aggregateFeedsWithTimeout } from "@/lib/rss";
import type { NewsArticle } from "@/types/news";

export const revalidate = 300;

export async function POST() {
  try {
    const feeds = await aggregateFeedsWithTimeout(8000);
    if (feeds.length > 0) {
      return NextResponse.json({ headlines: feeds });
    }
  } catch {
    // fall through to mock
  }

  const data = readJsonData<{ articles: NewsArticle[] }>("news.json");
  const headlines = data.articles.slice(0, 10).map((a) => ({
    titleAr: a.titleAr,
    titleEn: a.titleEn,
    excerptAr: a.excerptAr,
    excerptEn: a.excerptEn,
    slug: a.slug,
    source: a.source,
    publishedAt: a.publishedAt,
  }));
  return NextResponse.json({ headlines });
}
