"use client";

import { TeamCrest } from "@/components/ui/TeamCrest";

/** @deprecated Use TeamCrest instead */
export function TeamBadge({
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
  return <TeamCrest name={name} logo={logo} size={size} className={className} />;
}
