import { NextResponse } from "next/server";
import { readJsonData } from "@/lib/data";
import type { NewsArticle } from "@/types/news";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { articles } = readJsonData<{ articles: NewsArticle[] }>("news.json");
  const items = articles.slice(0, 20);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Kora — Arabic Football Portal</title>
    <link>${baseUrl}/ar</link>
    <description>Latest football news in Arabic and English</description>
    <language>ar</language>
    ${items
      .map(
        (a) => `
    <item>
      <title><![CDATA[${a.titleEn}]]></title>
      <link>${baseUrl}/en/news/${a.slug}</link>
      <description><![CDATA[${a.excerptEn}]]></description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/en/news/${a.slug}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
    },
  });
}
