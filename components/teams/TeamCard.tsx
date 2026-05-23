"use client";

import { Link } from "@/i18n/routing";
import { ChevronRight, Trophy } from "lucide-react";
import { cn } from "@/lib/cn";
import { TeamBadge } from "@/components/ui/TeamBadge";
import { resolveTeamLogo } from "@/lib/team-logos";
import type { Team, Confederation } from "@/types/team";
import type { Locale } from "@/store/features/localeSlice";

const CONF_STYLE: Record<
  Confederation,
  { bg: string; text: string; ring: string; glow: string }
> = {
  UEFA: {
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    ring: "ring-blue-500/30",
    glow: "group-hover:shadow-blue-500/20",
  },
  CONMEBOL: {
    bg: "bg-yellow-500/15",
    text: "text-yellow-300",
    ring: "ring-yellow-500/30",
    glow: "group-hover:shadow-yellow-500/20",
  },
  AFC: {
    bg: "bg-red-500/15",
    text: "text-red-300",
    ring: "ring-red-500/30",
    glow: "group-hover:shadow-red-500/20",
  },
  CAF: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-300",
    ring: "ring-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/20",
  },
  CONCACAF: {
    bg: "bg-purple-500/15",
    text: "text-purple-300",
    ring: "ring-purple-500/30",
    glow: "group-hover:shadow-purple-500/20",
  },
  OFC: {
    bg: "bg-cyan-500/15",
    text: "text-cyan-300",
    ring: "ring-cyan-500/30",
    glow: "group-hover:shadow-cyan-500/20",
  },
};

function FormPill({ result }: { result: string }) {
  const r = result.toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-bold",
        r === "W" && "bg-kora-green/25 text-kora-teal",
        r === "D" && "bg-white/10 text-slate-400",
        r === "L" && "bg-kora-alert/20 text-red-300"
      )}
    >
      {r}
    </span>
  );
}

export function TeamCard({
  team,
  locale,
  index = 0,
}: {
  team: Team;
  locale: Locale;
  index?: number;
}) {
  const name = locale === "ar" ? team.nameAr : team.name;
  const logo = resolveTeamLogo(team);
  const conf = CONF_STYLE[team.confederation] ?? CONF_STYLE.UEFA;
  const topRank = team.fifaRank <= 3;

  return (
    <Link
      href={`/teams/${team.id}`}
      className={cn(
        "group animate-fade-up relative overflow-hidden rounded-2xl border border-white/10",
        "bg-gradient-to-br from-white/[0.07] to-white/[0.02]",
        "p-5 transition-all duration-300",
        "hover:-translate-y-1 hover:border-kora-green/50 hover:shadow-xl",
        conf.glow
      )}
      style={{ animationDelay: `${Math.min(index, 12) * 60}ms` }}
    >
      <div className="animate-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-start gap-4">
        <div
          className={cn(
            "relative flex shrink-0 items-center justify-center rounded-2xl p-3",
            "bg-kora-mid/80 ring-2 transition-all duration-300 group-hover:ring-kora-green/40",
            conf.ring
          )}
        >
          <TeamBadge
            name={name}
            logo={logo}
            size="lg"
            className="group-hover-logo-pop h-14 w-14 !rounded-xl !border-0 !bg-transparent"
          />
          {topRank && (
            <span className="absolute -end-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-kora-gold text-[10px] font-bold text-kora-dark shadow-lg">
              <Trophy className="h-3 w-3" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-lg font-bold text-slate-100 transition-colors group-hover:text-kora-teal">
              {name}
            </h3>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-600 transition-all group-hover:translate-x-0.5 group-hover:text-kora-green" />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                conf.bg,
                conf.text
              )}
            >
              {team.confederation}
            </span>
            <span className="rounded-full bg-kora-green/15 px-2.5 py-0.5 text-[11px] font-semibold text-kora-teal">
              FIFA #{team.fifaRank}
            </span>
          </div>

          {team.form.length > 0 && (
            <div className="mt-3 flex gap-1">
              {team.form.map((f, i) => (
                <FormPill key={`${team.id}-f-${i}`} result={f} />
              ))}
            </div>
          )}

          {team.coach && team.coach !== "—" && (
            <p className="mt-2 truncate text-xs text-slate-500">
              {locale === "ar" ? team.coachAr : team.coach}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
