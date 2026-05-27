"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import type { Locale } from "@/store/features/localeSlice";

interface LangToggleProps {
  locale: Locale;
}

export function LangToggle({ locale }: LangToggleProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchTo = (next: Locale) => {
    if (next !== locale) router.replace(pathname, { locale: next });
  };

  if (!mounted) {
    return (
      <div
        className="h-[30px] w-[72px] rounded-lg border border-white/10 bg-white/5"
        aria-hidden
      />
    );
  }

  return (
    <div
      className="flex overflow-hidden rounded-lg border border-white/10 text-xs font-semibold"
      suppressHydrationWarning
    >
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => switchTo("ar")}
        className={cn(
          "px-3 py-1.5 transition-colors",
          locale === "ar" ? "bg-kora-green text-white" : "text-slate-400 hover:text-white"
        )}
      >
        عربي
      </button>
      <button
        type="button"
        suppressHydrationWarning
        onClick={() => switchTo("en")}
        className={cn(
          "px-3 py-1.5 transition-colors",
          locale === "en" ? "bg-kora-green text-white" : "text-slate-400 hover:text-white"
        )}
      >
        EN
      </button>
    </div>
  );
}
