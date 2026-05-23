"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchRankings } from "@/store/features/rankingsSlice";
import type { Locale } from "@/store/features/localeSlice";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";

export function RankingsClient({ locale }: { locale: Locale }) {
  const t = useTranslations("rankings");
  const dispatch = useAppDispatch();
  const { men, women, status } = useAppSelector((s) => s.rankings);
  const [gender, setGender] = useState<"men" | "women">("men");

  useEffect(() => {
    if (status === "idle") dispatch(fetchRankings());
  }, [dispatch, status]);

  const list = gender === "men" ? men : women;
  const tabs = [
    { id: "men", label: t("men") },
    { id: "women", label: t("women") },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{t("worldRankings")}</h1>
      <Tabs tabs={tabs} active={gender} onChange={(id) => setGender(id as "men" | "women")} />

      {status === "loading" && <Skeleton className="mt-8 h-96 w-full" />}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-slate-400">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">{locale === "ar" ? "منتخب" : "Team"}</th>
              <th className="p-3 text-end">{t("points")}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row.rank} className="border-t border-white/5">
                <td className="p-3">{row.rank}</td>
                <td className="p-3 font-medium">
                  {locale === "ar" ? row.teamAr : row.team}
                </td>
                <td className="p-3 text-end font-bold text-kora-green">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
