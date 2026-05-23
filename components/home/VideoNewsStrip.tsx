"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Play } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import type { Locale } from "@/store/features/localeSlice";
import { NewsThumbnail } from "@/components/ui/NewsThumbnail";
import { Badge } from "@/components/ui/Badge";
import { isVideoArticle } from "@/lib/news-media";
import { formatDistanceToNow } from "@/lib/format";

export function VideoNewsStrip({ locale }: { locale: Locale }) {
  const t = useTranslations("news");
  const { articles, status } = useAppSelector((s) => s.news);
  const videos = articles.filter((a) => isVideoArticle(a));

  if (status !== "succeeded" || videos.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Play className="h-4 w-4 text-kora-green" />
          {t("videoNews")}
        </h2>
        <Link href="/news?filter=videos" className="text-sm text-kora-green hover:underline">
          {t("allVideos")}
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {videos.slice(0, 4).map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group kora-card overflow-hidden rounded-2xl transition hover:border-kora-green/40"
          >
            <NewsThumbnail
              article={article}
              className="h-40"
              sizes="(max-width: 640px) 100vw, 400px"
            />
            <div className="p-4">
              <Badge variant="live" className="mb-2">
                {t("watchHighlights")}
              </Badge>
              <h3 className="line-clamp-2 font-semibold text-slate-100 group-hover:text-kora-green">
                {locale === "ar" ? article.titleAr : article.titleEn}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {article.source} • {formatDistanceToNow(article.publishedAt, locale)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
