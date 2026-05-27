"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTournaments } from "@/store/features/tournamentsSlice";
import type { Locale } from "@/store/features/localeSlice";
import { Tabs } from "@/components/ui/Tabs";
import { SkeletonList } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { TeamCrest } from "@/components/ui/TeamCrest";

export function StandingsClient({ locale }: { locale: Locale }) {
  const t = useTranslations("standings");
  const dispatch = useAppDispatch();
  const { tournaments, status } = useAppSelector((s) => s.tournaments);
  const [tab, setTab] = useState<"standings" | "scorers">("standings");

  useEffect(() => {
    if (status === "idle") dispatch(fetchTournaments());
  }, [dispatch, status]);

  const wc = tournaments.find((tour) => tour.id === "wc2026") ?? tournaments[0];
  const tabs = [
    { id: "standings", label: t("table") },
    { id: "scorers", label: t("topScorers") },
  ];

  if (status === "loading") {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <SkeletonList count={8} />
      </div>
    );
  }

  if (!wc) return <EmptyState message={t("noData")} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display mb-2 text-3xl text-white">{t("title")}</h1>
      <p className="mb-6 text-slate-400">
        {locale === "ar" ? wc.nameAr : wc.name} — {wc.season}
      </p>
      <Tabs tabs={tabs} active={tab} onChange={(id) => setTab(id as "standings" | "scorers")} />

      {tab === "standings" ? (
        <div className="mt-6 overflow-x-auto">
          {wc.standings?.length ? (
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-2 text-start">#</th>
                  <th className="py-2 text-start">{t("team")}</th>
                  <th className="py-2 text-center">{t("played")}</th>
                  <th className="py-2 text-center">{t("gd")}</th>
                  <th className="py-2 text-center">{t("points")}</th>
                </tr>
              </thead>
              <tbody>
                {wc.standings.map((row) => (
                  <tr key={row.team} className="border-b border-white/5">
                    <td className="py-2">{row.rank}</td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <TeamCrest name={row.team} size="sm" />
                        <span>{locale === "ar" ? row.teamAr : row.team}</span>
                      </div>
                    </td>
                    <td className="py-2 text-center">{row.played}</td>
                    <td className="py-2 text-center">{row.gd}</td>
                    <td className="py-2 text-center font-semibold text-kora-green">
                      {row.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState message={t("noData")} />
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-2">
          {wc.topScorers?.length ? (
            wc.topScorers.map((s) => (
              <div
                key={`${s.player}-${s.rank}`}
                className="kora-card flex items-center justify-between rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-display w-6 text-kora-gold">{s.rank}</span>
                  <span>{locale === "ar" ? s.playerAr : s.player}</span>
                </div>
                <span className="font-display text-kora-green">{s.goals}</span>
              </div>
            ))
          ) : (
            <EmptyState message={t("noData")} />
          )}
        </div>
      )}
    </div>
  );
}
