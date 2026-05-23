"use client";

import { Link } from "@/i18n/routing";
import type { FixtureLineup } from "@/types/fixture-detail";
import type { Locale } from "@/store/features/localeSlice";

function PlayerRow({ player }: { player: { id: number; name: string; number: number | null; position: string | null } }) {
  const inner = (
    <>
      <span className="w-5 text-xs text-slate-500">{player.number ?? "–"}</span>
      <span className="flex-1 text-slate-200">{player.name}</span>
      <span className="text-xs text-slate-500">{player.position}</span>
    </>
  );

  if (player.id) {
    return (
      <Link
        href={`/players/${player.id}`}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-white/5"
      >
        {inner}
      </Link>
    );
  }

  return <div className="flex items-center gap-2 px-2 py-1.5">{inner}</div>;
}

export function MatchLineups({
  lineups,
  locale,
}: {
  lineups: FixtureLineup[];
  locale: Locale;
}) {
  if (!lineups.length) {
    return (
      <p className="py-8 text-center text-slate-400">
        {locale === "ar" ? "التشكيلات غير متاحة" : "Lineups not available"}
      </p>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {lineups.map((lineup) => (
        <div key={lineup.team} className="kora-card rounded-2xl p-5">
          <h3 className="font-bold text-slate-100">{lineup.team}</h3>
          <p className="text-sm text-slate-400">{lineup.formation}</p>
          <p className="mt-4 mb-1 px-2 text-xs font-medium text-slate-500">
            {locale === "ar" ? "أساسي" : "Starting XI"}
          </p>
          <ul className="space-y-1 text-sm">
            {lineup.startXI.map((p) => (
              <li key={p.id}>
                <PlayerRow player={p} />
              </li>
            ))}
          </ul>
          {lineup.substitutes.length > 0 && (
            <>
              <p className="mt-4 mb-1 px-2 text-xs font-medium text-slate-500">
                {locale === "ar" ? "بدلاء" : "Substitutes"}
              </p>
              <ul className="space-y-1 text-sm">
                {lineup.substitutes.map((p) => (
                  <li key={p.id}>
                    <PlayerRow player={p} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
