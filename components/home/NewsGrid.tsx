"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import type { Locale } from "@/store/features/localeSlice";
import { Skeleton } from "@/components/ui/Skeleton";
import { NewsThumbnail } from "@/components/ui/NewsThumbnail";
import { Badge } from "@/components/ui/Badge";
import { formatDistanceToNow } from "@/lib/format";
import { isVideoArticle } from "@/lib/news-media";

import type { NewsArticle } from "@/types/news";

export function NewsGrid({
  locale,
  initialArticles = [],
}: {
  locale: Locale;
  initialArticles?: NewsArticle[];
}) {
  const t = useTranslations("news");
  const { articles: storeArticles, status } = useAppSelector((s) => s.news);
  const articles = storeArticles.length > 0 ? storeArticles : initialArticles;

  if (status === "loading" && articles.length === 0) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (status === "succeeded" && articles.length === 0) {
    return (
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            TOP STORIES — {t("topStories")}
          </h2>
          <Link href="/news" className="text-sm text-kora-green hover:underline">
            {t("allNews")}
          </Link>
        </div>
        <p className="kora-muted rounded-xl kora-card p-6 text-center text-sm">
          {locale === "ar" ? "لا توجد أخبار حالياً" : "No news available right now"}
        </p>
      </section>
    );
  }

  const featured =
    articles.find((a) => a.featured) ??
    articles.find((a) => !a.id.startsWith("rss-")) ??
    articles[0];
  const rest = articles.filter((a) => a.id !== featured?.id).slice(0, 14);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          TOP STORIES — {t("topStories")}
        </h2>
        <Link
          href="/news"
          className="flex shrink-0 items-center gap-1 text-sm font-medium text-kora-green hover:underline"
        >
          {t("allNews")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {featured && (
        <Link
          href={`/news/${featured.slug}`}
          className="group kora-card mb-6 block overflow-hidden rounded-2xl transition hover:border-kora-green/40"
        >
          <NewsThumbnail
            article={featured}
            className="h-52 md:h-60"
            sizes="(max-width: 768px) 100vw, 66vw"
          />
          <div className="p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              {featured.featured && <Badge variant="gold">{t("featured")}</Badge>}
              {isVideoArticle(featured) && (
                <Badge variant="live">{t("watchHighlights")}</Badge>
              )}
            </div>
            <h3 className="mb-1 text-lg font-bold text-slate-100 group-hover:text-kora-green">
              {locale === "ar" ? featured.titleAr : featured.titleEn}
            </h3>
            <p className="line-clamp-2 text-sm text-slate-400">
              {locale === "ar" ? featured.excerptAr : featured.excerptEn}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              {featured.source} • {formatDistanceToNow(featured.publishedAt, locale)}
            </p>
          </div>
        </Link>
      )}

      <ol className="space-y-3">
        {rest.map((article) => (
          <li key={article.id}>
            <Link
              href={`/news/${article.slug}`}
              className="group flex gap-4 rounded-xl border border-transparent p-2 transition hover:border-white/10 hover:bg-white/5"
            >
              <NewsThumbnail
                article={article}
                className="h-20 w-28 shrink-0 rounded-lg"
                sizes="112px"
              />
              <div className="min-w-0 flex-1">
                <h4 className="line-clamp-2 font-semibold text-slate-100 group-hover:text-kora-green">
                  {locale === "ar" ? article.titleAr : article.titleEn}
                </h4>
                <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                  {locale === "ar" ? article.excerptAr : article.excerptEn}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {article.source} • {formatDistanceToNow(article.publishedAt, locale)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

