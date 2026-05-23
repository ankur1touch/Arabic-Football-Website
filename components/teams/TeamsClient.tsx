"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Globe2, Search, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTeams } from "@/store/features/teamsSlice";
import type { Locale } from "@/store/features/localeSlice";
import type { Confederation } from "@/types/team";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";
import { TeamCard } from "./TeamCard";

export function TeamsClient({ locale }: { locale: Locale }) {
  const t = useTranslations("teams");
  const dispatch = useAppDispatch();
  const { teams, status } = useAppSelector((s) => s.teams);
  const [conf, setConf] = useState<Confederation | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "idle") dispatch(fetchTeams());
  }, [dispatch, status]);

  const tabs = useMemo(() => {
    const confs = [...new Set(teams.map((tm) => tm.confederation))];
    return [
      { id: "all", label: locale === "ar" ? "الكل" : "All" },
      ...confs.map((c) => ({ id: c, label: c })),
    ];
  }, [teams, locale]);

  const filtered = teams.filter((team) => {
    if (conf !== "all" && team.confederation !== conf) return false;
    const q = search.toLowerCase();
    if (q && !team.name.toLowerCase().includes(q) && !team.nameAr.includes(search))
      return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero banner */}
      <div className="animate-fade-up relative mb-8 overflow-hidden rounded-2xl border border-kora-green/20 bg-gradient-to-br from-kora-green/15 via-kora-mid to-kora-dark p-6 md:p-8">
        <div className="pointer-events-none absolute -end-8 -top-8 h-40 w-40 rounded-full bg-kora-green/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 start-10 h-32 w-32 rounded-full bg-kora-gold/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kora-green/20 ring-2 ring-kora-green/30">
            <Globe2 className="h-7 w-7 text-kora-teal" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              {locale === "ar" ? "منتخبات كأس العالم 2026" : "World Cup 2026 Teams"}
            </h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
              <Users className="h-4 w-4 text-kora-green" />
              {status === "succeeded"
                ? locale === "ar"
                  ? `${teams.length} منتخب · 6 قارات`
                  : `${teams.length} nations · 6 confederations`
                : locale === "ar"
                  ? "جاري التحميل..."
                  : "Loading teams..."}
            </p>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} active={conf} onChange={(id) => setConf(id as Confederation | "all")} />

      <div className="relative mt-4 max-w-md">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 ps-9 pe-4 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-kora-green/50 focus:bg-white/[0.07] focus:outline-none"
        />
      </div>

      {status === "loading" && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      )}

      {status === "succeeded" && filtered.length === 0 && (
        <p className="mt-12 text-center text-slate-400">
          {locale === "ar" ? "لا توجد منتخبات" : "No teams found"}
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((team, index) => (
          <TeamCard key={team.id} team={team} locale={locale} index={index} />
        ))}
      </div>
    </div>
  );
}
