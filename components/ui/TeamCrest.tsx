"use client";

import { cn } from "@/lib/cn";
import { SafeImage } from "@/components/ui/SafeImage";

export function TeamCrest({
  name,
  logo,
  size = "md",
  className,
}: {
  name: string;
  logo?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass =
    size === "lg"
      ? "h-16 w-16 text-lg"
      : size === "sm"
        ? "h-8 w-8 text-xs"
        : "h-12 w-12 text-sm";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (logo) {
    return (
      <div className={cn("relative shrink-0", sizeClass, className)}>
        <SafeImage
          src={logo}
          alt={name}
          fill
          className="object-contain"
          sizes={size === "lg" ? "64px" : size === "sm" ? "32px" : "48px"}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeClass,
        "flex shrink-0 items-center justify-center rounded-full border border-white/15 bg-kora-mid font-bold text-kora-green",
        className
      )}
      aria-hidden
    >
      {initials || "?"}
    </div>
  );
}
