"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPlayers } from "@/store/features/playersSlice";
import type { Locale } from "@/store/features/localeSlice";
import type { PlayerPosition } from "@/types/player";
import { Tabs } from "@/components/ui/Tabs";
import { Skeleton } from "@/components/ui/Skeleton";

export function PlayersClient({ locale }: { locale: Locale }) {
  const t = useTranslations("players");
  const dispatch = useAppDispatch();
  const { players, status } = useAppSelector((s) => s.players);
  const [position, setPosition] = useState<PlayerPosition | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "idle") dispatch(fetchPlayers());
  }, [dispatch, status]);

  const tabs = [
    { id: "all", label: locale === "ar" ? "الكل" : "All" },
    { id: "GK", label: "GK" },
    { id: "DEF", label: "DEF" },
    { id: "MID", label: "MID" },
    { id: "FWD", label: "FWD" },
  ];

  const filtered = players.filter((p) => {
    if (position !== "all" && p.position !== position) return false;
    const q = search.toLowerCase();
    if (q && !p.name.toLowerCase().includes(q) && !p.nameAr.includes(search))
      return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-slate-100">
        {locale === "ar" ? "هدافو كأس العالم 2026" : "World Cup 2026 Top Scorers"}
      </h1>
      <Tabs
        tabs={tabs}
        active={position}
        onChange={(id) => setPosition(id as PlayerPosition | "all")}
      />
      <input
        type="search"
        placeholder={t("search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-4 w-full max-w-md rounded-xl border border-white/10 bg-white/5 px-4 py-2"
      />
      {status === "loading" && (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      )}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.map((player) => (
          <Link
            key={player.id}
            href={`/players/${player.id}`}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-kora-green/40"
          >
            <h3 className="text-lg font-bold">
              {locale === "ar" ? player.nameAr : player.name}
            </h3>
            <p className="text-sm text-slate-400">
              {player.position} • {locale === "ar" ? player.clubAr : player.club}
            </p>
            <p className="mt-2 text-kora-green">
              {player.stats.goals} G / {player.stats.assists} A
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
