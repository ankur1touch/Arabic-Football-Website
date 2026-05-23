"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { LangToggle } from "@/components/ui/LangToggle";
import { SearchBar } from "@/components/layout/SearchBar";
import { cn } from "@/lib/cn";
import type { Locale } from "@/store/features/localeSlice";

const NAV_KEYS = [
  { href: "/", key: "home" },
  { href: "/news", key: "news" },
  { href: "/tournaments/wc2026", key: "worldCup" },
  { href: "/matches", key: "matches" },
  { href: "/teams", key: "nationalTeams" },
] as const;

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-kora-mid/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-kora-green text-lg">
            ⚽
          </span>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-white">
              {locale === "ar" ? "كورة" : "KORA"}
            </span>
            <span className="block text-[10px] text-slate-400">
              {locale === "ar" ? "KORA" : "كورة"}
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_KEYS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-kora-green",
                active ? "text-kora-green" : "text-slate-300"
              )}
            >
              {t(item.key)}
            </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <SearchBar compact className="hidden sm:block" />
          <LangToggle locale={locale} />
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-2 sm:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
