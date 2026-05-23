export function formatDistanceToNow(dateStr: string, locale: "ar" | "en"): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffMins < 60) {
    return locale === "ar" ? `منذ ${diffMins} د` : `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return locale === "ar" ? `منذ ${diffHours} س` : `${diffHours}h ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return locale === "ar" ? `منذ ${diffDays} ي` : `${diffDays}d ago`;
}
