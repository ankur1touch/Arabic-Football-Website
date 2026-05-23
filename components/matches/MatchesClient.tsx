"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMatches } from "@/store/features/matchesSlice";
import type { Locale } from "@/store/features/localeSlice";
import type { MatchStatus } from "@/types/match";
import { Tabs } from "@/components/ui/Tabs";
import { MatchCard } from "./MatchCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function MatchesClient({ locale }: { locale: Locale }) {
  const t = useTranslations("match");
  const th = useTranslations("home");
  const dispatch = useAppDispatch();
  const { matches, status } = useAppSelector((s) => s.matches);
  const [tab, setTab] = useState<MatchStatus>("live");
  const [league, setLeague] = useState("all");

  useEffect(() => {
    if (status === "idle") dispatch(fetchMatches());
  }, [dispatch, status]);

  const leagues = useMemo(
    () => ["all", ...new Set(matches.map((m) => m.league))],
    [matches]
  );

  const filtered = matches.filter((m) => {
    if (m.status !== tab) return false;
    if (league !== "all" && m.league !== league) return false;
    return true;
  });

  const tabs = [
    { id: "live", label: t("live") },
    { id: "upcoming", label: t("upcoming") },
    { id: "finished", label: t("results") },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        {locale === "ar" ? "المباريات" : "Matches"}
      </h1>
      <Tabs tabs={tabs} active={tab} onChange={(id) => setTab(id as MatchStatus)} />

      <div className="mt-4 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-2">
          {leagues.map((l) => {
            const label =
              l === "all"
                ? locale === "ar"
                  ? "كل الدوريات"
                  : "All Leagues"
                : l;
            return (
              <button
                key={l}
                type="button"
                title={label}
                onClick={() => setLeague(l)}
                className={cn(
                  "max-w-[280px] shrink-0 truncate rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  league === l
                    ? "bg-kora-green text-white"
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {status === "loading" && (
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}

      {status === "failed" && (
        <Button className="mt-8" onClick={() => dispatch(fetchMatches())}>
          {th("retry")}
        </Button>
      )}

      {status === "succeeded" && filtered.length === 0 && (
        <p className="mt-8 text-center text-slate-400">{th("noResults")}</p>
      )}

      <div className="mt-8 space-y-4">
        {filtered.map((m) => (
          <MatchCard key={m.id} match={m} locale={locale} />
        ))}
      </div>
    </div>
  );
}
