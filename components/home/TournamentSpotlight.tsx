"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useAppSelector } from "@/store/hooks";
import type { Locale } from "@/store/features/localeSlice";

export function TournamentSpotlight({ locale }: { locale: Locale }) {
  const t = useTranslations("tournaments");
  const featured = useAppSelector((s) =>
    s.tournaments.tournaments.find((t) => t.featured)
  );

  if (!featured) return null;

  return (
    <Link
      href={`/tournaments/${featured.id}`}
      className="block rounded-2xl border border-kora-green/30 bg-kora-green/10 p-5 transition hover:bg-kora-green/15"
    >
      <p className="text-xs text-kora-teal">{featured.season}</p>
      <h3 className="mt-1 text-lg font-bold text-slate-100">
        {locale === "ar" ? featured.nameAr : featured.name}
      </h3>
      <p className="mt-2 text-sm text-slate-400">
        {t("standings")} • {featured.standings.length} teams
      </p>
    </Link>
  );
}
