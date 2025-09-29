import React, { useMemo } from "react";
import { toColor } from "../utils/colors";

type CardHero = {
  id: string | number;
  number: number;
  category: string;
  name: string;
  tagline?: string;
  description?: string;
  color: string;     // primary
  secondary: string; // secondary
};

export default function HeroCard({
  hero,
  clickable = false,
  onClick,
  drawEmpty = false,
}: {
  hero: CardHero;
  clickable?: boolean;
  onClick?: () => void;
  drawEmpty?: boolean;
}) {
  const primary = toColor(hero.color);
  const secondary = toColor(hero.secondary);

  const accent = useMemo(
    () => ({ background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)` }),
    [primary, secondary]
  );

  const canDiscard = clickable && !drawEmpty;

  return (
    <div
      className={`rounded-2xl overflow-hidden border bg-white shadow ${canDiscard ? "cursor-pointer hover:shadow-md" : ""}`}
      onClick={canDiscard ? onClick : undefined}
      title={
        canDiscard
          ? "Click to discard this card"
          : drawEmpty && clickable
          ? "Draw pile is empty — discarding disabled"
          : undefined
      }
      style={{ borderColor: `${primary}33` }}
    >
      <div className="h-1.5" style={accent} />
      <div className="p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-gray-500">#{hero.number}</span>
          <h3 className="font-semibold text-lg leading-tight truncate">{hero.name}</h3>
          <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: primary }}>
            {hero.category}
          </span>
        </div>
        {hero.tagline && (
          <p className="mt-2 text-sm text-gray-800 line-clamp-1">“{hero.tagline}”</p>
        )}
        {hero.description && (
          <p className="mt-1 text-xs text-gray-600 line-clamp-2">{hero.description}</p>
        )}
      </div>
      <div className="flex items-center justify-between px-3 py-2 text-xs">
        <div className="flex gap-2">
          <span className="inline-block h-1.5 w-10 rounded-full" style={{ background: primary }} />
          <span className="inline-block h-1.5 w-6 rounded-full" style={{ background: secondary }} />
        </div>
        {clickable &&
          (drawEmpty ? (
            <span className="text-gray-400">No draw left</span>
          ) : (
            <span className="text-red-600">❌</span>
          ))}
      </div>
    </div>
  );
}
