import type { MetadataRoute } from "next";
import { readJsonData } from "@/lib/data";
import type { NewsArticle } from "@/types/news";
import type { Country } from "@/types/country";

const LOCALES = ["ar", "en"] as const;

const STATIC_PATHS = [
  "",
  "/news",
  "/transfers",
  "/world-cup",
  "/matches",
  "/standings",
  "/teams",
  "/players",
  "/search",
  "/live-scores",
  "/world-rankings",
  "/tournaments",
  "/about",
  "/contact",
  "/privacy",
  "/advertise",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const articles = readJsonData<{ articles: NewsArticle[] }>("news.json").articles;
  const countries = readJsonData<Country[]>("countries.json");

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "hourly" : "daily",
        priority: path === "" ? 1 : 0.7,
      });
    }

    for (const article of articles) {
      entries.push({
        url: `${baseUrl}/${locale}/news/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }

    for (const country of countries) {
      entries.push({
        url: `${baseUrl}/${locale}/country/${country.id}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
