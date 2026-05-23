import type { Match } from "./match";
import type { StandingRow } from "./tournament";

export type Confederation = "UEFA" | "CONMEBOL" | "AFC" | "CAF" | "CONCACAF" | "OFC";

export interface SquadPlayer {
  id?: number;
  name: string;
  nameAr: string;
  position: string;
  club: string;
  number?: number | null;
  age?: number;
  photo?: string;
}

export interface Team {
  id: string;
  name: string;
  nameAr: string;
  logo?: string;
  code?: string;
  confederation: Confederation;
  fifaRank: number;
  coach: string;
  coachAr: string;
  form: string[];
  squad: SquadPlayer[];
  stats: {
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
}

export interface TeamInfo {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  logo: string;
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    image: string;
  };
}

export interface TeamDetailResponse {
  team: TeamInfo;
  squad: SquadPlayer[];
  fixtures: Match[];
  results: Match[];
  standings: StandingRow[];
}
