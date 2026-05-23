import { setRequestLocale } from "next-intl/server";
import { MatchesClient } from "@/components/matches/MatchesClient";

type Props = { params: Promise<{ locale: string }> };

export default async function MatchesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MatchesClient locale={locale as "ar" | "en"} />;
}
