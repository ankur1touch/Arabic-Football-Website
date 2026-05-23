import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import { ChunkRecovery } from "@/components/ChunkRecovery";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const notoArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
});

export const metadata: Metadata = {
  title: "كورة — Kora | Arabic Football Portal",
  description: "Latest world football news in Arabic and English",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="bg-kora-dark">
      <body
        className={`${inter.variable} ${notoArabic.variable} min-h-screen bg-kora-dark text-slate-100 antialiased`}
      >
        <ChunkRecovery />
        {children}
      </body>
    </html>
  );
}
