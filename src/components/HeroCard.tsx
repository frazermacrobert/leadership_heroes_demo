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

const CARD_MIN_H = "12rem";

// tiny helpers
function hexToRgb(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return { r, g, b };
}
function isVeryLight(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  // YIQ luminance; threshold high to catch whites/pale tints
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq > 235; // very light
}

export default function HeroCard({ hero }: { hero: EnrichedHero }) {
  const primaryRaw = hero.color || "#6B7280";
  const secondaryRaw = hero.secondary || "#9CA3AF";

  const primaryVeryLight = isVeryLight(primaryRaw);
  const secondaryVeryLight = isVeryLight(secondaryRaw);

  // use visible accents if a colour is too light
  const ACCENT_SILVER = "#C0C0C0";
  const primaryAccent = primaryVeryLight ? ACCENT_SILVER : primaryRaw;
  const secondaryAccent = secondaryVeryLight ? ACCENT_SILVER : secondaryRaw;

  // category pill: avoid white-on-white by switching to secondary when primary is too light
  const pillBg = primaryVeryLight ? secondaryAccent : primaryAccent;
  const pillText = readableOn(pillBg);

  const borderGradient = useMemo(
    () => ({ background: `linear-gradient(135deg, ${primaryAccent} 0%, ${secondaryAccent} 100%)` }),
    [primaryAccent, secondaryAccent]
  );

  return (
    <div className="rounded-2xl p-[2px]" style={borderGradient}>
      <div
        className="rounded-2xl bg-white shadow-sm border"
        style={{ borderColor: `${primaryAccent}33`, minHeight: CARD_MIN_H, display: "flex", flexDirection: "column" }}
      >
        <div className="p-4 flex-1 flex flex-col">
          {/* header row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500">#{hero.number}</span>
            <h3 className="font-semibold text-lg leading-tight truncate">{hero.name}</h3>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full border"
              style={{ borderColor: pillBg, backgroundColor: pillBg, color: pillText }}
            >
              {hero.category}
            </span>
          </div>

          {/* tagline + description */}
          {hero.tagline && <p className="mt-2 text-sm text-gray-800 line-clamp-1">“{hero.tagline}”</p>}
          {hero.description && <p className="mt-1 text-xs text-gray-600 line-clamp-2">{hero.description}</p>}

          {/* bottom accents (never invisible) */}
          <div className="mt-auto pt-3 flex items-center gap-2">
            <span className="inline-block h-1.5 w-12 rounded-full" style={{ background: primaryAccent }} />
            <span className="inline-block h-1.5 w-8 rounded-full" style={{ background: secondaryAccent }} />
          </div>
        </div>
      </div>
    </div>
  );
}
