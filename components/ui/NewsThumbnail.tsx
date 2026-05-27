"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  DEFAULT_NEWS_IMAGE,
  isLogoImage,
  isVideoArticle,
  resolveNewsImage,
} from "@/lib/news-media";
import type { NewsArticle } from "@/types/news";
import { SafeImage } from "@/components/ui/SafeImage";

export function NewsThumbnail({
  article,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  article: Pick<NewsArticle, "imageUrl" | "category" | "videoUrl">;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const primary = resolveNewsImage(article);
  const [src, setSrc] = useState(primary);
  const isVideo = isVideoArticle(article);
  const logoStyle = isLogoImage(src);

  useEffect(() => {
    setSrc(resolveNewsImage(article));
  }, [article]);

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        logoStyle
          ? "bg-gradient-to-br from-kora-mid to-kora-dark"
          : "bg-kora-mid",
        className
      )}
    >
      <SafeImage
        key={src}
        src={src}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "transition duration-300 group-hover:scale-105",
          logoStyle ? "object-contain p-3" : "object-cover"
        )}
        fallbackClassName={logoStyle ? "bg-gradient-to-br from-kora-mid to-kora-dark" : "bg-kora-mid"}
        onError={() => {
          if (src !== DEFAULT_NEWS_IMAGE) setSrc(DEFAULT_NEWS_IMAGE);
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-kora-dark/60 via-transparent to-transparent pointer-events-none" />
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-kora-green/90 text-white shadow-lg">
            <Play className="h-5 w-5 fill-current pl-0.5" />
          </span>
        </div>
      )}
    </div>
  );
}
