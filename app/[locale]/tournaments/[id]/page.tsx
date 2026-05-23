import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { readJsonData } from "@/lib/data";
import { fetchWcStandings } from "@/lib/football-proxy/services";
import { withMockFallback, mockTournaments } from "@/lib/football-proxy/fallback";
import type { Tournament } from "@/types/tournament";

type Props = { params: Promise<{ locale: string; id: string }> };

async function loadTournament(id: string): Promise<Tournament | undefined> {
  if (id === "wc2026") {
    const tournaments = await withMockFallback(
      async () => [await fetchWcStandings()],
      mockTournaments
    );
    return tournaments.find((t) => t.id === id) ?? tournaments[0];
  }
  const data = readJsonData<{ tournaments: Tournament[] }>("tournaments.json");
  return data.tournaments.find((t) => t.id === id);
}

export default async function TournamentDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const isAr = locale === "ar";

  const tournament = await loadTournament(id);
  if (!tournament) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link href="/tournaments" className="text-sm text-kora-green hover:underline">
        ← {isAr ? "البطولات" : "Tournaments"}
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-100">
        {isAr ? tournament.nameAr : tournament.name}
      </h1>
      <p className="text-slate-400">{tournament.season}</p>

      {tournament.standings.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">
            {isAr ? "ترتيب المجموعات" : "Group Standings"}
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">{isAr ? "فريق" : "Team"}</th>
                  <th className="p-3">P</th>
                  <th className="p-3">GD</th>
                  <th className="p-3">Pts</th>
                </tr>
              </thead>
              <tbody>
                {tournament.standings.map((row) => (
                  <tr key={`${row.rank}-${row.team}`} className="border-t border-white/5">
                    <td className="p-3 text-slate-400">{row.rank}</td>
                    <td className="p-3 font-medium text-slate-100">
                      {row.teamId ? (
                        <Link
                          href={`/teams/${row.teamId}`}
                          className="hover:text-kora-green hover:underline"
                        >
                          {isAr ? row.teamAr : row.team}
                        </Link>
                      ) : (
                        isAr ? row.teamAr : row.team
                      )}
                    </td>
                    <td className="p-3">{row.played}</td>
                    <td className="p-3 text-kora-teal">
                      {row.gd > 0 ? `+${row.gd}` : row.gd}
                    </td>
                    <td className="p-3 font-bold text-kora-green">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tournament.topScorers.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-100">
            {isAr ? "الهدافون" : "Top Scorers"}
          </h2>
          <ul className="space-y-2">
            {tournament.topScorers.map((s) => (
              <li
                key={s.rank}
                className="flex justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="text-slate-100">
                  {s.rank}.{" "}
                  {s.playerId ? (
                    <Link
                      href={`/players/${s.playerId}`}
                      className="hover:text-kora-green hover:underline"
                    >
                      {isAr ? s.playerAr : s.player}
                    </Link>
                  ) : (
                    isAr ? s.playerAr : s.player
                  )}{" "}
                  (
                  {s.teamId ? (
                    <Link
                      href={`/teams/${s.teamId}`}
                      className="text-slate-400 hover:text-kora-green hover:underline"
                    >
                      {s.team}
                    </Link>
                  ) : (
                    s.team
                  )}
                  )
                </span>
                <span className="font-bold text-kora-green">{s.goals}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
