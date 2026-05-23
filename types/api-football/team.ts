export interface ApiFootballTeam {
  team: {
    id: number;
    name: string;
    code?: string;
    country?: string;
    logo?: string;
    founded?: number;
  };
  venue?: {
    name?: string;
    city?: string;
  };
}
