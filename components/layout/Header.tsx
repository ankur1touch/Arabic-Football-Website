"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X } from "lucide-react";
import { LangToggle } from "@/components/ui/LangToggle";
import { SearchBar } from "@/components/layout/SearchBar";
import { cn } from "@/lib/cn";
import type { Locale } from "@/store/features/localeSlice";

const NAV_KEYS = [
  { href: "/", key: "home" },
  { href: "/news", key: "news" },
  { href: "/world-cup", key: "worldCup" },
  { href: "/matches", key: "matches" },
  { href: "/standings", key: "standings" },
  { href: "/teams", key: "nationalTeams" },
  { href: "/transfers", key: "transfers" },
] as const;

export function Header({ locale }: { locale: Locale }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const linkClass = (href: string) => {
    const active =
      href === "/"
        ? pathname === "/"
        : pathname === href || pathname.startsWith(`${href}/`);
    return cn(
      "text-sm font-medium transition-colors hover:text-kora-green",
      active ? "text-kora-green" : "text-slate-300"
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-kora-mid/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-kora-green text-lg">
              ⚽
            </span>
            <div className="leading-tight">
              <span className="font-display block text-lg tracking-wide text-white">
                {locale === "ar" ? "كورة" : "KORA"}
              </span>
              <span className="block text-[10px] text-slate-400">
                {locale === "ar" ? "KORA" : "كورة"}
              </span>
            </div>
          </Link>
          <Link
            href="/world-cup"
            className="hidden items-center gap-1.5 rounded-full border border-kora-gold/30 bg-kora-gold/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-kora-gold transition hover:bg-kora-gold/20 sm:inline-flex"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-kora-alert" />
            WC 2026
          </Link>
        </div>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_KEYS.map((item) => (
            <Link key={item.key} href={item.href} className={linkClass(item.href)}>
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <SearchBar compact className="hidden sm:block" />
          <LangToggle locale={locale} />
          <button
            type="button"
            suppressHydrationWarning
            className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/5 px-4 py-3 lg:hidden">
          <div className="mb-3 sm:hidden">
            <SearchBar />
          </div>
          <div className="flex flex-col gap-2">
            {NAV_KEYS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={cn("rounded-lg px-3 py-2", linkClass(item.href))}
                onClick={() => setOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/search"
              className={cn("rounded-lg px-3 py-2", linkClass("/search"))}
              onClick={() => setOpen(false)}
            >
              {t("search")}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
