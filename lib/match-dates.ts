import type { Match } from "@/types/match";

export const MATCH_TZ = "Asia/Riyadh";

/** YYYY-MM-DD in the given timezone (en-CA gives ISO-like date). */
export function dateKeyInTz(iso: string | Date, timeZone = MATCH_TZ): string {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export function isMatchToday(kickoff: string, timeZone = MATCH_TZ): boolean {
  return dateKeyInTz(kickoff, timeZone) === dateKeyInTz(new Date(), timeZone);
}

/** Live or scheduled kickoff today (KSA). */
export function filterTodayMatches(matches: Match[], limit = 5): Match[] {
  return matches
    .filter((m) => {
      if (m.status === "live") return isMatchToday(m.kickoff);
      if (m.status === "upcoming") return isMatchToday(m.kickoff);
      return false;
    })
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())
    .slice(0, limit);
}

/** Next future fixtures (excludes past kickoffs). */
export function filterNextUpcoming(matches: Match[], limit = 5): Match[] {
  const now = Date.now();
  return matches
    .filter((m) => m.status === "upcoming" && new Date(m.kickoff).getTime() > now)
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())
    .slice(0, limit);
}

export function formatKickoffLabel(
  kickoff: string,
  locale: "ar" | "en",
  timeZone = MATCH_TZ
): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(kickoff));
}

export function formatMatchStatusLabel(
  detail: { status: string; date: string },
  locale: "ar" | "en"
): string {
  const s = detail.status.toLowerCase();
  if (s.includes("live")) return detail.status;
  if (s.includes("full") || s === "ft" || s.includes("finished")) return detail.status;
  if (s.includes("not started") || s.includes("scheduled") || s.includes("ns")) {
    return locale === "ar"
      ? `مجدولة · ${formatKickoffLabel(detail.date, locale)}`
      : `Scheduled · ${formatKickoffLabel(detail.date, locale)}`;
  }
  return detail.status;
}
