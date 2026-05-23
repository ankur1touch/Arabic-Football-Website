import { setRequestLocale } from "next-intl/server";
import { TeamDetailClient } from "@/components/teams/TeamDetailClient";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function TeamDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <TeamDetailClient locale={locale as "ar" | "en"} teamId={id} />;
}
