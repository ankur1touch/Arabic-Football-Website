"use client";

import { Link } from "@/i18n/routing";
import type { Tournament } from "@/types/tournament";
import type { Locale } from "@/store/features/localeSlice";
import { Badge } from "@/components/ui/Badge";

export function TournamentCard({
  tournament,
  locale,
}: {
  tournament: Tournament;
  locale: Locale;
}) {
  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-kora-green/40"
    >
      {tournament.featured && <Badge variant="gold" className="mb-2">Featured</Badge>}
      <h3 className="text-lg font-bold">
        {locale === "ar" ? tournament.nameAr : tournament.name}
      </h3>
      <p className="mt-1 text-sm text-slate-400">{tournament.season}</p>
      <p className="mt-2 text-xs capitalize text-kora-teal">{tournament.category}</p>
    </Link>
  );
}
