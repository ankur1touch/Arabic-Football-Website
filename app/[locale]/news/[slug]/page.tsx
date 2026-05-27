import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getArticleBySlug } from "@/lib/news-feed";
import { NewsVideoPlayer } from "@/components/news/NewsVideoPlayer";
import { NewsThumbnail } from "@/components/ui/NewsThumbnail";
import { Badge } from "@/components/ui/Badge";
import { isVideoArticle } from "@/lib/news-media";
import { formatDistanceToNow } from "@/lib/format";

export const revalidate = 300;
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";
  const loc = locale as "ar" | "en";

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const title = isAr ? article.titleAr : article.titleEn;
  const excerpt = isAr ? article.excerptAr : article.excerptEn;
  const body = isAr ? article.bodyAr : article.bodyEn;
  const altBody = isAr ? article.bodyEn : article.bodyAr;
  const hasVideo = isVideoArticle(article);
  const isRss = article.id.startsWith("rss-");

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
      {excerpt && excerpt !== title && (
        <p className="mt-3 text-lg text-slate-400">{excerpt}</p>
      )}
      <div className="prose prose-invert mt-8 max-w-none">
        <p className="text-lg leading-relaxed text-slate-200">{body || excerpt}</p>
        {!isRss && altBody && altBody !== body && (
          <>
            <hr className="my-8 border-white/10" />
            <p className="text-sm text-slate-500">
              {isAr ? "Original (EN)" : "النص العربي"}
            </p>
            <p className="leading-relaxed text-slate-300">{altBody}</p>
          </>
        )}
        {isRss && (
          <p className="mt-6 text-xs text-slate-500">
            {isAr
              ? "مصدر خارجي — المحتوى الكامل قد يكون متاحاً على موقع المصدر."
              : "External source — full story may be available on the publisher site."}
          </p>
        )}
      </div>
    </article>
  );
}
