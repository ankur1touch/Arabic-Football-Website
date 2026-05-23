"use client";

import { useTranslations } from "next-intl";
import { LayoutGrid } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const SOURCES = [
  "BBC Sport",
  "Sky Sports",
  "Goal.com",
  "ESPN",
  "FIFA",
  "90min",
  "MARCA",
  "The Guardian",
  "SofaScore",
  "Flashscore",
];

export function SourcesWidget() {
  const t = useTranslations("news");
  const th = useTranslations("home");

  return (
    <div className="kora-card rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-kora-teal" />
        <h3 className="font-semibold text-slate-100">{t("sources")}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {SOURCES.map((source) => (
          <Badge key={source} variant="outline">
            {source}
          </Badge>
        ))}
        <Badge variant="outline">{th("moreSources")}</Badge>
      </div>
    </div>
  );
}
