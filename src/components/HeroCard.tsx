import React from "react";
import { readableOn } from "../theme/colors";

// Inline type
type EnrichedHero = {
  id: string | number;
  number: number;
  category: string;
  name: string;
  tagline: string;
  description: string;
  color: string;     // primary
  secondary: string; // secondary
  image?: string;
};

type Props = {
  hero: EnrichedHero;
  onClick?: () => void;
  clickable?: boolean;
};

export default function HeroCard({ hero, onClick, clickable = false }: Props) {
  // GUARANTEE strings for the color helper
  const primary = typeof hero.color === "string" && hero.color ? hero.color : "#6b7280";   // gray-600
  const secondary = typeof hero.secondary === "string" && hero.secondary ? hero.secondary : "#9ca3af"; // gray-400

  const textOnPrimary = readableOn(primary);
  const textOnSecondary = readableOn(secondary);

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
        borderColor: primary,
        background: "#fff",
      }}
    >
      <div className="h-1.5" style={{ backgroundColor: primary }} />

      <div className="p-4 flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-xl overflow-hidden border"
          style={{ borderColor: primary, backgroundColor: "#fff" }}
        >
          {hero.image ? (
            <img
              src={hero.image}
              alt={hero.name || "Hero"}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : null}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg leading-tight" style={{ color: textOnSecondary }}>
              {hero.name || "Unnamed Hero"}
            </h3>
            <span
              className="text-xs px-2 py-1 rounded-full border"
              style={{ backgroundColor: primary, color: textOnPrimary, borderColor: primary }}
            >
              {hero.category || "Uncategorised"}
            </span>
          </div>

          <div className="mt-3 flex gap-1.5 items-center">
            <span className="inline-block h-2 w-12 rounded-full" style={{ backgroundColor: primary }} />
            <span
              className="inline-block h-2 w-6 rounded-full"
              style={{ backgroundColor: secondary, border: `1px solid ${primary}22` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
