import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { MatchDetailClient } from "@/components/matches/MatchDetailClient";
import { isMockMatchId } from "@/lib/mock-match-data";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function MatchDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  if (isMockMatchId(id)) {
    return <MatchDetailClient locale={locale as "ar" | "en"} matchId={id} />;
  }

  const numericId = Number(id);
  if (Number.isNaN(numericId)) notFound();

  return (
    <MatchDetailClient locale={locale as "ar" | "en"} matchId={numericId} />
  );
}
