import type { Metadata } from "next";

export function getLocaleMetadata(locale: string): Metadata {
  const isAr = locale === "ar";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return {
    title: isAr ? "كورة — بوابة كرة القدم العربية" : "KORA — Arabic Football Portal",
    description: isAr
      ? "أحدث أخبار كرة القدم العالمية بالعربية والإنجليزية"
      : "Latest world football news in Arabic and English",
    openGraph: {
      title: isAr ? "كورة" : "KORA",
      description: isAr
        ? "أخبار ومباريات وترتيبات كرة القدم"
        : "Football news, matches and standings",
      url: `${baseUrl}/${locale}`,
      siteName: "Kora",
      locale: isAr ? "ar_SA" : "en_US",
      type: "website",
    },
  };
}
