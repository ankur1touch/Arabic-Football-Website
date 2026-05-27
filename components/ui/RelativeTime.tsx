"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "@/lib/format";
import type { Locale } from "@/store/features/localeSlice";

export function RelativeTime({
  date,
  locale,
  className,
}: {
  date: string;
  locale: Locale;
  className?: string;
}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setLabel(formatDistanceToNow(date, locale));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [date, locale]);

  return (
    <time dateTime={date} className={className} suppressHydrationWarning>
      {label ?? "\u00a0"}
    </time>
  );
}
