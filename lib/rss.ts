import Parser from "rss-parser";
import type { NewsArticle } from "@/types/news";
import { translateBatch } from "./translate";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
    ],
  },
});

export const FEEDS = [
  "https://feeds.bbci.co.uk/sport/football/rss.xml",
  "https://www.skysports.com/rss/12040",
  "https://www.skysports.com/rss/12041",
  "https://www.goal.com/feeds/en/news",
  "https://www.espn.com/espn/rss/soccer/news",
  "https://www.theguardian.com/football/rss",
  "https://www.fifa.com/fifaplus/en/rss",
  "https://www.90min.com/posts.rss",
  "https://e00-marca.uecdn.es/rss/en/index.xml",
  "https://www.marca.com/rss/futbol.xml",
];

function deduplicateByTitle<T extends { title?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = (item.title ?? "").toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function pickMediaUrl(entry: unknown): string | undefined {
  if (!entry || typeof entry !== "object") return undefined;
  const media = entry as { $?: { url?: string }; url?: string };
  return media.$?.url ?? media.url;
}

function upgradeImageUrl(url: string): string {
  return url
    .replace(
      /ichef\.bbci\.co\.uk\/ace\/standard\/\d+\//,
      "ichef.bbci.co.uk/ace/standard/976/"
    )
    .replace(/width=\d+/, "width=1200");
}

function extractImageUrl(item: Parser.Item): string | undefined {
  const enclosure = item.enclosure;
  if (enclosure?.url && enclosure.type?.startsWith("image")) {
    return upgradeImageUrl(enclosure.url);
  }

  const extended = item as Parser.Item & {
    mediaThumbnail?: unknown[];
    mediaContent?: unknown[];
  };

  for (const thumb of extended.mediaThumbnail ?? []) {
    const url = pickMediaUrl(thumb);
    if (url) return upgradeImageUrl(url);
  }

  for (const media of extended.mediaContent ?? []) {
    const url = pickMediaUrl(media);
    if (url) return upgradeImageUrl(url);
  }

  const legacy = item as Parser.Item & {
    "media:content"?: { $?: { url?: string } };
    mediaContent?: { $?: { url?: string } };
  };
  const legacyUrl =
    legacy["media:content"]?.$?.url ??
    (legacy.mediaContent && !Array.isArray(legacy.mediaContent)
      ? legacy.mediaContent.$?.url
      : undefined);
  if (legacyUrl) return upgradeImageUrl(legacyUrl);

  const html = item.content ?? item.summary ?? item.contentSnippet ?? "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] ? upgradeImageUrl(match[1]) : undefined;
}

export async function aggregateFeeds(): Promise<
  Pick<
    NewsArticle,
    | "titleAr"
    | "titleEn"
    | "excerptAr"
    | "excerptEn"
    | "slug"
    | "source"
    | "publishedAt"
    | "imageUrl"
  >[]
> {
  const results = await Promise.allSettled(
    FEEDS.map((url) => parser.parseURL(url))
  );

  const items = results
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof parser.parseURL>>> => r.status === "fulfilled")
    .flatMap((r) => r.value.items ?? []);

  const unique = deduplicateByTitle(items);
  const sorted = unique.sort(
    (a, b) => new Date(b.pubDate ?? 0).getTime() - new Date(a.pubDate ?? 0).getTime()
  );

  const batch = sorted.slice(0, 80).map((item) => ({
    titleEn: item.title ?? "",
    excerptEn: item.contentSnippet ?? item.summary ?? "",
    source: item.creator ?? "RSS",
    publishedAt: item.pubDate ?? new Date().toISOString(),
    slug: (item.title ?? "article")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 60),
    imageUrl: extractImageUrl(item),
  }));

  return translateBatch(batch);
}

/** RSS fetch with timeout — avoids blocking API routes for 10–20s */
export async function aggregateFeedsWithTimeout(
  timeoutMs = 8000
): Promise<
  Pick<
    NewsArticle,
    | "titleAr"
    | "titleEn"
    | "excerptAr"
    | "excerptEn"
    | "slug"
    | "source"
    | "publishedAt"
    | "imageUrl"
  >[]
> {
  return Promise.race([
    aggregateFeeds(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("RSS fetch timeout")), timeoutMs)
    ),
  ]);
}
