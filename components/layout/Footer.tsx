"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/store/features/localeSlice";

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const columns = [
    {
      title: t("football"),
      links: [
        { href: "/matches", label: tNav("matches") },
        { href: "/live-scores", label: tNav("liveScores") },
        { href: "/standings", label: tNav("standings") },
        { href: "/world-rankings", label: tNav("rankings") },
      ],
    },
    {
      title: t("tournaments"),
      links: [
        { href: "/world-cup", label: tNav("worldCup") },
        { href: "/tournaments", label: tNav("tournaments") },
        { href: "/teams", label: tNav("nationalTeams") },
        { href: "/players", label: tNav("players") },
      ],
    },
    {
      title: t("news"),
      links: [
        { href: "/news", label: tNav("news") },
        { href: "/transfers", label: tNav("transfers") },
        { href: "/search", label: tNav("search") },
      ],
    },
    {
      title: t("site"),
      links: [
        { href: "/about", label: t("about") },
        { href: "/contact", label: t("contact") },
        { href: "/privacy", label: t("privacy") },
        { href: "/advertise", label: t("advertise") },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t border-white/5 bg-kora-mid py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <p className="font-display text-2xl text-kora-green">
              {locale === "ar" ? "كورة" : "KORA"}
            </p>
            <p className="mt-2 text-sm text-slate-400">{t("tagline")}</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-300">
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-kora-green"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-display text-lg text-white">{t("newsletterTitle")}</h3>
          <p className="mt-1 text-sm text-slate-400">{t("newsletterDesc")}</p>
          {subscribed ? (
            <p className="mt-4 text-sm text-kora-teal">{t("newsletterThanks")}</p>
          ) : (
            <form
              className="mt-4 flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("newsletterPlaceholder")}
                suppressHydrationWarning
                className="flex-1 rounded-full border border-white/10 bg-kora-dark px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-kora-green focus:outline-none"
              />
              <Button type="submit" size="sm">
                {t("newsletterBtn")}
              </Button>
            </form>
          )}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-sm text-slate-500 md:flex-row">
          <p>© {year} {locale === "ar" ? "كورة" : "KORA"}</p>
          <div className="flex gap-4">
            <a href="#" aria-label="Twitter" className="hover:text-kora-green">
              𝕏
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-kora-green">
              ▶
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
