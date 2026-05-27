import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Only run locale middleware on app routes — never on _next static assets
  matcher: ["/", "/(ar|en)/:path*"],
};
