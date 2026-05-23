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

See [docs/postman-football-proxy.md](docs/postman-football-proxy.md) for endpoint mapping.

## Structure

See `kora-football-documentation.md` for full architecture and file map.
