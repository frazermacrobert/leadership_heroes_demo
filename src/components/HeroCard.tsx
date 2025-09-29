import React from "react";
import { readableOn } from "../theme/colors";

// Inline type definition for a hero
type EnrichedHero = {
  id: string;
  number: number;
  category: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  secondary: string;
  image?: string;
};

type Props = {
  hero: EnrichedHero;
  onClick?: () => void;
  clickable?: boolean;
};

export default function HeroCard({ hero, onClick, clickable = false }: Props) {
  const textOnPrimary = readableOn(hero.color);
  const textOnSecondary = readableOn(hero.secondary);

  return (
    <div
      role={clickable ? "button" : undefined}
      onClick={clickable ? onClick : undefined}
      className={[
        "rounded-2xl shadow-md overflow-hidden transition-transform",
        clickable ? "cursor-pointer hover:-translate-y-0.5" : "",
        "border",
      ].join(" ")}
      style={{
        borderColor: hero.color,
        background: `linear-gradient(135deg, ${hero.secondary} 0%, ${hero.secondary} 55%, ${hero.color} 100%)`,
      }}
    >
      {/* top strip */}
      <div className="h-1.5" style={{ backgroundColor: hero.color }} />

      <div className="p-4 flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-xl overflow-hidden border"
          style={{ borderColor: hero.color, backgroundColor: "#fff" }}
        >
          {/* Safe image; if missing it won’t break layout */}
          <img
            src={hero.image}
            alt={hero.name}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className="font-semibold text-lg leading-tight"
              style={{ color: textOnSecondary }}
            >
              {hero.name}
            </h3>
            <span
              className="text-xs px-2 py-1 rounded-full border"
              style={{
                backgroundColor: hero.color,
                color: textOnPrimary,
                borderColor: hero.color,
              }}
            >
              {hero.category}
            </span>
          </div>

          {/* Identity bars for extra punch */}
          <div className="mt-3 flex gap-1.5 items-center">
            <span
              className="inline-block h-2 w-12 rounded-full"
              style={{ backgroundColor: hero.color }}
            />
            <span
              className="inline-block h-2 w-6 rounded-full"
              style={{
                backgroundColor: hero.secondary,
                border: `1px solid ${hero.color}22`,
              }}
            />
          </div>

          {/* Optional metadata or tagline slot */}
          {/* <p className="mt-2 text-sm" style={{ color: textOnSecondary }}>Short descriptor here...</p> */}
        </div>
      </div>
    </div>
  );
}
