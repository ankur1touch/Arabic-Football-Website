"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { NewsThumbnail } from "@/components/ui/NewsThumbnail";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { useAppSelector } from "@/store/hooks";
import type { Locale } from "@/store/features/localeSlice";
import { isVideoArticle } from "@/lib/news-media";
import { filterTodayMatches, filterNextUpcoming, formatKickoffLabel } from "@/lib/match-dates";
import type { NewsArticle } from "@/types/news";
import type { Match } from "@/types/match";
import { cn } from "@/lib/cn";

export function HeroSlider({
  locale,
  initialArticles = [],
  initialMatches = [],
}: {
  locale: Locale;
  initialArticles?: NewsArticle[];
  initialMatches?: Match[];
}) {
  const t = useTranslations();
  const storeMatches = useAppSelector((s) => s.matches.matches);
  const storeArticles = useAppSelector((s) => s.news.articles);
  const matches = storeMatches.length > 0 ? storeMatches : initialMatches;
  const articles = storeArticles.length > 0 ? storeArticles : initialArticles;
  const [index, setIndex] = useState(0);

  const todayMatch = filterTodayMatches(matches, 1)[0];
  const featuredNews = articles.filter((a) => a.featured || !a.id.startsWith("rss-")).slice(0, 3);
  const slides = [
    ...(todayMatch
      ? [{ type: "match" as const, data: todayMatch }]
      : filterNextUpcoming(matches, 1).map((m) => ({ type: "match" as const, data: m }))),
    ...featuredNews.map((a) => ({ type: "news" as const, data: a })),
  ].slice(0, 3);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  const firstNewsIndex = slides.findIndex((s) => s.type === "news");

  if (slides.length === 0) {
    return (
      <section className="hero-gradient px-4 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="font-display text-4xl text-white md:text-5xl">{t("site.tagline")}</h1>
          <p className="mt-3 text-slate-300">{t("home.heroSubtitle")}</p>
          <Link href="/news" className="mt-6 inline-block">
            <Button>{t("news.readNews")}</Button>
          </Link>
        </div>
      </section>
    );
  }

  const slide = slides[index];

  return (
    <section className="relative overflow-hidden">
      <div className="hero-gradient relative min-h-[320px] px-4 py-10 md:min-h-[380px]">
        <div className="mx-auto max-w-7xl">
          {slide.type === "match" ? (
            <div className="flex flex-col items-center text-center">
              <Badge variant="wc" className="mb-4">
                {slide.data.status === "live" ? t("match.live") : t("match.upcoming")}
              </Badge>
              <div className="flex items-center gap-6 md:gap-10">
                <div className="flex flex-col items-center gap-2">
                  <TeamCrest
                    name={locale === "ar" ? slide.data.homeTeamAr : slide.data.homeTeam}
                    logo={slide.data.homeTeamLogo}
                    size="lg"
                  />
                  <span className="font-display text-lg text-white">
                    {locale === "ar" ? slide.data.homeTeamAr : slide.data.homeTeam}
                  </span>
                </div>
                <div className="font-display text-4xl text-kora-gold md:text-5xl">
                  {slide.data.status === "live" && slide.data.homeScore !== undefined
                    ? `${slide.data.homeScore} - ${slide.data.awayScore}`
                    : "VS"}
                </div>
                <div className="flex flex-col items-center gap-2">
                  <TeamCrest
                    name={locale === "ar" ? slide.data.awayTeamAr : slide.data.awayTeam}
                    logo={slide.data.awayTeamLogo}
                    size="lg"
                  />
                  <span className="font-display text-lg text-white">
                    {locale === "ar" ? slide.data.awayTeamAr : slide.data.awayTeam}
                  </span>
                </div>
              </div>
              <p className="mt-4 text-slate-300">
                {formatKickoffLabel(slide.data.kickoff, locale)}
              </p>
              {slide.data.fixtureId && (
                <Link href={`/matches/${slide.data.fixtureId}`} className="mt-6">
                  <Button>{t("news.readMore")}</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid items-center gap-6 lg:grid-cols-2">
              <div className="relative aspect-video overflow-hidden rounded-2xl lg:aspect-[16/10]">
                <NewsThumbnail
                  article={slide.data}
                  className="h-full"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority={slide.type === "news" && index === firstNewsIndex}
                />
              </div>
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant="gold">
                    <Star className="h-3 w-3" />
                    {t("news.featured")}
                  </Badge>
                  {isVideoArticle(slide.data) && (
                    <Badge variant="live">{t("news.watchHighlights")}</Badge>
                  )}
                </div>
                <h1 className="font-display mb-3 text-3xl leading-tight text-white md:text-4xl">
                  {locale === "ar" ? slide.data.titleAr : slide.data.titleEn}
                </h1>
                <p className="mb-6 line-clamp-3 text-slate-300">
                  {locale === "ar" ? slide.data.excerptAr : slide.data.excerptEn}
                </p>
                <Link href={`/news/${slide.data.slug}`}>
                  <Button>{t("news.readMore")}</Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              suppressHydrationWarning
              className="absolute start-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 md:start-6"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              suppressHydrationWarning
              className="absolute end-2 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50 md:end-6"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  suppressHydrationWarning
                  className={cn(
                    "h-2 w-2 rounded-full transition",
                    i === index ? "bg-kora-green w-6" : "bg-white/30"
                  )}
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
