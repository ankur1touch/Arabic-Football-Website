import { setRequestLocale } from "next-intl/server";
import { WorldCupClient } from "@/components/worldcup/WorldCupClient";

type Props = { params: Promise<{ locale: string }> };

export default async function WorldCupPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WorldCupClient locale={locale as "ar" | "en"} />;
}
