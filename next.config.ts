import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "www.fifa.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ichef.bbci.co.uk" },
      { protocol: "https", hostname: "**.bbci.co.uk" },
      { protocol: "https", hostname: "**.bbc.com" },
      { protocol: "https", hostname: "i.guim.co.uk" },
      { protocol: "https", hostname: "**.guim.co.uk" },
      { protocol: "https", hostname: "**.365dm.com" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "media.api-sports.io" },
      { protocol: "https", hostname: "crests.football-data.org" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "**.espncdn.com" },
      { protocol: "https", hostname: "**.skysports.com" },
      { protocol: "https", hostname: "**.theguardian.com" },
      { protocol: "https", hostname: "**.goal.com" },
      { protocol: "https", hostname: "**.marca.com" },
      { protocol: "https", hostname: "**.uecdn.es" },
      { protocol: "https", hostname: "**.90min.com" },
      { protocol: "https", hostname: "**.minutemediacdn.com" },
    ],
  },
};

export default withNextIntl(nextConfig);
