"use client";

import { Link } from "@/i18n/routing";
import type { PlayerInfo, PlayerStatistics } from "@/types/player";
import type { Locale } from "@/store/features/localeSlice";

export function PlayerProfileCard({
  player,
  statistics,
  locale,
}: {
  player: PlayerInfo;
  statistics: PlayerStatistics[];
  locale: Locale;
}) {
  const stat = statistics[0];
  const isAr = locale === "ar";

  return (
    <div className="kora-card rounded-2xl p-6">
      <div className="flex gap-6 items-center">
        {player.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={player.photo}
            alt={player.name}
            className="h-20 w-20 rounded-full border-2 border-white/10 object-cover"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-100">{player.name}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            {stat?.team && (
              <>
                {stat.team.id ? (
                  <Link
                    href={`/teams/${stat.team.id}`}
                    className="font-medium text-kora-green hover:underline"
                  >
                    {stat.team.name}
                  </Link>
                ) : (
                  <span>{stat.team.name}</span>
                )}
                {stat.league && <span>· {stat.league.name}</span>}
              </>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
            {player.nationality && <span>{player.nationality}</span>}
            {player.age > 0 && (
              <span>
                {player.age} {isAr ? "سنة" : "y/o"}
              </span>
            )}
            {stat?.games?.position && (
              <span className="rounded-full bg-kora-green/10 px-2 py-0.5 text-xs font-semibold text-kora-green">
                {stat.games.position}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
