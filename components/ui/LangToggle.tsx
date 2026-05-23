"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import type { Locale } from "@/store/features/localeSlice";

interface LangToggleProps {
  locale: Locale;
}

export function LangToggle({ locale }: LangToggleProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: Locale) => {
    if (next !== locale) router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex overflow-hidden rounded-lg border border-white/10 text-xs font-semibold">
      <button
        onClick={() => switchTo("ar")}
        className={cn(
          "px-3 py-1.5 transition-colors",
          locale === "ar" ? "bg-kora-green text-white" : "text-slate-400 hover:text-white"
        )}
      >
        عربي
      </button>
      <button
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
