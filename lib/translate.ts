type TranslatableItem = {
  titleEn: string;
  excerptEn: string;
  source: string;
  publishedAt: string;
  slug: string;
};

export async function translateBatch<T extends TranslatableItem>(
  items: T[]
): Promise<
  (T & { titleAr: string; excerptAr: string })[]
> {
  const provider = process.env.TRANSLATE_PROVIDER;
  const hasGoogle = !!process.env.GOOGLE_TRANSLATE_KEY;
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;

  if (!provider || (!hasGoogle && !hasClaude)) {
    return items.map((item) => ({
      ...item,
      titleAr: item.titleEn,
      excerptAr: item.excerptEn,
    }));
  }

  return items.map((item) => ({
    ...item,
    titleAr: item.titleEn,
    excerptAr: item.excerptEn,
  }));
}
