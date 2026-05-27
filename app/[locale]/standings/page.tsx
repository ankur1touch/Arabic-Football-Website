import { setRequestLocale } from "next-intl/server";
import { StandingsClient } from "@/components/standings/StandingsClient";

type Props = { params: Promise<{ locale: string }> };

export default async function StandingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StandingsClient locale={locale as "ar" | "en"} />;
}
