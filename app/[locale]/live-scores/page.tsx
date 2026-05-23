import { setRequestLocale } from "next-intl/server";
import { LiveScoresPageClient } from "@/components/scores/LiveScoresPageClient";

type Props = { params: Promise<{ locale: string }> };

export default async function LiveScoresPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LiveScoresPageClient locale={locale as "ar" | "en"} />;
}
