"use client";

import dynamic from "next/dynamic";

const MobileBottomNav = dynamic(
  () =>
    import("@/components/layout/MobileBottomNav").then((m) => ({
      default: m.MobileBottomNav,
    })),
  { ssr: false }
);

export function MobileBottomNavLazy() {
  return <MobileBottomNav />;
}
