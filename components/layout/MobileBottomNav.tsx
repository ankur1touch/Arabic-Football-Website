"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Home, Calendar, Trophy, BarChart3, User } from "lucide-react";
import { cn } from "@/lib/cn";
const ITEMS = [
  { href: "/", icon: Home, key: "home" },
  { href: "/matches", icon: Calendar, key: "matches" },
  { href: "/tournaments/wc2026", icon: Trophy, key: "leagues" },
  { href: "/world-rankings", icon: BarChart3, key: "stats" },
  { href: "/teams", icon: User, key: "account" },
] as const;

export function MobileBottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-kora-mid/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around py-2">
        {ITEMS.map(({ href, icon: Icon, key }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={key}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]",
                active ? "text-kora-green" : "text-slate-500"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{t(key)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
