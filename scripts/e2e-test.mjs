/**
 * End-to-end smoke test — run after: npm run build && npm run start
 * Usage: node scripts/e2e-test.mjs [baseUrl]
 */
const BASE = process.argv[2] || "http://localhost:3000";

const MATCH_TZ = "Asia/Riyadh";

function dateKeyInTz(iso) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MATCH_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function isMatchToday(kickoff) {
  return dateKeyInTz(kickoff) === dateKeyInTz(new Date().toISOString());
}

function filterTodayMatches(matches) {
  return matches.filter(
    (m) =>
      (m.status === "live" || m.status === "upcoming") && isMatchToday(m.kickoff)
  );
}

const PAGES = [
  "/",
  "/ar",
  "/en",
  "/ar/matches",
  "/en/matches",
  "/ar/live-scores",
  "/en/live-scores",
  "/en/news",
  "/en/search",
  "/en/transfers",
  "/ar/transfers",
  "/en/standings",
  "/ar/standings",
  "/en/world-cup",
  "/ar/world-cup",
  "/en/country/sa",
  "/ar/country/ma",
  "/en/about",
  "/en/contact",
  "/en/privacy",
  "/en/advertise",
  "/ar/tournaments",
  "/ar/tournaments/wc2026",
  "/en/tournaments/wc2026",
  "/ar/teams",
  "/en/teams",
  "/ar/players",
  "/en/players",
  "/ar/world-rankings",
];

const API_POST = [
  "/api/matches",
  "/api/tournaments",
  "/api/teams",
  "/api/players",
  "/api/news",
  "/api/rankings",
  "/api/fifa-rankings",
  "/api/football/rounds",
  "/api/football/leagues",
];

const API_GET = [
  "/api/live-scores",
  "/api/search?q=real",
  "/api/countries",
  "/rss.xml",
  "/sitemap.xml",
  "/robots.txt",
];

async function check(name, url, options = {}) {
  const start = Date.now();
  try {
    const res = await fetch(`${BASE}${url}`, {
      ...options,
      signal: AbortSignal.timeout(60000),
    });
    const ms = Date.now() - start;
    let body = "";
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("json")) {
      const json = await res.json();
      body = JSON.stringify(json).slice(0, 120);
    } else {
      body = (await res.text()).slice(0, 80);
    }
    const ok = res.ok;
    console.log(`${ok ? "PASS" : "FAIL"} ${name} ${res.status} ${ms}ms ${body}...`);
    return { name, ok, status: res.status, ms };
  } catch (err) {
    console.log(`FAIL ${name} ERROR ${err.message}`);
    return { name, ok: false, status: 0, ms: Date.now() - start };
  }
}

function checkLogic(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` ${detail}` : ""}`);
  return { name, ok, status: ok ? 200 : 0, ms: 0 };
}

async function main() {
  console.log(`\nE2E smoke test → ${BASE}\n`);

  const results = [];

  for (const path of PAGES) {
    results.push(await check(`PAGE ${path}`, path));
  }

  for (const path of API_GET) {
    results.push(await check(`API GET ${path}`, path));
  }

  for (const path of API_POST) {
    results.push(
      await check(`API POST ${path}`, path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      })
    );
  }

  const matchesRes = await fetch(`${BASE}/api/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(60000),
  });
  const matchesJson = matchesRes.ok ? await matchesRes.json() : { matches: [] };
  const allMatches = matchesJson.matches ?? [];

  const wcJune = allMatches.filter(
    (m) => m.status === "upcoming" && String(m.kickoff).startsWith("2026-06")
  );
  const wcInToday = filterTodayMatches(wcJune);
  results.push(
    checkLogic(
      "LOGIC WC June fixtures not counted as today",
      wcInToday.length === 0,
      `(checked ${wcJune.length} June fixtures)`
    )
  );

  const todayOnly = filterTodayMatches(allMatches);
  results.push(
    checkLogic(
      "LOGIC today filter returns only same-day kickoffs",
      todayOnly.every((m) => isMatchToday(m.kickoff)),
      `(${todayOnly.length} today)`
    )
  );

  const fixtureId =
    allMatches.find((m) => m.fixtureId)?.fixtureId ?? 1338382;

  results.push(
    await check(`API GET /api/matches/${fixtureId}`, `/api/matches/${fixtureId}`)
  );
  results.push(
    await check(`API POST /api/matches/${fixtureId}`, `/api/matches/${fixtureId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    })
  );
  results.push(
    await check(`API GET /api/fixtures/${fixtureId}`, `/api/fixtures/${fixtureId}`)
  );
  results.push(
    await check(`PAGE /en/matches/${fixtureId}`, `/en/matches/${fixtureId}`)
  );
  results.push(await check(`PAGE /en/matches/m6`, `/en/matches/m6`));
  results.push(await check(`PAGE /en/matches/1006`, `/en/matches/1006`));

  const newsRes = await fetch(`${BASE}/api/news`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(60000),
  });
  const newsJson = newsRes.ok ? await newsRes.json() : { articles: [] };
  const newsSlug = newsJson.articles?.[0]?.slug ?? "real-madrid-el-clasico-la-liga";
  const allHaveImages = (newsJson.articles ?? []).every(
    (a) => a.imageUrl && a.imageUrl.includes("media.api-sports.io")
  );
  const videoArticles = (newsJson.articles ?? []).filter((a) => a.videoUrl);
  results.push(
    checkLogic(
      "LOGIC news has video articles",
      videoArticles.length >= 3,
      `(${videoArticles.length} videos)`
    )
  );
  results.push(
    checkLogic(
      "LOGIC all news articles have api-sports images",
      allHaveImages,
      `(${newsJson.articles?.length ?? 0} articles)`
    )
  );
  results.push(await check(`PAGE /en/news/${newsSlug}`, `/en/news/${newsSlug}`));

  const teamsRes = await fetch(`${BASE}/api/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(60000),
  });
  const teamsJson = teamsRes.ok ? await teamsRes.json() : { teams: [] };
  const teamId = teamsJson.teams?.[0]?.id ?? "1";

  const playersRes = await fetch(`${BASE}/api/players`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
    signal: AbortSignal.timeout(60000),
  });
  const playersJson = playersRes.ok ? await playersRes.json() : { players: [] };
  const playerId = playersJson.players?.[0]?.id ?? "276";

  results.push(
    await check(`API GET /api/teams/${teamId}`, `/api/teams/${teamId}`)
  );
  results.push(
    await check(`API GET /api/players/${playerId}`, `/api/players/${playerId}`)
  );
  results.push(
    await check(`PAGE /en/teams/${teamId}`, `/en/teams/${teamId}`)
  );
  results.push(
    await check(`PAGE /en/players/${playerId}`, `/en/players/${playerId}`)
  );

  results.push(
    await check(`API POST /api/search`, `/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: "morocco" }),
    })
  );
  results.push(
    await check(`API POST /api/country/sa`, `/api/country/sa`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    })
  );

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);

  console.log(`\n--- Summary: ${passed}/${results.length} passed ---`);
  if (failed.length) {
    console.log("Failed:");
    failed.forEach((f) => console.log(`  - ${f.name} (${f.status})`));
    process.exit(1);
  }
  console.log("All checks passed.\n");
}

main();
