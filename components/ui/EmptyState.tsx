"use client";

import { useTranslations } from "next-intl";

export function EmptyState({ message }: { message?: string }) {
  const t = useTranslations("common");
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
      <span className="text-3xl opacity-40">⚽</span>
      <p className="text-slate-400">{message ?? t("noResults")}</p>
    </div>
  );
}
