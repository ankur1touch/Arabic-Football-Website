"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { NewsThumbnail } from "@/components/ui/NewsThumbnail";
import { useAppSelector } from "@/store/hooks";
import type { Locale } from "@/store/features/localeSlice";
import { isVideoArticle } from "@/lib/news-media";
import { filterTodayMatches, formatKickoffLabel } from "@/lib/match-dates";

export function HeroSection({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const matches = useAppSelector((s) => s.matches.matches);
  const articles = useAppSelector((s) => s.news.articles);
  const todayMatches = filterTodayMatches(matches, 3);

  const featuredNews =
    articles.find((a) => a.featured) ??
    articles.find((a) => !a.id.startsWith("rss-")) ??
    articles[0];

  return (
    <section className="bg-gradient-to-b from-kora-mid to-kora-dark px-4 py-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <div className="kora-card rounded-2xl p-5 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2 text-kora-teal">
            <Zap className="h-5 w-5" />
            <h2 className="font-semibold">
              {t("match.todayMatches")} — {locale === "ar" ? "Today's Matches" : "مباريات اليوم"}
            </h2>
          </div>
          <ul className="space-y-3">
            {todayMatches.length === 0 && (
              <li className="rounded-xl bg-black/30 px-4 py-3 text-sm text-slate-400">
                <p>{locale === "ar" ? "لا توجد مباريات اليوم" : "No matches scheduled today"}</p>
                <Link
                  href="/matches"
                  className="mt-2 inline-block text-xs text-kora-green hover:underline"
                >
                  {locale === "ar" ? "عرض المباريات القادمة ←" : "View upcoming matches →"}
                </Link>
              </li>
            )}
            {todayMatches.map((m) => {
              const inner = (
                <>
                  <span className="font-medium">
                    {locale === "ar" ? m.homeTeamAr : m.homeTeam}{" "}
                    {m.status === "live" && m.homeScore !== undefined
                      ? `${m.homeScore} - ${m.awayScore}`
                      : t("common.vs")}{" "}
                    {locale === "ar" ? m.awayTeamAr : m.awayTeam}
                  </span>
                  {m.status === "live" ? (
                    <Badge variant="live">
                      <span className="h-2 w-2 rounded-full bg-kora-alert animate-pulse-live" />
                      {t("match.live")}
                    </Badge>
                  ) : (
                    <span className="text-xs text-slate-400">
                      {formatKickoffLabel(m.kickoff, locale)}
                    </span>
                  )}
                </>
              );
              return (
                <li key={m.id}>
                  {m.fixtureId ? (
                    <Link
                      href={`/matches/${m.fixtureId}`}
                      className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3 text-sm text-slate-100 transition hover:bg-black/40"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl bg-black/30 px-4 py-3 text-sm text-slate-100">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {featuredNews ? (
          <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 transition hover:border-kora-green/40">
            <Link href={`/news/${featuredNews.slug}`} className="group block">
              <NewsThumbnail
                article={featuredNews}
                className="h-48 lg:h-52"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="bg-gradient-to-br from-kora-green/10 to-transparent p-6 pb-4">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge variant="gold" className="w-fit">
                    <Star className="h-3 w-3" />
                    {t("news.exclusive")}
                  </Badge>
                  {isVideoArticle(featuredNews) && (
                    <Badge variant="live">{t("news.watchHighlights")}</Badge>
                  )}
                </div>
                <h1 className="mb-2 line-clamp-2 text-2xl font-bold leading-tight text-white group-hover:text-kora-teal md:text-3xl">
                  {locale === "ar" ? featuredNews.titleAr : featuredNews.titleEn}
                </h1>
                <p className="line-clamp-2 text-sm text-slate-400">
                  {locale === "ar" ? featuredNews.excerptAr : featuredNews.excerptEn}
                </p>
              </div>
            </Link>
            <div className="flex flex-wrap gap-3 bg-gradient-to-br from-kora-green/10 to-transparent px-6 pb-6">
              <Link href={`/news/${featuredNews.slug}`}>
                <Button>{t("news.readMore")}</Button>
              </Link>
              <Link href="/news">
                <Button variant="outline">{t("news.allNews")}</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-kora-green/10 to-transparent p-8">
            <Badge variant="gold" className="mb-4 w-fit">
              <Star className="h-3 w-3" />
              {t("news.exclusive")}
            </Badge>
            <h1 className="mb-3 text-3xl font-bold leading-tight text-white md:text-4xl">
              {t("site.tagline")}
            </h1>
            <p className="mb-6 text-slate-400">{t("home.heroSubtitle")}</p>
            <Link href="/news">
              <Button>{t("news.readNews")}</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
