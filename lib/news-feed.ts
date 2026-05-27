import { readJsonData } from "@/lib/data";
import { aggregateFeedsWithTimeout } from "@/lib/rss";
import type { NewsArticle, NewsCategory } from "@/types/news";

const FOOTBALL_KEYWORDS =
  /football|soccer|goal|match|league|cup|fifa|uefa|premier|la liga|serie a|bundesliga|champions|transfer|manager|coach|squad|fixture|world cup|كرة|مبارا|كأس|هدف|انتقال|دوري|منتخب/i;

const RSS_LIMIT = 35;

function inferCategory(text: string, source: string): NewsCategory {
  const hay = `${text} ${source}`.toLowerCase();
  if (/world cup|fifa 2026|كأس العالم/.test(hay)) return "world-cup";
  if (/transfer|signing|deal|صفقة|انتقال/.test(hay)) return "transfers";
  if (/champions league|ucl|أبطال أوروبا/.test(hay)) return "champions-league";
  if (/premier league|\bepl\b|الإنجليزي|الدوري الإنجليزي/.test(hay)) return "premier-league";
  if (/la liga|الإسباني|الliga/.test(hay)) return "la-liga";
  if (/breaking|عاجل/.test(hay)) return "breaking";
  return "general";
}

function mergeRssArticles(
  seed: NewsArticle[],
  feeds: Awaited<ReturnType<typeof aggregateFeedsWithTimeout>>
): NewsArticle[] {
  const slugs = new Set(seed.map((a) => a.slug));

  const rssArticles: NewsArticle[] = feeds
    .filter((item) => FOOTBALL_KEYWORDS.test(`${item.titleEn} ${item.excerptEn}`))
    .slice(0, RSS_LIMIT)
    .map((item, i) => ({
      id: `rss-${i}-${item.slug.slice(0, 24)}`,
      slug: item.slug,
      titleAr: item.titleAr || item.titleEn,
      titleEn: item.titleEn,
      excerptAr: item.excerptAr || item.excerptEn,
      excerptEn: item.excerptEn,
      bodyAr: item.excerptAr || item.excerptEn,
      bodyEn: item.excerptEn,
      source: item.source,
      category: inferCategory(`${item.titleEn} ${item.excerptEn}`, item.source),
      imageUrl: item.imageUrl,
      publishedAt: item.publishedAt,
      breaking: i < 5,
    }))
    .filter((a) => !slugs.has(a.slug));

  return [...rssArticles, ...seed].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getAggregatedNews(
  category?: string
): Promise<NewsArticle[]> {
  const data = readJsonData<{ articles: NewsArticle[] }>("news.json");
  let articles = data.articles;

  const rssDisabled = process.env.DISABLE_RSS === "true";
  if (!rssDisabled) {
    try {
      const feeds = await aggregateFeedsWithTimeout(12000);
      articles = mergeRssArticles(data.articles, feeds);
    } catch {
      articles = data.articles;
    }
  }

  const VALID: NewsCategory[] = [
    "breaking",
    "la-liga",
    "premier-league",
    "champions-league",
    "world-cup",
    "transfers",
    "general",
  ];

  if (category && category !== "all" && VALID.includes(category as NewsCategory)) {
    articles = articles.filter((a) => a.category === category);
  }

  return articles;
}

export async function getArticleBySlug(slug: string): Promise<NewsArticle | undefined> {
  const articles = await getAggregatedNews();
  return articles.find((a) => a.slug === slug);
}
