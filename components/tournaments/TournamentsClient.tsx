"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTournaments } from "@/store/features/tournamentsSlice";
import type { Locale } from "@/store/features/localeSlice";
import type { TournamentCategory } from "@/types/tournament";
import { Tabs } from "@/components/ui/Tabs";
import { TournamentCard } from "./TournamentCard";
import { Skeleton } from "@/components/ui/Skeleton";

export function TournamentsClient({ locale }: { locale: Locale }) {
  const dispatch = useAppDispatch();
  const { tournaments, status } = useAppSelector((s) => s.tournaments);
  const [cat, setCat] = useState<TournamentCategory | "all">("all");

  useEffect(() => {
    if (status === "idle") dispatch(fetchTournaments());
  }, [dispatch, status]);

  const tabs = [
    { id: "all", label: locale === "ar" ? "الكل" : "All" },
    { id: "club", label: locale === "ar" ? "أندية" : "Club" },
    { id: "domestic", label: locale === "ar" ? "محلي" : "Domestic" },
    { id: "international", label: locale === "ar" ? "دولي" : "International" },
  ];

  const sorted = [...tournaments].sort((a, b) => {
    if (a.id === "wc2026") return -1;
    if (b.id === "wc2026") return 1;
    return 0;
  });

  const filtered =
    cat === "all" ? sorted : sorted.filter((t) => t.category === cat);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        {locale === "ar" ? "البطولات" : "Tournaments"}
      </h1>
      <Tabs tabs={tabs} active={cat} onChange={(id) => setCat(id as TournamentCategory | "all")} />
      {status === "loading" && (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      )}
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TournamentCard key={t.id} tournament={t} locale={locale} />
        ))}
      </div>
    </div>
  );
}
