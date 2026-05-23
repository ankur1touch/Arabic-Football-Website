"use client";

import { ExternalLink } from "lucide-react";
import { youtubeEmbedUrl, youtubeWatchUrl } from "@/lib/news-media";

export function NewsVideoPlayer({
  videoUrl,
  title,
  locale,
}: {
  videoUrl: string;
  title: string;
  locale: "ar" | "en";
}) {
  const embed = youtubeEmbedUrl(videoUrl);
  const watch = youtubeWatchUrl(videoUrl);

  if (!embed) return null;

  return (
    <div className="mb-8">
      <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-lg shadow-black/40">
        <iframe
          src={embed}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      {watch && (
        <a
          href={watch}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm text-kora-green hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          {locale === "ar" ? "شاهد على يوتيوب" : "Watch on YouTube"}
        </a>
      )}
    </div>
  );
}
