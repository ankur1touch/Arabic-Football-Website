"use client";

import { Link } from "@/i18n/routing";
import type { SquadPlayer } from "@/types/team";
import type { Locale } from "@/store/features/localeSlice";

export function TeamSquadList({
  squad,
  locale,
}: {
  squad: SquadPlayer[];
  locale: Locale;
}) {
  const isAr = locale === "ar";

  if (!squad.length) {
    return (
      <p className="py-8 text-center text-slate-400">
        {isAr ? "التشكيلة غير متاحة" : "Squad not available"}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {squad.map((p) => (
        <li key={p.id ?? p.name}>
          {p.id ? (
            <Link
              href={`/players/${p.id}`}
              className="flex justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-kora-green/30"
            >
              <span className="text-slate-100">{isAr ? p.nameAr : p.name}</span>
              <span className="text-slate-400">
                {p.position}
                {p.number != null && ` · #${p.number}`}
              </span>
            </Link>
          ) : (
            <div className="flex justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-slate-100">{isAr ? p.nameAr : p.name}</span>
              <span className="text-slate-400">{p.position}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
