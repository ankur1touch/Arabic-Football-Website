import { setRequestLocale } from "next-intl/server";
import { PlayersClient } from "@/components/players/PlayersClient";

type Props = { params: Promise<{ locale: string }> };

export default async function PlayersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <PlayersClient locale={locale as "ar" | "en"} />;
}
