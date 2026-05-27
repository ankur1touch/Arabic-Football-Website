"use client";

import { useState, FormEvent } from "react";
import { Search } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

export function SearchBar({ className, compact }: { className?: string; compact?: boolean }) {
  const t = useTranslations("search");
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={onSubmit} className={cn("relative", className)} suppressHydrationWarning>
      <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
        suppressHydrationWarning
        autoComplete="off"
        className={cn(
          "w-full rounded-xl border border-white/10 bg-white/5 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-kora-green/50 focus:bg-white/[0.07] focus:outline-none",
          compact ? "ps-9 pe-3 max-w-[200px] lg:max-w-[240px]" : "ps-9 pe-4 max-w-xl"
        )}
      />
    </form>
  );
}
