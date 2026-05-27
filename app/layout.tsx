import type { Metadata } from "next";
import { ChunkRecovery } from "@/components/ChunkRecovery";
import "./globals.css";

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
    <html suppressHydrationWarning className="bg-kora-dark">
      <body className="min-h-screen bg-kora-dark text-slate-100 antialiased">
        <ChunkRecovery />
        {children}
      </body>
    </html>
  );
}
