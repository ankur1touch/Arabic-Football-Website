"use client";

import { Tabs } from "@/components/ui/Tabs";
import type { NewsCategory } from "@/types/news";
import type { NewsFilter } from "./NewsListingClient";

const CATEGORIES: {
  id: NewsFilter;
  labelAr: string;
  labelEn: string;
}[] = [
  { id: "all", labelAr: "الكل", labelEn: "All" },
  { id: "videos", labelAr: "فيديو", labelEn: "Videos" },
  { id: "premier-league", labelAr: "الإنجليزي", labelEn: "Premier League" },
  { id: "la-liga", labelAr: "الإسباني", labelEn: "La Liga" },
  { id: "champions-league", labelAr: "أبطال أوروبا", labelEn: "UCL" },
  { id: "transfers", labelAr: "انتقالات", labelEn: "Transfers" },
  { id: "world-cup", labelAr: "كأس العالم", labelEn: "World Cup" },
];

interface NewsFiltersProps {
  active: NewsFilter;
  onChange: (cat: NewsFilter) => void;
  locale: "ar" | "en";
}

export function NewsFilters({ active, onChange, locale }: NewsFiltersProps) {
  return (
    <Tabs
      tabs={CATEGORIES.map((c) => ({
        id: c.id,
        label: locale === "ar" ? c.labelAr : c.labelEn,
      }))}
      active={active}
      onChange={(id) => onChange(id as NewsFilter)}
    />
  );
}
