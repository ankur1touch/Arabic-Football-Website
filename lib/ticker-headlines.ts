import type { NewsArticle } from "@/types/news";

const FOOTBALL_KEYWORDS =
  /football|soccer|goal|match|league|cup|fifa|uefa|premier|transfer|world cup|كرة|مبارا|كأس|هدف|انتقال/i;

export function tickerHeadlines(
  articles: NewsArticle[],
  locale: "ar" | "en",
  limit = 10
): string[] {
  return articles
    .filter((n) => FOOTBALL_KEYWORDS.test(locale === "ar" ? n.titleAr : n.titleEn))
    .slice(0, limit)
    .map((n) => (locale === "ar" ? n.titleAr : n.titleEn));
}
