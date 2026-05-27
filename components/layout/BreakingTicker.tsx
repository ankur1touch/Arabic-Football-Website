"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/store/hooks";
import type { Locale } from "@/store/features/localeSlice";
import { tickerHeadlines } from "@/lib/ticker-headlines";

export function BreakingTicker({ locale }: { locale: Locale }) {
  const t = useTranslations("ticker");
  const articles = useAppSelector((s) => s.news.articles);

  const defaults = useMemo(
    () => [t("default1"), t("default2"), t("default3"), t("default4")],
    [t]
  );

  const items = useMemo(() => {
    if (articles.length === 0) return defaults;
    const headlines = tickerHeadlines(articles, locale);
    return headlines.length > 0 ? headlines : defaults;
  }, [articles, locale, defaults]);

  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-b border-kora-alert/20 bg-kora-alert/10 py-1.5">
      <div className="flex h-8 items-center">
        <span className="z-10 mx-3 shrink-0 rounded bg-kora-alert px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
          {t("label")}
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee flex whitespace-nowrap will-change-transform">
            {doubled.map((item, i) => (
              <span key={i} className="shrink-0 px-6 text-sm font-medium text-slate-200">
                {item}
                <span className="mx-3 opacity-40">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
