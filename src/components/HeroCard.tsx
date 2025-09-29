import React, { useMemo } from "react";
import { readableOn } from "../utils/colors";

type EnrichedHero = {
  id: string | number;
  number: number;
  category: string;
  name: string;
  tagline?: string;
  description?: string;
  color: string;     // primary
  secondary: string; // secondary
};

const CARD_MIN_H = "12rem"; // uniform card height (~192px)

export default function HeroCard({ hero }: { hero: EnrichedHero }) {
  const primary = hero.color || "#6B7280";
  const secondary = hero.secondary || "#9CA3AF";
  const badgeText = readableOn(primary);

  const borderGradient = useMemo(
    () => ({ background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)` }),
    [primary, secondary]
  );

  return (
    <div className="rounded-2xl p-[2px]" style={borderGradient}>
      <div
        className="rounded-2xl bg-white shadow-sm border"
        style={{ borderColor: `${primary}33`, minHeight: CARD_MIN_H, display: "flex", flexDirection: "column" }}
      >
        <div className="p-4 flex-1 flex flex-col">
          {/* header row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500">#{hero.number}</span>
            <h3 className="font-semibold text-lg leading-tight truncate">{hero.name}</h3>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full border"
              style={{ borderColor: primary, backgroundColor: primary, color: badgeText }}
            >
              {hero.category}
            </span>
          </div>

          {/* tagline + description */}
          {hero.tagline && <p className="mt-2 text-sm text-gray-800 line-clamp-1">“{hero.tagline}”</p>}
          {hero.description && <p className="mt-1 text-xs text-gray-600 line-clamp-2">{hero.description}</p>}

          {/* bottom accents */}
          <div className="mt-auto pt-3 flex items-center gap-2">
            <span className="inline-block h-1.5 w-12 rounded-full" style={{ background: primary }} />
            <span className="inline-block h-1.5 w-8 rounded-full" style={{ background: secondary }} />
          </div>
        </div>
      </div>
    </div>
  );
}
