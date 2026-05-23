export type NewsCategory =
  | "breaking"
  | "la-liga"
  | "premier-league"
  | "champions-league"
  | "world-cup"
  | "transfers"
  | "general";

export interface NewsArticle {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  bodyAr: string;
  bodyEn: string;
  source: string;
  category: NewsCategory;
  imageUrl?: string;
  videoUrl?: string;
  publishedAt: string;
  featured?: boolean;
  breaking?: boolean;
}
