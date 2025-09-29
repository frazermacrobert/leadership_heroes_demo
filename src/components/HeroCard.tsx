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

const CARD_H = 200;          // fixed height so all cards match
const ACCENT_SILVER = "#C0C0C0";

// --- helpers ---
function hexToRgb(hex: string) {
  const h = (hex || "#ffffff").replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return { r, g, b };
}
function isVeryLight(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000; // 0..255
  return yiq > 235; // treat very pale/white as "too light"
}

export default function HeroCard({ hero }: { hero: EnrichedHero }) {
  const primaryRaw = hero.color || "#6B7280";
  const secondaryRaw = hero.secondary || "#9CA3AF";

  const primaryVeryLight = isVeryLight(primaryRaw);
  const secondaryVeryLight = isVeryLight(secondaryRaw);

  // Never allow invisible accents
  const primary = primaryVeryLight ? ACCENT_SILVER : primaryRaw;
  const secondary = secondaryVeryLight ? ACCENT_SILVER : secondaryRaw;

  // Chip logic: if the primary is too light OR would force white text, switch to OUTLINE style
  const chipFillText = readableOn(primary); // "#111111" or "#FFFFFF"
  const chipUseOutline = primaryVeryLight || chipFillText === "#FFFFFF";

  const chipStyle = chipUseOutline
    ? { backgroundColor: "#FFFFFF", color: primary, borderColor: primary }
    : { backgroundColor: primary, color: chipFillText, borderColor: primary };

  const borderGradient = useMemo(
    () => ({ background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)` }),
    [primary, secondary]
  );

  return (
    <div className="rounded-2xl p-[2px]" style={borderGradient}>
      <div
        className="rounded-2xl bg-white shadow-sm border"
        style={{
          borderColor: `${primary}33`,
          height: CARD_H,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="p-4 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500">#{hero.number}</span>
            <h3 className="font-semibold text-lg leading-tight truncate">{hero.name}</h3>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full border"
              style={chipStyle}
            >
              {hero.category}
            </span>
          </div>

          {/* Text */}
          {hero.tagline && (
            <p className="mt-2 text-sm text-gray-800 line-clamp-1">“{hero.tagline}”</p>
          )}
          {hero.description && (
            <p className="mt-1 text-xs text-gray-600 line-clamp-2">{hero.description}</p>
          )}

          {/* Accents — never white */}
          <div className="mt-auto pt-3 flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-12 rounded-full"
              style={{ background: primary }}
            />
            <span
              className="inline-block h-1.5 w-8 rounded-full"
              style={{ background: secondary }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
