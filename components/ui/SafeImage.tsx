"use client";

import Image from "next/image";
import { useState } from "react";
import { isNextImageHost } from "@/lib/image-hosts";
import { cn } from "@/lib/cn";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  loading?: "lazy" | "eager";
  fallbackClassName?: string;
  onError?: () => void;
}

export function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className = "",
  sizes,
  quality,
  priority,
  loading,
  fallbackClassName,
  onError,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-white/5 text-slate-500",
          fill && "absolute inset-0 h-full w-full",
          fallbackClassName,
          className
        )}
        aria-hidden
      >
        ⚽
      </div>
    );
  }

  if (!isNextImageHost(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn("absolute inset-0 h-full w-full object-cover", className)}
          loading={loading ?? "lazy"}
          onError={() => {
            setFailed(true);
            onError?.();
          }}
        />
      );
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={loading ?? "lazy"}
        onError={() => {
          setFailed(true);
          onError?.();
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      sizes={sizes}
      quality={quality}
      priority={priority}
      loading={loading}
      className={className}
      onError={() => {
        setFailed(true);
        onError?.();
      }}
    />
  );
}
