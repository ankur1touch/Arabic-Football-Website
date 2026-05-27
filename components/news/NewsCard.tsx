"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { NewsArticle } from "@/types/news";
import type { Locale } from "@/store/features/localeSlice";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { RelativeTime } from "@/components/ui/RelativeTime";
import { NewsThumbnail } from "@/components/ui/NewsThumbnail";
import { isVideoArticle } from "@/lib/news-media";

export function NewsCard({
  article,
  locale,
}: {
  article: NewsArticle;
  locale: Locale;
}) {
  const t = useTranslations("news");
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group kora-card block overflow-hidden rounded-2xl transition hover:border-kora-green/40"
    >
      <NewsThumbnail
        article={article}
        className="h-44"
        sizes="(max-width: 768px) 100vw, 400px"
      />
      <div className="p-5">
        <div className="mb-2 flex flex-wrap gap-2">
          <Tag label={article.category.replace(/-/g, " ")} slug={article.category} />
          {article.featured && <Badge variant="gold">{t("featured")}</Badge>}
          {isVideoArticle(article) && (
            <Badge variant="live">
              {locale === "ar" ? "فيديو" : "Video"}
            </Badge>
          )}
        </div>
        <h3 className="line-clamp-2 text-lg font-bold text-slate-100 group-hover:text-kora-green">
          {locale === "ar" ? article.titleAr : article.titleEn}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-400">
          {locale === "ar" ? article.excerptAr : article.excerptEn}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          {article.source} • <RelativeTime date={article.publishedAt} locale={locale} />
        </p>
      </div>
    </Link>
  );
}

