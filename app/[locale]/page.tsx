import { setRequestLocale } from "next-intl/server";
import { getHomepageData } from "@/lib/homepage-data";
import { HomePageClient } from "@/components/home/HomePageClient";

export const revalidate = 300;

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const initialData = await getHomepageData();

  return (
    <HomePageClient
      locale={locale as "ar" | "en"}
      initialData={initialData}
    />
  );
}
