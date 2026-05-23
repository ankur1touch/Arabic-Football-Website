# Postman → Kora API map

Collection: **API-Football CMS Collection** (Admintkcorp workspace)

| Postman | Proxy path | Kora route |
|---------|------------|------------|
| Live Matches | `GET /api/football/live` | `GET/POST /api/live-scores` |
| Fixtures Upcoming/Past | `GET /api/football/fixtures` | `POST /api/matches` |
| Standings | `GET /api/football/standings` | `POST /api/tournaments` |
| Teams | `GET /api/football/teams` | `POST /api/teams` |
| Top Scorers | `GET /api/football/topscorers` | `POST /api/players` |
| Match Details | `GET /api/football/match/{id}` | `GET/POST /api/fixtures/{id}` |
| Lineups / Events / Stats | `?fixture=` | merged in fixture detail |
| Rounds | `GET /api/football/rounds` | `POST /api/football/rounds` |
| Leagues | `GET /api/football/leagues` | `POST /api/football/leagues` |

World Cup defaults: `FOOTBALL_WC_LEAGUE_ID=1`, `FOOTBALL_WC_SEASON=2026`
