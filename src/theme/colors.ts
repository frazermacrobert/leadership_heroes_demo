export type Palette = { primary: string; secondary: string };

export const CATEGORY_COLORS: Record<string, Palette> = {
  "Change Maker":     { primary: "#613EFF", secondary: "#E6E0FF" },
  "Navigator":        { primary: "#008CA8", secondary: "#DDF4F8" },
  "Communicator":     { primary: "#F04E3E", secondary: "#FFE3E0" },
  "Growth Driver":    { primary: "#0E7C66", secondary: "#DDF2EE" },
  "Results Driver":   { primary: "#E7A400", secondary: "#FFF2CC" },
  "Purpose Creator":  { primary: "#7D3C98", secondary: "#EFE1F6" },
  "Team Builder":     { primary: "#2F80ED", secondary: "#E6F0FF" },
  "Judgement Maker":  { primary: "#6B7280", secondary: "#ECEFF3" },
  "Pressure Player":  { primary: "#C1351D", secondary: "#FFE7E2" },
  "Border Crosser":   { primary: "#1F7A8C", secondary: "#E0F2F6" },
  "Self-Grower":      { primary: "#16A34A", secondary: "#E6F7EB" },
  "Trust Builder":    { primary: "#A855F7", secondary: "#F3E8FF" },
};

export const DEFAULT_PALETTE: Palette = { primary: "#222222", secondary: "#EEEEEE" };

/** Choose black/white for legibility against a hex background */
export function readableOn(bgHex: string): "#000000" | "#FFFFFF" {
  const hex = bgHex.replace("#", "");
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;
  const srgb = [r, g, b].map(c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  return L > 0.6 ? "#000000" : "#FFFFFF";
}
