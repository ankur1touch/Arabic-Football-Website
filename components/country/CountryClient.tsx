"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/store/features/localeSlice";
import type { Country } from "@/types/country";
import type { NewsArticle } from "@/types/news";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { NewsCard } from "@/components/news/NewsCard";
import { SkeletonList } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";

export function CountryClient({
  locale,
  countryId,
}: {
  locale: Locale;
  countryId: string;
}) {
  const t = useTranslations("country");
  const [country, setCountry] = useState<Country | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/country/${countryId}`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        setCountry(data.country ?? null);
        setNews(data.news ?? []);
      })
      .catch(() => {
        setCountry(null);
        setNews([]);
      })
      .finally(() => setLoading(false));
  }, [countryId]);

  if (loading) return <SkeletonList count={6} className="mx-auto max-w-7xl px-4 py-8" />;
  if (!country) return <EmptyState message={t("notFound")} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="hero-gradient mb-8 flex flex-col items-center rounded-2xl p-8 text-center md:flex-row md:text-start md:gap-6">
        <TeamCrest
          name={locale === "ar" ? country.nameAr : country.nameEn}
          logo={country.logo}
          size="lg"
        />
        <div>
          <h1 className="font-display text-4xl text-white">
            {locale === "ar" ? country.nameAr : country.nameEn}
          </h1>
          <p className="mt-2 text-slate-300">{t("hubSubtitle")}</p>
          <Link
            href={`/teams/${country.teamId}`}
            className="mt-4 inline-block text-sm text-kora-green hover:underline"
          >
            {t("viewTeam")} →
          </Link>
        </div>
      </div>

      <h2 className="font-display mb-4 text-2xl text-white">{t("news")}</h2>
      {news.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {news.map((a) => (
            <NewsCard key={a.id} article={a} locale={locale} />
          ))}
        </div>
      ) : (
        <EmptyState message={t("noNews")} />
      )}
    </div>
  );
}
