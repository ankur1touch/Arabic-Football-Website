import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.fifa.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ichef.bbci.co.uk" },
      { protocol: "https", hostname: "via.placeholder.com" },
      { protocol: "https", hostname: "media.api-sports.io" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "**.espncdn.com" },
      { protocol: "https", hostname: "**.skysports.com" },
      { protocol: "https", hostname: "**.theguardian.com" },
      { protocol: "https", hostname: "**.goal.com" },
      { protocol: "https", hostname: "**.marca.com" },
      { protocol: "https", hostname: "**.uecdn.es" },
    ],
  },
};

export default withNextIntl(nextConfig);
