import { NextResponse } from "next/server";
import { readJsonData } from "@/lib/data";
import { aggregateFeedsWithTimeout } from "@/lib/rss";
import type { NewsArticle } from "@/types/news";

export const revalidate = 300;

function mergeRssArticles(
  seed: NewsArticle[],
  feeds: Awaited<ReturnType<typeof aggregateFeedsWithTimeout>>
): NewsArticle[] {
  const rssArticles: NewsArticle[] = feeds.slice(0, 5).map((item, i) => ({
    id: `rss-${i}`,
    slug: item.slug,
    titleAr: item.titleAr,
    titleEn: item.titleEn,
    excerptAr: item.excerptAr,
    excerptEn: item.excerptEn,
    bodyAr: item.excerptAr,
    bodyEn: item.excerptEn,
    source: item.source,
    category: "general" as const,
    imageUrl: item.imageUrl,
    publishedAt: item.publishedAt,
    breaking: i < 3,
  }));
  const slugs = new Set(seed.map((a) => a.slug));
  return [...rssArticles.filter((a) => !slugs.has(a.slug)), ...seed];
}

export async function POST() {
  const data = readJsonData<{ articles: NewsArticle[] }>("news.json");

  if (process.env.ENABLE_RSS !== "true") {
    return NextResponse.json({ articles: data.articles });
  }

  try {
    const feeds = await aggregateFeedsWithTimeout(8000);
    return NextResponse.json({ articles: mergeRssArticles(data.articles, feeds) });
  } catch {
    return NextResponse.json({ articles: data.articles });
  }
}
