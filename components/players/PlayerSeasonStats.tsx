"use client";

import type { PlayerStatistics } from "@/types/player";
import type { Locale } from "@/store/features/localeSlice";

const STAT_CARDS = [
  { key: "goals.total", labelAr: "أهداف", labelEn: "Goals" },
  { key: "goals.assists", labelAr: "تمريرات", labelEn: "Assists" },
  { key: "games.appearences", labelAr: "مباريات", labelEn: "Apps" },
  { key: "games.minutes", labelAr: "دقائق", labelEn: "Minutes" },
  { key: "shots.total", labelAr: "تسديدات", labelEn: "Shots" },
  { key: "passes.key", labelAr: "تمريرات حاسمة", labelEn: "Key passes" },
  { key: "tackles.total", labelAr: "تدخلات", labelEn: "Tackles" },
  { key: "cards.yellow", labelAr: "بطاقات", labelEn: "Yellow" },
] as const;

function getNestedValue(obj: Record<string, unknown>, path: string): string | number {
  const val = path.split(".").reduce((acc: unknown, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return null;
  }, obj);
  return (val as string | number) ?? "–";
}

export function PlayerSeasonStats({
  statistics,
  locale,
}: {
  statistics: PlayerStatistics[];
  locale: Locale;
}) {
  if (!statistics.length) return null;
  const stat = statistics[0];
  const isAr = locale === "ar";

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-slate-100">
        {isAr ? "إحصائيات الموسم" : "Season Statistics"}
        {stat.league?.season ? ` — ${stat.league.season}` : ""}
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {STAT_CARDS.slice(0, 3).map((card) => (
          <div
            key={card.key}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-center"
          >
            <p className="text-2xl font-bold text-kora-green">
              {String(getNestedValue(stat as unknown as Record<string, unknown>, card.key))}
            </p>
            <p className="text-xs text-slate-400">{isAr ? card.labelAr : card.labelEn}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {STAT_CARDS.slice(3).map((card) => (
          <div
            key={card.key}
            className="rounded-xl border border-white/10 bg-white/5 p-3 text-center"
          >
            <p className="text-xl font-bold text-kora-green">
              {String(getNestedValue(stat as unknown as Record<string, unknown>, card.key))}
            </p>
            <p className="text-xs text-slate-400">{isAr ? card.labelAr : card.labelEn}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
