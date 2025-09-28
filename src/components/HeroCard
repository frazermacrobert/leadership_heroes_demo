import React from "react";
import { readableOn } from "../theme/colors";
import type { EnrichedHero } from "../data/loadHeroes";

type Props = {
  hero: EnrichedHero;
  onClick?: () => void;
  clickable?: boolean;
};

export default function HeroCard({ hero, onClick, clickable = false }: Props) {
  const textOnPrimary = readableOn(hero.primaryColor);
  const textOnSecondary = readableOn(hero.secondaryColor);

  return (
    <div
      role={clickable ? "button" : undefined}
      onClick={clickable ? onClick : undefined}
      className={[
        "rounded-2xl shadow-md overflow-hidden transition-transform",
        clickable ? "cursor-pointer hover:-translate-y-0.5" : "",
        "border"
      ].join(" ")}
      style={{
        borderColor: hero.primaryColor,
        background: `linear-gradient(135deg, ${hero.secondaryColor} 0%, ${hero.secondaryColor} 55%, ${hero.primaryColor} 100%)`,
      }}
    >
      {/* top strip */}
      <div
        className="h-1.5"
        style={{ backgroundColor: hero.primaryColor }}
      />

      <div className="p-4 flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden border"
             style={{ borderColor: hero.primaryColor, backgroundColor: "#fff" }}>
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
            <h3 className="font-semibold text-lg leading-tight" style={{ color: textOnSecondary }}>
              {hero.name}
            </h3>
            <span
              className="text-xs px-2 py-1 rounded-full border"
              style={{
                backgroundColor: hero.primaryColor,
                color: textOnPrimary,
                borderColor: hero.primaryColor,
              }}
            >
              {hero.category}
            </span>
          </div>

          {/* Identity bars for extra punch */}
          <div className="mt-3 flex gap-1.5 items-center">
            <span className="inline-block h-2 w-12 rounded-full" style={{ backgroundColor: hero.primaryColor }} />
            <span className="inline-block h-2 w-6 rounded-full" style={{ backgroundColor: hero.secondaryColor, border: `1px solid ${hero.primaryColor}22` }} />
          </div>

          {/* Optional metadata or tagline slot */}
          {/* <p className="mt-2 text-sm" style={{ color: textOnSecondary }}>Short descriptor here...</p> */}
        </div>
      </div>
    </div>
  );
}
