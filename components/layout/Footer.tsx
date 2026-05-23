"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/store/features/localeSlice";

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto hidden border-t border-white/5 bg-kora-mid py-8 md:block">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold text-kora-green">
            {locale === "ar" ? "كورة" : "KORA"}
          </p>
          <p className="text-sm text-slate-400">© {year}</p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <Link href="/" className="hover:text-kora-green">{t("home")}</Link>
          <Link href="/news" className="hover:text-kora-green">{t("news")}</Link>
          <Link href="/matches" className="hover:text-kora-green">{t("matches")}</Link>
          <Link href="/world-rankings" className="hover:text-kora-green">{t("rankings")}</Link>
        </div>
        <div className="flex gap-3">
          <a href="#" aria-label="Twitter" className="text-slate-400 hover:text-kora-green">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a href="#" aria-label="YouTube" className="text-slate-400 hover:text-kora-green">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
