import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getLocaleMetadata } from "./metadata";
import type { Metadata } from "next";
import { StoreProvider } from "@/store/StoreProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreakingTicker } from "@/components/layout/BreakingTicker";
import { MobileBottomNavLazy } from "@/components/layout/MobileBottomNavLazy";
import { localeFontVariables } from "@/lib/fonts";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getLocaleMetadata(locale);
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const loc = locale as "ar" | "en";

  return (
    <NextIntlClientProvider messages={messages}>
      <StoreProvider locale={loc}>
        <LocaleShell locale={loc} dir={dir}>
          {children}
        </LocaleShell>
      </StoreProvider>
    </NextIntlClientProvider>
  );
}

function LocaleShell({
  children,
  locale,
  dir,
}: {
  children: React.ReactNode;
  locale: "ar" | "en";
  dir: "rtl" | "ltr";
}) {
  return (
    <div
      dir={dir}
      lang={locale}
      className={`flex min-h-screen flex-col bg-kora-dark pb-20 md:pb-0 ${localeFontVariables(locale)} ${locale === "en" ? "font-sans" : "font-arabic"}`}
    >
      <Header locale={locale} />
      <BreakingTicker locale={locale} />
      <main className="flex-1 bg-kora-dark">{children}</main>
      <Footer locale={locale} />
      <MobileBottomNavLazy />
    </div>
  );
}
