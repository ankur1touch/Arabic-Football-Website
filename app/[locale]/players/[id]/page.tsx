import { setRequestLocale } from "next-intl/server";
import { PlayerDetailClient } from "@/components/players/PlayerDetailClient";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function PlayerDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <PlayerDetailClient locale={locale as "ar" | "en"} playerId={id} />;
}
