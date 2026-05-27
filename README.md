# كورة — Kora Football Portal

Arabic-first bilingual football news portal built with Next.js 15, TypeScript, Tailwind CSS v4, Redux Toolkit, and next-intl.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/ar`.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — run production build
- `npm run lint` — ESLint

## Environment

Copy `.env.local.example` to `.env.local` and add optional keys:

- `FOOTBALL_DATA_API_KEY` — live scores from football-data.org
- `GOOGLE_TRANSLATE_KEY` / `ANTHROPIC_API_KEY` — RSS translation
- `TRANSLATE_PROVIDER` — `google` or `claude`

Football data uses your **proxy** (`FOOTBALL_PROXY_BASE_URL`). Without a reachable proxy, `USE_MOCK_FALLBACK=true` uses mock JSON in `data/`.

## AWS Amplify

1. Connect this repo in [AWS Amplify Console](https://console.aws.amazon.com/amplify/) (branch: `main`).
2. Amplify reads `amplify.yml` automatically — use **Next.js - SSR** (Web Compute) if prompted.
3. Set environment variables in Amplify → **Hosting → Environment variables** (copy from `.env.local.example`):
   - `NEXT_PUBLIC_SITE_URL` — your Amplify app URL (e.g. `https://main.d1234.amplifyapp.com`)
   - `FOOTBALL_PROXY_BASE_URL`, `FOOTBALL_WC_LEAGUE_ID`, `FOOTBALL_WC_SEASON`
   - `USE_MOCK_FALLBACK=true` (recommended until proxy is reachable from AWS)
   - `DISABLE_RSS=false` (optional: `true` for faster cold builds)
4. Deploy — build runs `npm ci` + `npm run build`.

See `kora-football-documentation.md` for full architecture and file map.
