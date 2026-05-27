import { Bebas_Neue, Cairo, Inter, Noto_Naskh_Arabic } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

export const notoArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
});

export const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export function localeFontVariables(locale: "ar" | "en"): string {
  return locale === "ar"
    ? `${notoArabic.variable} ${cairo.variable}`
    : `${inter.variable} ${bebasNeue.variable}`;
}
