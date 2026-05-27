"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { HomepageData } from "@/lib/homepage-data";
import type { Locale } from "@/store/features/localeSlice";
import { HomepageHydrator } from "./HomepageHydrator";
import { HeroSlider } from "./HeroSlider";
import { MatchTickerStrip } from "./MatchTickerStrip";
import { HeroSection } from "./HeroSection";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { filterTodayMatches, filterNextUpcoming } from "@/lib/match-dates";

const VideoNewsStrip = dynamic(
  () => import("./VideoNewsStrip").then((m) => ({ default: m.VideoNewsStrip })),
  { loading: () => <Skeleton className="mb-6 h-40 w-full rounded-2xl" /> }
);

const NewsGrid = dynamic(
  () => import("./NewsGrid").then((m) => ({ default: m.NewsGrid })),
  { loading: () => <Skeleton className="h-96 w-full rounded-2xl" /> }
);

const RankingsSnippet = dynamic(
  () => import("./RankingsSnippet").then((m) => ({ default: m.RankingsSnippet })),
  { loading: () => <Skeleton className="h-48 w-full rounded-2xl" /> }
);

const UpcomingMatchesWidget = dynamic(
  () =>
    import("@/components/scores/LiveScoresWidget").then((m) => ({
      default: m.UpcomingMatchesWidget,
    })),
  { loading: () => <Skeleton className="h-48 w-full rounded-2xl" /> }
);

const SourcesWidget = dynamic(
  () => import("./SourcesWidget").then((m) => ({ default: m.SourcesWidget })),
  { loading: () => <Skeleton className="h-32 w-full rounded-2xl" /> }
);

const TournamentSpotlight = dynamic(
  () => import("./TournamentSpotlight").then((m) => ({ default: m.TournamentSpotlight })),
  { loading: () => <Skeleton className="h-40 w-full rounded-2xl" /> }
);

const FanZoneStrip = dynamic(
  () => import("./FanZoneStrip").then((m) => ({ default: m.FanZoneStrip })),
  { loading: () => <Skeleton className="h-24 w-full" /> }
);

export function HomePageClient({
  locale,
  initialData,
}: {
  locale: Locale;
  initialData: HomepageData;
}) {
  const t = useTranslations("home");
  const failed = initialData.articles.length === 0 && initialData.matches.length === 0;
  const sliderLeadsWithMatch =
    filterTodayMatches(initialData.matches, 1).length > 0 ||
    filterNextUpcoming(initialData.matches, 1).length > 0;

  return (
    <>
      <HomepageHydrator data={initialData} />
      <HeroSlider
        locale={locale}
        initialArticles={initialData.articles}
        initialMatches={initialData.matches}
      />
      <MatchTickerStrip locale={locale} initialMatches={initialData.matches} />
      <HeroSection
        locale={locale}
        initialArticles={initialData.articles}
        initialMatches={initialData.matches}
        imagePriority={sliderLeadsWithMatch}
      />

      {failed && (
        <div className="mx-auto max-w-7xl px-4 py-4 text-center">
          <p className="text-kora-alert">{t("noResults")}</p>
          <Button className="mt-2" onClick={() => window.location.reload()}>
            {t("retry")}
          </Button>
        </div>
      )}

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <VideoNewsStrip locale={locale} initialArticles={initialData.articles} />
          <NewsGrid locale={locale} initialArticles={initialData.articles} />
        </div>
        <div className="min-w-0 space-y-6">
          <RankingsSnippet
            locale={locale}
            initialMen={initialData.rankings.men}
            initialTournaments={initialData.tournaments}
          />
          <UpcomingMatchesWidget locale={locale} initialMatches={initialData.matches} />
          <SourcesWidget />
          <TournamentSpotlight locale={locale} initialTournaments={initialData.tournaments} />
        </div>
      </div>
      <FanZoneStrip locale={locale} />
    </>
  );
}
