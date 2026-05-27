import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { readJsonData } from "@/lib/data";
import type { Country } from "@/types/country";
import { CountryClient } from "@/components/country/CountryClient";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function CountryPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const countries = readJsonData<Country[]>("countries.json");
  if (!countries.find((c) => c.id === id)) notFound();

  return <CountryClient locale={locale as "ar" | "en"} countryId={id} />;
}
