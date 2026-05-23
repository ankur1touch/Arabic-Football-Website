"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import axiosClient from "@/lib/client";
import type { Locale } from "@/store/features/localeSlice";
import type { NewsArticle } from "@/types/news";
import type { Team } from "@/types/team";
import type { Player } from "@/types/player";
import type { Match } from "@/types/match";
import { SearchBar } from "@/components/layout/SearchBar";
import { NewsCard } from "@/components/news/NewsCard";
import { Skeleton } from "@/components/ui/Skeleton";

type SearchResults = {
  news: NewsArticle[];
  teams: Team[];
  players: Player[];
  matches: Match[];
};

export function SearchClient({ locale }: { locale: Locale }) {
  const t = useTranslations("search");
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";
  const [results, setResults] = useState<SearchResults | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  useEffect(() => {
    if (!q) {
      setResults(null);
      setStatus("idle");
      return;
    }

    setStatus("loading");
    axiosClient
      .get(`/api/search?q=${encodeURIComponent(q)}`)
      .then((res) => {
        setResults(res.data as SearchResults);
        setStatus("done");
      })
      .catch(() => {
        setResults({ news: [], teams: [], players: [], matches: [] });
        setStatus("done");
      });
  }, [q]);

  const total =
    (results?.news.length ?? 0) +
    (results?.teams.length ?? 0) +
    (results?.players.length ?? 0) +
    (results?.matches.length ?? 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-100">{t("title")}</h1>
      <SearchBar className="mb-8" />

      {!q && (
        <p className="text-center text-slate-400">{t("hint")}</p>
      )}

      {q && status === "loading" && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      )}

      {q && status === "done" && total === 0 && (
        <p className="text-center text-slate-400">{t("noResults")}</p>
      )}

      {q && status === "done" && results && total > 0 && (
        <div className="space-y-10">
          {results.news.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-slate-200">{t("news")}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {results.news.map((article) => (
                  <NewsCard key={article.id} article={article} locale={locale} />
                ))}
              </div>
            </section>
          )}

          {results.teams.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-slate-200">{t("teams")}</h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {results.teams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/teams/${team.id}`}
                    className="kora-card rounded-xl p-4 transition hover:border-kora-green/40"
                  >
                    <p className="font-semibold text-slate-100">
                      {locale === "ar" ? team.nameAr : team.name}
                    </p>
                    <p className="text-xs text-slate-500">FIFA #{team.fifaRank}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.players.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-slate-200">{t("players")}</h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {results.players.map((player) => (
                  <Link
                    key={player.id}
                    href={`/players/${player.id}`}
                    className="kora-card rounded-xl p-4 transition hover:border-kora-green/40"
                  >
                    <p className="font-semibold text-slate-100">
                      {locale === "ar" ? player.nameAr : player.name}
                    </p>
                    <p className="text-xs text-slate-500">{player.club}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.matches.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-slate-200">{t("matches")}</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {results.matches.slice(0, 8).map((match) => (
                  <Link
                    key={match.id}
                    href={match.fixtureId ? `/matches/${match.fixtureId}` : `/matches/${match.id}`}
                    className="kora-card rounded-xl p-4 transition hover:border-kora-green/40"
                  >
                    <p className="font-medium text-slate-100">
                      {locale === "ar" ? match.homeTeamAr : match.homeTeam}{" "}
                      vs {locale === "ar" ? match.awayTeamAr : match.awayTeam}
                    </p>
                    <p className="text-xs text-slate-500">{match.league}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
