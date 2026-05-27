"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const t = useTranslations("common");
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <p className="text-kora-alert">{message ?? t("error")}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t("retry")}
        </Button>
      )}
    </div>
  );
}
