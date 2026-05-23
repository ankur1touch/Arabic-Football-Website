"use client";

import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store/hooks";
import type { Locale } from "@/store/features/localeSlice";

export function LiveMatchTicker({ locale }: { locale: Locale }) {
  const t = useTranslations("news");
  const articles = useAppSelector((s) => s.news.articles);
  const breaking = articles.filter((a) => a.breaking).slice(0, 6);
  const headlines =
    breaking.length > 0
      ? breaking
      : articles.slice(0, 6);

  if (headlines.length === 0) return null;

  const items = [...headlines, ...headlines];

  return (
    <div className="overflow-hidden bg-kora-green py-2 text-sm font-medium text-white">
      <div className="flex animate-ticker whitespace-nowrap">
        {items.map((item, i) => (
          <span key={`${item.id}-${i}`} className="mx-6 inline-flex items-center gap-2">
            <span className="font-bold">{t("breaking")}:</span>
            <span>{locale === "ar" ? item.titleAr : item.titleEn}</span>
            <span className="opacity-50">|</span>
          </span>
        ))}
      </div>
    </div>
  );
}
