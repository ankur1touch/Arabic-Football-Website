"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Users, Trophy, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/store/features/localeSlice";

export function FanZoneStrip({ locale }: { locale: Locale }) {
  const t = useTranslations("fanZone");

  const cards = [
    {
      icon: Trophy,
      title: t("wcTitle"),
      desc: t("wcDesc"),
      href: "/world-cup",
    },
    {
      icon: Globe,
      title: t("countriesTitle"),
      desc: t("countriesDesc"),
      href: "/teams",
    },
    {
      icon: Users,
      title: t("communityTitle"),
      desc: t("communityDesc"),
      href: "/news",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="font-display mb-6 text-2xl text-white">{t("title")}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group kora-card rounded-2xl p-6 transition hover:border-kora-green/30"
          >
            <card.icon className="mb-3 h-8 w-8 text-kora-green transition group-hover:scale-110" />
            <h3 className="font-display mb-2 text-lg text-white">{card.title}</h3>
            <p className="mb-4 text-sm text-slate-400">{card.desc}</p>
            <Button variant="outline" size="sm">
              {locale === "ar" ? "استكشف ←" : "Explore →"}
            </Button>
          </Link>
        ))}
      </div>
    </section>
  );
}
