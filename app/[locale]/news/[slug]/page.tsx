import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { readJsonData } from "@/lib/data";
import { NewsVideoPlayer } from "@/components/news/NewsVideoPlayer";
import { NewsThumbnail } from "@/components/ui/NewsThumbnail";
import { Badge } from "@/components/ui/Badge";
import { isVideoArticle } from "@/lib/news-media";
import type { NewsArticle } from "@/types/news";
import { formatDistanceToNow } from "@/lib/format";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const loc = locale as "ar" | "en";

  const data = readJsonData<{ articles: NewsArticle[] }>("news.json");
  const article = data.articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const title = isAr ? article.titleAr : article.titleEn;
  const hasVideo = isVideoArticle(article);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/news"
        className="mb-6 inline-block text-sm text-kora-green hover:underline"
      >
        ← {isAr ? "العودة للأخبار" : "Back to News"}
      </Link>

      {hasVideo && article.videoUrl ? (
        <>
          <Badge variant="live" className="mb-3">
            {isAr ? "فيديو" : "Video"}
          </Badge>
          <NewsVideoPlayer videoUrl={article.videoUrl} title={title} locale={loc} />
        </>
      ) : (
        <NewsThumbnail
          article={article}
          className="mb-6 h-56 rounded-2xl md:h-72"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />
      )}

      <p className="text-sm text-slate-500">
        {article.source} • {formatDistanceToNow(article.publishedAt, loc)}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-slate-100">{title}</h1>
      <p className="mt-2 text-lg text-slate-400">
        {isAr ? article.titleEn : article.titleAr}
      </p>
      <div className="prose prose-invert mt-8 max-w-none">
        <p className="text-lg leading-relaxed text-slate-200">
          {isAr ? article.bodyAr : article.bodyEn}
        </p>
        <hr className="my-8 border-white/10" />
        <p className="text-sm text-slate-500">
          {isAr ? "Original (EN)" : "النص العربي"}
        </p>
        <p className="leading-relaxed text-slate-300">
          {isAr ? article.bodyEn : article.bodyAr}
        </p>
      </div>
    </article>
  );
}
