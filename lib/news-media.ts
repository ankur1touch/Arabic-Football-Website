import type { NewsArticle, NewsCategory } from "@/types/news";

/** Reliable football CDN fallback. */
export const DEFAULT_NEWS_IMAGE =
  "https://media.api-sports.io/football/leagues/1.png";

const CATEGORY_IMAGES: Record<NewsCategory, string> = {
  "la-liga": "https://media.api-sports.io/football/leagues/140.png",
  "premier-league": "https://media.api-sports.io/football/leagues/39.png",
  "champions-league": "https://media.api-sports.io/football/leagues/2.png",
  "world-cup": "https://media.api-sports.io/football/leagues/1.png",
  transfers: "https://media.api-sports.io/football/leagues/2.png",
  breaking: "https://media.api-sports.io/football/leagues/1.png",
  general: "https://media.api-sports.io/football/leagues/1.png",
};

export function youtubeVideoId(videoUrl: string): string | null {
  const match = videoUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  return match?.[1] ?? null;
}

export function youtubeThumbnail(videoUrl: string): string | null {
  const id = youtubeVideoId(videoUrl);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export function youtubeWatchUrl(videoUrl: string): string | null {
  const id = youtubeVideoId(videoUrl);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}

export function youtubeEmbedUrl(videoUrl: string): string | null {
  const id = youtubeVideoId(videoUrl);
  return id
    ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1`
    : null;
}

export function isLogoImage(url: string): boolean {
  return url.includes("media.api-sports.io");
}

export function resolveNewsImage(
  article: Pick<NewsArticle, "imageUrl" | "category" | "videoUrl">
): string {
  if (article.videoUrl) {
    const thumb = youtubeThumbnail(article.videoUrl);
    if (thumb) return thumb;
  }
  return article.imageUrl ?? CATEGORY_IMAGES[article.category] ?? DEFAULT_NEWS_IMAGE;
}

export function isVideoArticle(article: Pick<NewsArticle, "videoUrl">): boolean {
  return Boolean(article.videoUrl && youtubeVideoId(article.videoUrl ?? ""));
}
