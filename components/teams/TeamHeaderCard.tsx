"use client";

import { TeamBadge } from "@/components/ui/TeamBadge";
import { resolveTeamLogo } from "@/lib/team-logos";
import type { TeamInfo } from "@/types/team";
import type { Locale } from "@/store/features/localeSlice";

export function TeamHeaderCard({
  team,
  locale,
}: {
  team: TeamInfo;
  locale: Locale;
}) {
  const isAr = locale === "ar";
  const logo =
    team.logo ||
    resolveTeamLogo({ id: String(team.id), name: team.name, logo: team.logo });

  return (
    <div className="kora-card flex items-center gap-6 rounded-2xl p-6">
      <div className="rounded-2xl bg-kora-mid/80 p-3 ring-2 ring-kora-green/20">
        <TeamBadge name={team.name} logo={logo} size="lg" className="!h-20 !w-20" />
      </div>      <div>
        <h1 className="text-3xl font-bold text-slate-100">{team.name}</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
          {team.country && <span>{team.country}</span>}
          {team.founded > 0 && (
            <span>
              {isAr ? "تأسس:" : "Founded:"} {team.founded}
            </span>
          )}
          {team.venue?.name && <span>{team.venue.name}</span>}
        </div>
      </div>
    </div>
  );
}
