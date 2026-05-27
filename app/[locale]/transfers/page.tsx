import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { NewsListingClient } from "@/components/news/NewsListingClient";
import { Skeleton } from "@/components/ui/Skeleton";

type Props = { params: Promise<{ locale: string }> };

export default async function TransfersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<Skeleton className="mx-auto mt-8 h-10 w-48 max-w-7xl" />}>
      <NewsListingClient locale={locale as "ar" | "en"} defaultCategory="transfers" />
    </Suspense>
  );
}
