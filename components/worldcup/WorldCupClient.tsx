"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchNews } from "@/store/features/newsSlice";
import { fetchMatches } from "@/store/features/matchesSlice";
import type { Locale } from "@/store/features/localeSlice";
import { Badge } from "@/components/ui/Badge";
import { NewsCard } from "@/components/news/NewsCard";
import { MatchTickerStrip } from "@/components/home/MatchTickerStrip";
import { SkeletonList } from "@/components/ui/Skeleton";

const HOST_CITIES = [
  { city: "New York", cityAr: "نيويورك", country: "USA" },
  { city: "Los Angeles", cityAr: "لوس أنgeles", country: "USA" },
  { city: "Mexico City", cityAr: "مكسيكو سيتي", country: "Mexico" },
  { city: "Toronto", cityAr: "تورonto", country: "Canada" },
];

export function WorldCupClient({ locale }: { locale: Locale }) {
  const t = useTranslations("worldCup");
  const dispatch = useAppDispatch();
  const { articles, status: newsStatus } = useAppSelector((s) => s.news);
  const wcNews = articles.filter(
    (a) => a.category === "world-cup" || a.titleEn.toLowerCase().includes("world cup")
  );

  useEffect(() => {
    dispatch(fetchNews());
    dispatch(fetchMatches());
  }, [dispatch]);

  return (
    <>
      <section className="hero-gradient px-4 py-14">
        <div className="mx-auto max-w-7xl text-center">
          <Badge variant="wc" className="mb-4">
            FIFA 2026
          </Badge>
          <h1 className="font-display text-5xl text-white md:text-6xl">{t("title")}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">{t("subtitle")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/matches">
              <Badge variant="tournament">{t("fixtures")}</Badge>
            </Link>
            <Link href="/standings">
              <Badge variant="tournament">{t("standings")}</Badge>
            </Link>
            <Link href="/teams">
              <Badge variant="tournament">{t("teams")}</Badge>
            </Link>
          </div>
        </div>
      </section>

      <MatchTickerStrip locale={locale} />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <h2 className="font-display mb-6 text-2xl text-white">{t("hostCities")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOST_CITIES.map((c) => (
            <div key={c.city} className="kora-card rounded-2xl p-5 text-center">
              <span className="text-3xl">🏟️</span>
              <h3 className="font-display mt-2 text-lg text-white">
                {locale === "ar" ? c.cityAr : c.city}
              </h3>
              <p className="text-sm text-slate-400">{c.country}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12">
        <h2 className="font-display mb-6 text-2xl text-white">{t("news")}</h2>
        {newsStatus === "loading" ? (
          <SkeletonList count={4} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(wcNews.length ? wcNews : articles).slice(0, 6).map((a) => (
              <NewsCard key={a.id} article={a} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
