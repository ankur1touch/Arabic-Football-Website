# كورة — Kora · Complete Project Documentation

> **Arabic Football Portal**
> Repository: Local workspace · `kora-football`
> Stack: **Next.js 15** · **TypeScript** · **Tailwind CSS v4** · **Redux Toolkit** · **Axios** · **next-intl**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack — What's Used & Why](#2-tech-stack--whats-used--why)
3. [Data Sources — Where Data Comes From](#3-data-sources--where-data-comes-from)
4. [Routing — How URLs Work](#4-routing--how-urls-work)
5. [Folder Structure & File Mapping](#5-folder-structure--file-mapping)
6. [Page-to-Component Mapping](#6-page-to-component-mapping)
7. [Bilingual System (Arabic + English)](#7-bilingual-system-arabic--english)
8. [Data Flow Architecture](#8-data-flow-architecture)
9. [Redux State Management](#9-redux-state-management)
10. [API Routes (SSR-Safe)](#10-api-routes-ssr-safe)
11. [RSS Feed Aggregation](#11-rss-feed-aggregation)
12. [Environment Variables](#12-environment-variables)
13. [Design System (Colors & UI)](#13-design-system-colors--ui)
14. [Development & Build Commands](#14-development--build-commands)
15. [Known Limitations & Future Roadmap](#15-known-limitations--future-roadmap)
16. [Quick Reference — Which File to Edit](#16-quick-reference--which-file-to-edit)

---

## 1. Project Overview

| Item | Detail |
|------|--------|
| **Name** | كورة (Kora) |
| **Type** | Production-quality Arabic football news portal with bilingual (AR/EN) support |
| **Primary Language** | Arabic (عربي) — RTL layout, `direction: rtl` |
| **Secondary Language** | English — toggled by user, `direction: ltr` |
| **Target Audience** | MENA region football fans; global Arabic-speaking community |
| **RSS Sources** | 20+ feeds: BBC, Sky Sports, Goal, ESPN, FIFA, 90min, MARCA, Guardian… |
| **Data** | RSS aggregation + Mock JSON (SSR-ready for real API swap) |
| **Build status** | ✅ Passing — 0 errors (Next.js 15.x) |
| **Dev server** | `http://localhost:3000` |

**What this site delivers:**

- Homepage with hero banner, live match ticker, Arabic/English news grid, league standings snippet
- Bilingual toggle (AR ⇄ EN) — all content flips direction and language
- News listing with category filters and featured article layout
- Full article detail pages (auto-translated Arabic + English original)
- Match center — Live / Upcoming / Results with league filter
- Tournaments hub with category filter and card grid
- Tournament detail — Standings + Top Scorers
- World Rankings — Men's / Women's toggle, full table
- Teams hub — Confederation filter + search
- Team detail — Squad, stats, recent form
- Players hub — Position filter + search
- Player profile — Career stats and bio
- Live scores sidebar widget (via football-data.org API)
- Breaking news ticker — real-time Arabic headlines

---

## 2. Tech Stack — What's Used & Why

### Core Framework

| Technology | Version | Where Used | Why |
|------------|---------|------------|-----|
| **Next.js** | 15.x | Entire `app/` folder | App Router, SSR/SSG, fast pages, Vercel-ready deployment |
| **React** | 19.x | All UI components | Industry standard, built-in with Next.js |
| **TypeScript** | 5.x | All `.ts` / `.tsx` files | Type safety, fewer runtime bugs, better DX |

### Styling & UI

| Technology | Where Used | Why |
|------------|------------|-----|
| **Tailwind CSS v4** | `globals.css`, all components | Utility-first — RTL + dark theme support via `rtl:` prefix |
| **@tailwindcss/postcss** | `postcss.config.mjs` | Tailwind v4 compilation pipeline |
| **tailwind-merge** | `lib/cn.ts` | Merge conflicting Tailwind classes cleanly |
| **clsx** | `lib/cn.ts` | Conditional class name helper |
| **Lucide React** | Icons throughout the app | Lightweight icon set (outline, no brand icons) |

### State Management

| Technology | Files | Why |
|------------|-------|-----|
| **Redux Toolkit (RTK)** | `store/` + `store/features/` | Centralized global state with async thunks |
| **React-Redux** | All client components | `useSelector` / `useDispatch` hooks |
| **Immer** (built-in RTK) | Slice reducers | Immutable state updates with mutable-style code |

### HTTP & Internationalization

| Technology | Files | Why |
|------------|-------|-----|
| **Axios** | `lib/client.ts` | HTTP client with interceptors, better than raw fetch |
| **next-intl** | `i18n/` + `middleware.ts` | Arabic/English routing, RTL toggle, translation files |
| **rss-parser** | `lib/rss.ts` | Parse 20+ RSS feeds server-side from news sources |

---

## 3. Data Sources — Where Data Comes From

### Summary Table

| Data Type | Source | Entries | API Route | Notes |
|-----------|--------|---------|-----------|-------|
| **News articles** | RSS feeds + `data/news.json` | Live + 12 seed | `POST /api/news` | Auto-translated to Arabic |
| **Matches** | football-data.org + `data/matches.json` | Live + 12 seed | `POST /api/matches` | Real-time scores |
| **World Rankings** | `data/rankings.json` | Men top 25 + Women top 15 | `POST /api/rankings` | FIFA official data |
| **Tournaments** | `data/tournaments.json` | 7 tournaments | `POST /api/tournaments` | Group standings |
| **National Teams** | `data/teams.json` | 6 teams | `POST /api/teams` | Squad + form |
| **Players** | `data/players.json` | 6 players | `POST /api/players` | Career stats + bio |
| **RSS Sources** | External RSS feeds | 20+ sources | `POST /api/rss` | BBC, Sky, Goal, ESPN… |

### RSS Feed Sources (Arabic Priority)

| Source | RSS URL | Priority |
|--------|---------|----------|
| **BBC Football** | `feeds.bbci.co.uk/sport/football/rss.xml` | High |
| **Sky Sports** | `www.skysports.com/rss/12040` | High |
| **Goal.com** | `www.goal.com/feeds/en/news` | High |
| **ESPN Soccer** | `www.espn.com/espn/rss/soccer/news` | High |
| **The Guardian Football** | `www.theguardian.com/football/rss` | High |
| **FIFA News** | `www.fifa.com/fifaplus/en/rss` | High |
| **90min** | `www.90min.com/posts.rss` | High |
| **MARCA English** | `e00-marca.uecdn.es/rss/en/index.xml` | High |
| **SofaScore News** | `www.sofascore.com/news/feed` | Medium |
| **Flashscore News** | `www.flashscore.com/news/rss/` | Medium |
| **Google News (AR)** | `news.google.com/rss/search?hl=ar&gl=SA` | Discovery |

---

## 4. Routing — How URLs Work

### Routing Model: Next.js App Router + next-intl

All user-facing pages live inside `app/[locale]/` where locale is `ar` (default) or `en`. Arabic is the default locale and uses RTL layout. English is secondary and uses LTR.

```
Request → middleware.ts (locale detection)
        → app/layout.tsx (root HTML shell)
        → app/[locale]/layout.tsx (locale shell — sets dir=rtl/ltr)
        → specific page component
```

---

### Complete URL Map

| URL | Page File | What It Shows |
|-----|-----------|---------------|
| `/` | `app/page.tsx` | Root redirect → `/ar` (Arabic homepage) |
| `/ar` | `app/ar/page.tsx` | Homepage — Hero, Ticker, News, Matches, Standings |
| `/en` | `app/en/page.tsx` | Homepage — English version, LTR layout |
| `/ar/news` | `app/ar/news/page.tsx` | News listing — Arabic category filters |
| `/ar/news/[slug]` | `app/ar/news/[slug]/page.tsx` | Full article — Arabic translation + English original |
| `/en/news` | `app/en/news/page.tsx` | News listing — English |
| `/ar/matches` | `app/ar/matches/page.tsx` | Match center — Live/Upcoming/Results |
| `/ar/tournaments` | `app/ar/tournaments/page.tsx` | Tournaments hub — category filter |
| `/ar/tournaments/[id]` | `app/ar/tournaments/[id]/page.tsx` | Tournament detail — standings + scorers |
| `/ar/world-rankings` | `app/ar/world-rankings/page.tsx` | Rankings — Men's / Women's toggle |
| `/ar/teams` | `app/ar/teams/page.tsx` | Teams hub — confederation filter + search |
| `/ar/teams/[id]` | `app/ar/teams/[id]/page.tsx` | Team detail — squad, stats, form |
| `/ar/players` | `app/ar/players/page.tsx` | Players hub — position filter + search |
| `/ar/players/[id]` | `app/ar/players/[id]/page.tsx` | Player profile — stats, bio, career |
| `/ar/live-scores` | `app/ar/live-scores/page.tsx` | Live scores center — all leagues |

### API Routes

| URL | Method | Source File | Returns |
|-----|--------|-------------|---------|
| `/api/news` | POST | `data/news.json` + RSS | All news articles (AR + EN fields) |
| `/api/rss` | POST | External RSS feeds | Aggregated + translated headlines |
| `/api/matches` | POST | `data/matches.json` | All matches |
| `/api/live-scores` | GET | football-data.org | Real-time match scores |
| `/api/rankings` | POST | `data/rankings.json` | `{ men: [...], women: [...] }` |
| `/api/tournaments` | POST | `data/tournaments.json` | All tournaments |
| `/api/teams` | POST | `data/teams.json` | All national teams |
| `/api/players` | POST | `data/players.json` | All players |

### Dynamic Routes Explained

```
app/[locale]/news/[slug]/page.tsx
                   │
                   └── Article slug from news.json / RSS feed

app/[locale]/tournaments/[id]/page.tsx
                          │
                          └── Tournament id from tournaments.json

app/[locale]/teams/[id]/page.tsx
                   │
                   └── Team id from teams.json

app/[locale]/players/[id]/page.tsx
                     │
                     └── Player id from players.json
```

---

## 5. Folder Structure & File Mapping

```
kora-football/
│
├── app/                                    # Next.js App Router (pages & routes)
│   ├── layout.tsx                          # Root HTML shell — sets lang + dir attribute
│   ├── page.tsx                            # Root page (redirects to /ar)
│   ├── globals.css                         # Tailwind v4 + RTL global styles
│   ├── middleware.ts                       # next-intl locale detection + redirect
│   ├── favicon.ico
│   │
│   ├── api/                                # Next.js API routes (SSR-safe)
│   │   ├── news/route.ts
│   │   ├── rss/route.ts                    # RSS aggregator + auto-translate
│   │   ├── matches/route.ts
│   │   ├── live-scores/route.ts            # Real-time scores proxy
│   │   ├── rankings/route.ts
│   │   ├── tournaments/route.ts
│   │   ├── teams/route.ts
│   │   └── players/route.ts
│   │
│   └── [locale]/                           # ar + en locale pages
│       ├── layout.tsx                      # Locale shell — Header + Footer + StoreProvider
│       ├── page.tsx                        # Homepage
│       ├── news/
│       │   ├── page.tsx                    # News listing
│       │   └── [slug]/page.tsx             # Article detail
│       ├── matches/page.tsx                # Match center
│       ├── live-scores/page.tsx            # Live scores center
│       ├── tournaments/
│       │   ├── page.tsx                    # Tournaments hub
│       │   └── [id]/page.tsx               # Tournament detail
│       ├── world-rankings/page.tsx         # Rankings
│       ├── teams/
│       │   ├── page.tsx                    # Teams hub
│       │   └── [id]/page.tsx               # Team detail
│       └── players/
│           ├── page.tsx                    # Players hub
│           └── [id]/page.tsx               # Player profile
│
├── components/                             # Reusable UI components
│   ├── home/                               # Homepage-specific sections
│   │   ├── HeroSection.tsx                 # Hero banner with bilingual headline
│   │   ├── LiveMatchTicker.tsx             # Scrolling live scores ticker
│   │   ├── NewsGrid.tsx                    # Homepage news card grid (AR/EN)
│   │   ├── RankingsSnippet.tsx             # Top-5 rankings snippet
│   │   └── TournamentSpotlight.tsx         # Featured tournament card
│   ├── layout/                             # Global layout shell
│   │   ├── Header.tsx                      # Nav with language toggle (AR ⇄ EN)
│   │   └── Footer.tsx                      # Footer — RTL-aware links
│   ├── news/                               # News page components
│   │   ├── NewsCard.tsx                    # News card (title + excerpt, bilingual)
│   │   ├── NewsFilters.tsx                 # Category filter tabs
│   │   └── NewsListingClient.tsx           # Client news list with Redux dispatch
│   ├── matches/                            # Match page components
│   │   ├── MatchCard.tsx                   # Single match card with live dot
│   │   └── MatchesClient.tsx               # Match center with filter tabs
│   ├── scores/                             # Live scores components
│   │   └── LiveScoresWidget.tsx            # Sidebar live scores widget
│   ├── tournaments/
│   │   ├── TournamentCard.tsx
│   │   └── TournamentsClient.tsx
│   ├── teams/
│   │   └── TeamsClient.tsx
│   ├── players/
│   │   └── PlayersClient.tsx
│   ├── rankings/
│   │   └── RankingsClient.tsx
│   └── ui/                                 # Generic reusable UI primitives
│       ├── Badge.tsx                       # Status labels (Live مباشر, Featured, tags)
│       ├── Button.tsx                      # Primary / secondary / ghost variants
│       ├── Skeleton.tsx                    # Loading placeholder for lists/cards
│       ├── Tabs.tsx                        # Filter tab groups
│       └── LangToggle.tsx                  # AR / EN language switcher button
│
├── data/                                   # Mock JSON data (source of truth for seed)
│   ├── news.json
│   ├── matches.json
│   ├── rankings.json
│   ├── tournaments.json
│   ├── teams.json
│   └── players.json
│
├── i18n/                                   # Translation files + next-intl config
│   ├── ar.json                             # All Arabic UI strings (الأخبار, المباريات…)
│   └── en.json                             # All English UI strings
│
├── store/                                  # Redux Toolkit state management
│   ├── index.ts                            # Store configuration
│   ├── StoreProvider.tsx                   # Redux <Provider> wrapper
│   └── features/                           # Domain slices
│       ├── newsSlice.ts
│       ├── matchesSlice.ts
│       ├── tournamentsSlice.ts
│       ├── rankingsSlice.ts
│       ├── teamsSlice.ts
│       ├── playersSlice.ts
│       └── localeSlice.ts                  # Current locale (ar/en) + direction
│
├── lib/                                    # Business logic / utilities
│   ├── client.ts                           # Axios instance (base URL + interceptors)
│   ├── cn.ts                               # cn() — clsx + tailwind-merge
│   ├── rss.ts                              # RSS feed parser + aggregator
│   └── translate.ts                        # Auto-translate helper (Google/Claude API)
│
├── types/                                  # Shared TypeScript interfaces
│   ├── news.ts
│   ├── match.ts
│   ├── tournament.ts
│   ├── ranking.ts
│   ├── team.ts
│   └── player.ts
│
├── public/                                 # Static assets
├── next.config.ts                          # Next.js config (image domains, i18n)
├── middleware.ts                           # next-intl locale detection
├── tailwind.config.ts                      # Tailwind theme config (RTL-aware)
├── postcss.config.mjs                      # PostCSS for Tailwind v4
├── tsconfig.json                           # TypeScript config
├── eslint.config.mjs                       # ESLint config
└── package.json                            # Dependencies
```

---

## 6. Page-to-Component Mapping

### Homepage (`app/[locale]/page.tsx`)

| Section | Component | Data Source |
|---------|-----------|-------------|
| Hero banner | `HeroSection` | `news.json` (featured articles) |
| Breaking news ticker | `LiveMatchTicker` | `matches.json` (status: Live) + RSS |
| News grid | `NewsGrid` | RSS feeds + `news.json` (latest 6) |
| Tournament spotlight | `TournamentSpotlight` | `tournaments.json` |
| Rankings snippet | `RankingsSnippet` | `rankings.json` (top 5) |
| Live scores sidebar | `LiveScoresWidget` | football-data.org API |

### Every Page (via `layout.tsx`)

| UI Part | Component | Data |
|---------|-----------|------|
| Dark nav + logo + lang toggle | `Header` | Static nav links + `localeSlice` |
| Footer with RTL links | `Footer` | Static (inline SVG social icons) |

### News Pages

| Page | Client Component | Behavior |
|------|-----------------|---------|
| `/[locale]/news` | `NewsListingClient` | Dispatch `fetchNews` → filter by category client-side |
| `/[locale]/news/[slug]` | — (Server Component) | Find article by slug, render AR translation + EN original |

### Match Center Page

| Filter | Behavior |
|--------|---------|
| Live / Upcoming / Results tabs | `MatchesClient` — filters `matches` array by `status` |
| League dropdown | Secondary filter over already-filtered list |
| Live dot indicator | Red pulsing dot on live match cards |

### Teams Page

| Filter | Behavior |
|--------|---------|
| Confederation tabs | `TeamsClient` — filters by confederation |
| Search input | Client-side text filter on team name |

### Players Page

| Filter | Behavior |
|--------|---------|
| Position tabs | `PlayersClient` — filters by position |
| Search input | Client-side text filter on player name |

---

## 7. Bilingual System (Arabic + English)

### How Language Switching Works

The site defaults to Arabic (RTL). A toggle in the header switches to English (LTR). The locale is stored in Redux (`localeSlice`) and persisted to `localStorage`. On switch, next-intl reroutes from `/ar/...` to `/en/...` and the HTML `dir` attribute changes.

### RTL Implementation Rules

- Set `dir="rtl"` on `<html>` for Arabic, `dir="ltr"` for English
- Use Tailwind `rtl:` prefix for mirrored spacing (`rtl:mr-4` becomes `ml-4`)
- Arabic text uses `text-align: right` by default via global CSS
- Navigation links reverse order in RTL using `flex-row-reverse`
- Icons mirror horizontally using `scale-x-[-1]` in RTL mode
- Card layouts use grid/flex auto-reversing with `dir` inheritance

### Translation Files Structure

```json
// i18n/ar.json
{
  "nav": {
    "home": "الرئيسية",
    "news": "أخبار",
    "matches": "مباريات",
    "tournaments": "بطولات",
    "rankings": "التصنيفات",
    "teams": "المنتخبات",
    "players": "اللاعبون",
    "liveScores": "النتائج المباشرة"
  },
  "match": {
    "live": "مباشر",
    "upcoming": "قادمة",
    "results": "نتائج"
  },
  "news": {
    "readMore": "اقرأ المزيد",
    "breaking": "عاجل"
  }
}
```

### Auto-Translation Flow (RSS → Arabic)

RSS feeds are in English. The API route fetches them, then passes headlines through a translation layer before storing in Redux. Translation uses either the Google Cloud Translation API or Claude API (configured via `TRANSLATE_PROVIDER` env var).

```
RSS Feed (EN)
    → /api/rss
    → rss-parser
    → translate.ts
    → { titleAr, titleEn, excerptAr, excerptEn }
    → Redux store
    → NewsCard (shows Arabic by default, EN on toggle)
```

---

## 8. Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│         middleware.ts (locale detection — ar/en)                 │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│    app/layout.tsx  →  <html dir={dir} lang={locale}>            │
│    app/[locale]/layout.tsx  →  StoreProvider + Header + Footer  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│    page.tsx (Server Component)                                   │
│    Renders Client Components → dispatch async thunks            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
           ┌──────────────┐       ┌──────────────────┐
           │  Redux Store │       │  Next.js API      │
           │  (RTK slice) │◄──────│  Routes           │
           │              │       │  /api/news        │
           │  useSelector │       │  /api/rss         │
           │  useDispatch │       │  /api/matches     │
           └──────────────┘       │  /api/live-scores │
                    │             │  /api/rankings    │
                    │             │  /api/tournaments │
                    │             └────────┬──────────┘
                    │                      │
                    ▼                      ▼
           ┌──────────────┐       ┌──────────────────┐
           │  UI renders  │       │  data/*.json      │
           │  with state  │       │  + external APIs  │
           └──────────────┘       └──────────────────┘
```

**Key principle:** Components never call APIs directly. They `dispatch` a thunk → thunk calls the API route via Axios → response goes into Redux slice → component reads via `useSelector`.

---

## 9. Redux State Management

### Store Structure

Each domain has its own slice with the standard pattern:

```typescript
// Pattern used in every slice
{
  data: T[],               // The actual items
  status: 'idle' | 'loading' | 'succeeded' | 'failed',
  error: string | null
}
```

### Slices

| Slice | File | State Shape |
|-------|------|-------------|
| `news` | `store/features/newsSlice.ts` | `{ articles, status, error }` |
| `matches` | `store/features/matchesSlice.ts` | `{ matches, status, error }` |
| `tournaments` | `store/features/tournamentsSlice.ts` | `{ tournaments, status, error }` |
| `rankings` | `store/features/rankingsSlice.ts` | `{ men, women, status, error }` |
| `teams` | `store/features/teamsSlice.ts` | `{ teams, status, error }` |
| `players` | `store/features/playersSlice.ts` | `{ players, status, error }` |
| `locale` | `store/features/localeSlice.ts` | `{ locale: 'ar' \| 'en', dir: 'rtl' \| 'ltr' }` |

### Async Thunks Pattern

```typescript
// Each slice has an async thunk like:
export const fetchNews = createAsyncThunk('news/fetchAll', async () => {
  const res = await axiosClient.post('/api/news');
  return res.data; // { articles: [{ titleAr, titleEn, slug, ... }] }
});
```

### StoreProvider

`store/StoreProvider.tsx` is a `"use client"` component that wraps `app/[locale]/layout.tsx` with Redux `<Provider>`.

---

## 10. API Routes (SSR-Safe)

All API routes use `POST` method and read from `data/*.json` files. Using POST ensures no caching issues on SSR. The live-scores route uses `GET` for external feed fetching.

| Route | File | What It Returns |
|-------|------|-----------------|
| `POST /api/news` | `app/api/news/route.ts` | Array of all news articles (AR + EN fields) |
| `POST /api/rss` | `app/api/rss/route.ts` | Aggregated RSS headlines, auto-translated to Arabic |
| `POST /api/matches` | `app/api/matches/route.ts` | Array of all matches |
| `GET /api/live-scores` | `app/api/live-scores/route.ts` | Live scores from football-data.org |
| `POST /api/rankings` | `app/api/rankings/route.ts` | `{ men: [...], women: [...] }` |
| `POST /api/tournaments` | `app/api/tournaments/route.ts` | Array of all tournaments |
| `POST /api/teams` | `app/api/teams/route.ts` | Array of all teams |
| `POST /api/players` | `app/api/players/route.ts` | Array of all players |

**To swap to a real API:** Edit `app/api/[route]/route.ts` — replace `readFileSync('data/x.json')` with a real `fetch()` call. No component changes needed.

---

## 11. RSS Feed Aggregation

### How It Works

The `/api/rss` route runs server-side. It fetches all configured RSS feeds in parallel using `Promise.all()`, parses them with `rss-parser`, deduplicates by title, sorts by date, and translates titles + excerpts to Arabic via the configured translation provider.

```typescript
// lib/rss.ts

const FEEDS = [
  'https://feeds.bbci.co.uk/sport/football/rss.xml',
  'https://www.skysports.com/rss/12040',
  'https://www.goal.com/feeds/en/news',
  'https://www.espn.com/espn/rss/soccer/news',
  'https://www.theguardian.com/football/rss',
  'https://www.fifa.com/fifaplus/en/rss',
  'https://www.90min.com/posts.rss',
  'https://e00-marca.uecdn.es/rss/en/index.xml',
  'https://www.sofascore.com/news/feed',
  'https://www.flashscore.com/news/rss/',
  // ... 10+ more feeds
];

export async function aggregateFeeds() {
  const results = await Promise.all(FEEDS.map(url => parser.parseURL(url)));
  const items = results.flatMap(r => r.items);
  const unique = deduplicateByTitle(items);
  const sorted = unique.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  return translateBatch(sorted.slice(0, 50));
}
```

### Caching Strategy

RSS feeds are cached for 5 minutes using Next.js Route Segment Config:

```typescript
// app/api/rss/route.ts
export const revalidate = 300; // 5 minutes
```

This prevents hitting rate limits on external feed sources while keeping content fresh.

---

## 12. Environment Variables

| Variable | Required? | Purpose | Provider | Example |
|----------|-----------|---------|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Recommended | SEO, OpenGraph base URL | — | `https://kora.com` |
| `FOOTBALL_DATA_API_KEY` | For live scores | Real-time match scores | football-data.org | `abc123...` |
| `GOOGLE_TRANSLATE_KEY` | For AR translation | Auto-translate RSS to Arabic | Google Cloud | `AIza...` |
| `ANTHROPIC_API_KEY` | Alternative | Auto-translate via Claude API | Anthropic | `sk-ant-...` |
| `TRANSLATE_PROVIDER` | Yes | Which translation API to use | — | `google` or `claude` |
| `RSS_CACHE_TTL` | Optional | RSS cache duration in seconds | — | `300` |

**Local setup:**

```bash
# Create .env.local at project root (not committed to git)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
FOOTBALL_DATA_API_KEY=your_key_here
TRANSLATE_PROVIDER=google
GOOGLE_TRANSLATE_KEY=your_key_here
```

---

## 13. Design System (Colors & UI)

### Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| **Kora Dark Navy** | `#0a0f1e` | Primary background — main page bg |
| **Kora Mid Navy** | `#0d1525` | Header, sidebar, card bg |
| **Kora Green (Primary)** | `#28a745` | Brand accent — CTAs, active states, live dot |
| **Kora Green Dark** | `#1e7e34` | Logo icon, hover states |
| **Kora Gold** | `#c9a84c` | Breaking news badge, special highlights |
| **Alert Red** | `#ff4444` | Live match dot, breaking news ticker |
| **Kora Teal Highlight** | `#5adb7e` | Tags, category pills on dark bg |
| **Surface Light** | `#f8fafc` | English (LTR) light mode page bg |
| **Dark Card** | `rgba(255,255,255,0.04)` | Card surfaces on dark bg |

### Reusable UI Primitives (`components/ui/`)

| Component | File | Purpose |
|-----------|------|---------|
| `Badge` | `Badge.tsx` | Status labels (Live مباشر, Featured, category tags) |
| `Button` | `Button.tsx` | Primary / secondary / ghost variants |
| `Skeleton` | `Skeleton.tsx` | Loading placeholder for lists/cards |
| `Tabs` | `Tabs.tsx` | Filter tab groups (matches, rankings, teams) |
| `LangToggle` | `LangToggle.tsx` | AR / EN language switcher — flips `dir` attribute |

### Loading / Empty / Error States

Every client component that fetches data handles all three states:

- **Loading:** `Skeleton` components (no blank screen)
- **Empty:** Arabic friendly message when filtered list is empty (لا توجد نتائج)
- **Error:** Error message with retry when `status === 'failed'`

### RTL-Aware Tailwind Classes

```
rtl:mr-0 rtl:ml-4      — mirrors margin spacing in RTL
rtl:text-right          — ensures Arabic text aligns right
rtl:flex-row-reverse    — reverses nav link order
rtl:scale-x-[-1]        — mirrors directional icons (arrows, chevrons)
rtl:pr-4 rtl:pl-0       — mirrors padding for inputs and form fields
```

---

## 14. Development & Build Commands

```bash
# Install dependencies
npm install

# Install additional packages needed
npm install next-intl rss-parser axios @reduxjs/toolkit react-redux

# Start dev server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Run production build locally
npm start

# Lint check
npm run lint
```

### Image Domains (`next.config.ts`)

Remote images are allowed from:

- `**.fifa.com` — Official FIFA CDN
- `**.cloudinary.com` — Cloudinary CDN
- `images.unsplash.com` — Unsplash stock photos
- `**.bbci.co.uk` — BBC image CDN
- `via.placeholder.com` — Placeholder images

---

## 15. Known Limitations & Future Roadmap

### Current Limitations

| Issue | Detail |
|-------|--------|
| **Limited mock data** | Teams / Players only have 6 entries each — expand `data/*.json` to add more |
| **Translation quality** | Auto-translate is good but may need editorial review for sports jargon |
| **No brand icons** | Lucide React v3 has no social media icons — Footer uses inline SVGs |
| **No authentication** | No login / user system yet |
| **No real-time updates** | Match scores update every 5 min via `revalidate`, not WebSocket |
| **RSS rate limits** | 20+ feeds fetched in parallel — add error handling for slow/down feeds |
| **No search page** | `/search` not yet implemented |

### Future Roadmap

1. **Real API integration** — Swap `data/*.json` reads in API routes with real HTTP calls
2. **WebSocket live scores** — Real-time match score updates without page refresh
3. **User accounts** — Login, saved articles, favourite teams
4. **Search page** — `/[locale]/search` with full-text search across all content
5. **Push notifications** — Breaking news + match goal alerts
6. **Video highlights** — Embedded YouTube / FIFA+ goal clips
7. **More locales** — Persian (Farsi), Urdu for expanded MENA reach
8. **Mobile app** — React Native companion sharing same Redux store logic
9. **Expand mock data** — Each `data/*.json` to 20+ entries for realistic dev

---

## 16. Quick Reference — Which File to Edit

| If you want to change… | Edit This File |
|------------------------|----------------|
| Header navigation links | `components/layout/Header.tsx` |
| Language toggle (AR/EN) | `components/ui/LangToggle.tsx` + `store/features/localeSlice.ts` |
| Footer links / social icons | `components/layout/Footer.tsx` |
| Colors / fonts | `tailwind.config.ts`, `app/globals.css` |
| Homepage hero | `components/home/HeroSection.tsx` |
| Homepage news grid | `components/home/NewsGrid.tsx` |
| Live ticker | `components/home/LiveMatchTicker.tsx` |
| Arabic UI strings | `i18n/ar.json` |
| English UI strings | `i18n/en.json` |
| News listing filters | `components/news/NewsFilters.tsx` |
| Match filters/tabs | `components/matches/MatchesClient.tsx` |
| RSS feed list | `lib/rss.ts` (FEEDS array) |
| Translation provider | `.env.local` (`TRANSLATE_PROVIDER=google\|claude`) |
| Add new news articles | `data/news.json` |
| Add new matches | `data/matches.json` |
| Update rankings | `data/rankings.json` |
| Add tournaments | `data/tournaments.json` |
| Add teams | `data/teams.json` |
| Add players | `data/players.json` |
| API route logic | `app/api/[domain]/route.ts` |
| Redux slice (state shape) | `store/features/[domain]Slice.ts` |
| TypeScript interfaces | `types/[domain].ts` |
| Axios client config | `lib/client.ts` |
| Allowed image domains | `next.config.ts` |
| Add a new page | `app/[locale]/your-page/page.tsx` |
| RTL layout fixes | `app/globals.css` + Tailwind `rtl:` classes |

---

## Design Reference

The design follows a modern Arabic sports portal aesthetic:

- **Header:** Dark navy (`#0d1525`) with green accent (`#28a745`), responsive hamburger on mobile, AR/EN toggle on right
- **Hero:** Full-width banner with Arabic headline overlaid, English subtitle in muted text below
- **Cards:** Dark semi-transparent cards with image + Arabic category badge + Arabic title + English subtitle
- **Breaking ticker:** Solid green bar (`#28a745`) scrolling latest Arabic headlines
- **Live scores sidebar:** Compact dark widget showing real-time match scores
- **Typography:** Arabic-first — Noto Naskh Arabic or system Arabic font for AR content, clean sans-serif for EN

---

**Document version:** 1.0
**Project:** كورة — `kora-football`
**Last updated:** May 2026

*Share this document with any developer, client, or reviewer — complete technical picture of the entire project in one place.*
