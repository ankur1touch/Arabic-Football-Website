"use client";

import { Link } from "@/i18n/routing";
import type { FixtureEvent } from "@/types/fixture-detail";
import type { Locale } from "@/store/features/localeSlice";

export function MatchEventTimeline({
  events,
  locale,
}: {
  events: FixtureEvent[];
  locale: Locale;
}) {
  if (!events.length) {
    return (
      <p className="py-8 text-center text-slate-400">
        {locale === "ar" ? "لا توجد أحداث" : "No events available"}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {events.map((e, i) => (
        <li
          key={i}
          className="flex justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm"
        >
          <span>
            {e.time}&apos;{" "}
            {e.playerId ? (
              <Link href={`/players/${e.playerId}`} className="text-kora-green hover:underline">
                {e.player}
              </Link>
            ) : (
              e.player
            )}{" "}
            ({e.team})
            {e.assist && (
              <>
                {" "}
                —{" "}
                {e.assistId ? (
                  <Link href={`/players/${e.assistId}`} className="text-slate-400 hover:text-kora-green">
                    {e.assist}
                  </Link>
                ) : (
                  e.assist
                )}
              </>
            )}
          </span>
          <span className="text-slate-400">
            {e.type} {e.detail}
          </span>
        </li>
      ))}
    </ul>
  );
}
