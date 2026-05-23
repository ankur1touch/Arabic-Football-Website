import { setRequestLocale } from "next-intl/server";
import { RankingsClient } from "@/components/rankings/RankingsClient";

type Props = { params: Promise<{ locale: string }> };

export default async function WorldRankingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <RankingsClient locale={locale as "ar" | "en"} />;
}
