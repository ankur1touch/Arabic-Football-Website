"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews } from "@/store/features/newsSlice";
import type { Locale } from "@/store/features/localeSlice";
import type { NewsCategory } from "@/types/news";
import { NewsFilters } from "./NewsFilters";
import { NewsCard } from "./NewsCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { isVideoArticle } from "@/lib/news-media";

export type NewsFilter = NewsCategory | "all" | "videos";

export function NewsListingClient({
  locale,
  defaultCategory = "all",
}: {
  locale: Locale;
  defaultCategory?: NewsFilter;
}) {
  const t = useTranslations("news");
  const tHome = useTranslations("home");
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const { articles, status } = useAppSelector((s) => s.news);
  const initial =
    searchParams.get("filter") === "videos"
      ? "videos"
      : defaultCategory !== "all"
        ? defaultCategory
        : "all";
  const [category, setCategory] = useState<NewsFilter>(initial);

  useEffect(() => {
    dispatch(fetchNews());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams.get("filter") === "videos") setCategory("videos");
  }, [searchParams]);

  const filtered =
    category === "all"
      ? articles
      : category === "videos"
        ? articles.filter((a) => isVideoArticle(a))
        : articles.filter((a) => a.category === category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-3xl text-white">{t("allNews")}</h1>
        {status === "succeeded" && (
          <p className="text-sm text-slate-400">
            {filtered.length}{" "}
            {locale === "ar" ? "مقال" : "articles"}
          </p>
        )}
      </div>
      <NewsFilters active={category} onChange={setCategory} locale={locale} />

      {status === "loading" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      )}

      {status === "failed" && (
        <div className="mt-8 text-center">
          <Button onClick={() => dispatch(fetchNews())}>{tHome("retry")}</Button>
        </div>
      )}

      {status === "succeeded" && filtered.length === 0 && (
        <p className="mt-8 text-center text-slate-400">{tHome("noResults")}</p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article) => (
          <NewsCard key={article.id} article={article} locale={locale} />
        ))}
      </div>
    </div>
  );
}
