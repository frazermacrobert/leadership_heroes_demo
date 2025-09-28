import { CATEGORY_COLORS, DEFAULT_PALETTE } from "../theme/colors";

export type Hero = {
  id: number;
  name: string;
  category: string;
  image?: string;
  primaryColor?: string;
  secondaryColor?: string;
};

export type EnrichedHero = Hero & {
  primaryColor: string;
  secondaryColor: string;
  image: string;
};

export async function loadHeroes(): Promise<EnrichedHero[]> {
  const url = new URL("data/heroes.json", import.meta.env.BASE_URL);
  const res = await fetch(url);
  const raw: Hero[] = await res.json().catch(() => []);
  const list = Array.isArray(raw) ? raw : [];

  return list.map((h) => {
    const palette = h.primaryColor && h.secondaryColor
      ? { primary: h.primaryColor, secondary: h.secondaryColor }
      : CATEGORY_COLORS[h.category] ?? DEFAULT_PALETTE;

    const image =
      h.image ??
      new URL(
        `images/${(h.name || "hero").toLowerCase().replace(/\s+/g, "_")}.png`,
        import.meta.env.BASE_URL
      ).toString();

    return {
      ...h,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      image,
    };
  });
}
