import React from "react";
import { readableOn } from "../theme/colors";

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

export default function HeroCard({ hero }: { hero: EnrichedHero }) {
  const primary = hero.color || "#6b7280";
  const secondary = hero.secondary || "#9ca3af";
  const textOnPrimary = readableOn(primary);

  return (
    <div className="rounded-2xl p-[2px]" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}>
      <div className="rounded-2xl bg-white shadow-md overflow-hidden border" style={{ borderColor: `${primary}33` }}>
        <div className="p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500">#{hero.number}</span>
            <h3 className="font-semibold text-lg leading-tight truncate">{hero.name}</h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: primary }}>
              {hero.category}
            </span>
          </div>
          {hero.tagline && <p className="mt-2 text-sm text-gray-800 line-clamp-1">“{hero.tagline}”</p>}
          {hero.description && <p className="mt-1 text-xs text-gray-600 line-clamp-2">{hero.description}</p>}
        </div>
      </div>
    </div>
  );
}
