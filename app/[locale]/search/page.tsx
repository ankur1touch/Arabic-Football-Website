import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { SearchClient } from "@/components/search/SearchClient";
import { Skeleton } from "@/components/ui/Skeleton";

type Props = { params: Promise<{ locale: string }> };

export default async function SearchPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl space-y-4 px-4 py-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-12 w-full max-w-xl" />
        </div>
      }
    >
      <SearchClient locale={locale as "ar" | "en"} />
    </Suspense>
  );
}
