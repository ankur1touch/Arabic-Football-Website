export type PlayerPosition = "GK" | "DEF" | "MID" | "FWD";

export interface Player {
  id: string;
  name: string;
  nameAr: string;
  position: PlayerPosition;
  nationality: string;
  nationalityAr: string;
  club: string;
  clubAr: string;
  age: number;
  imageUrl?: string;
  bioAr: string;
  bioEn: string;
  career: {
    season: string;
    club: string;
    appearances: number;
    goals: number;
    assists: number;
  }[];
  stats: {
    goals: number;
    assists: number;
    appearances: number;
  };
}

export interface PlayerStatistics {
  team: { id: number; name: string; logo?: string };
  league: { id: number; name: string; country: string; logo?: string; season: number };
  games: {
    appearences: number;
    lineups: number;
    minutes: number;
    position: string;
    rating: string;
  };
  goals: { total: number; assists: number; saves: number | null };
  shots: { total: number; on: number };
  passes: { total: number; key: number; accuracy: number };
  tackles: { total: number; blocks: number; interceptions: number };
  cards: { yellow: number; yellowred: number; red: number };
}

export interface PlayerInfo {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number;
  nationality: string;
  height: string;
  weight: string;
  injured: boolean;
  photo: string;
}

export interface PlayerDetailResponse {
  player: PlayerInfo;
  statistics: PlayerStatistics[];
  recentFixtures: import("./match").Match[];
}
