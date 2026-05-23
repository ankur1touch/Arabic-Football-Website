import { setRequestLocale } from "next-intl/server";
import { TeamsClient } from "@/components/teams/TeamsClient";

type Props = { params: Promise<{ locale: string }> };

export default async function TeamsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TeamsClient locale={locale as "ar" | "en"} />;
}
