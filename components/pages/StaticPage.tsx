import type { Locale } from "@/store/features/localeSlice";

export function StaticPage({
  title,
  children,
}: {
  locale?: Locale;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display mb-6 text-4xl text-white">{title}</h1>
      <div className="prose prose-invert max-w-none space-y-4 text-slate-300">{children}</div>
    </div>
  );
}
