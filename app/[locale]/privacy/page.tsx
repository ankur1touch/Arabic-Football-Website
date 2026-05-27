import { setRequestLocale, getTranslations } from "next-intl/server";
import { StaticPage } from "@/components/pages/StaticPage";

type Props = { params: Promise<{ locale: string }> };

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("static.privacy");

  return (
    <StaticPage locale={locale as "ar" | "en"} title={t("title")}>
      <p>{t("p1")}</p>
      <p>{t("p2")}</p>
    </StaticPage>
  );
}
