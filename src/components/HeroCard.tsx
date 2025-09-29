import React from "react";
import { readableOn } from "../theme/colors";

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
};

export default function HeroCard({ hero }: Props) {
  const primary =
    typeof hero.color === "string" && hero.color ? hero.color : "#6b7280"; // gray-600
  const secondary =
    typeof hero.secondary === "string" && hero.secondary ? hero.secondary : "#9ca3af"; // gray-400

  const textOnPrimary = readableOn(primary);
  const textOnSecondary = readableOn(secondary);

  return (
    <div
      className={[
        "rounded-2xl shadow-md overflow-hidden border bg-white",
      ].join(" ")}
      style={{ borderColor: primary }}
    >
      {/* top strip */}
      <div className="h-1.5" style={{ backgroundColor: primary }} />

      <div className="p-4 flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-xl overflow-hidden border flex items-center justify-center"
          style={{ borderColor: primary, backgroundColor: "#fff" }}
        >
          {hero.image ? (
            <img
              src={hero.image}
              alt={hero.name || "Hero"}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-xs text-gray-400">No image</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500">#{hero.number}</span>
            <h3 className="font-semibold text-lg leading-tight truncate">
              {hero.name || "Unnamed Hero"}
            </h3>
            <span
              className="text-xs px-2 py-1 rounded-full border"
              style={{
                backgroundColor: primary,
                color: textOnPrimary,
                borderColor: primary,
              }}
            >
              {hero.category || "Uncategorised"}
            </span>
          </div>

          {/* Identity bars */}
          <div className="mt-2 flex gap-1.5 items-center">
            <span
              className="inline-block h-2 w-12 rounded-full"
              style={{ backgroundColor: primary }}
            />
            <span
              className="inline-block h-2 w-6 rounded-full"
              style={{
                backgroundColor: secondary,
                border: `1px solid ${primary}22`,
              }}
            />
          </div>

          {/* Tagline + description */}
          {hero.tagline && (
            <p className="mt-2 text-sm text-gray-700 line-clamp-1">
              {hero.tagline}
            </p>
          )}
          {hero.description && (
            <p className="mt-1 text-xs text-gray-600 line-clamp-2">
              {hero.description}
            </p>
          )}
        </div>
      </div>

      {/* bottom accent */}
      <div className="h-1" style={{ backgroundColor: secondary }} />
    </div>
  );
}
