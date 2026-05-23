import { setRequestLocale } from "next-intl/server";
import { TournamentsClient } from "@/components/tournaments/TournamentsClient";

type Props = { params: Promise<{ locale: string }> };

export default async function TournamentsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TournamentsClient locale={locale as "ar" | "en"} />;
}
