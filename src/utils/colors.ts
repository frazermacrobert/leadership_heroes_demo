// src/utils/colors.ts
export const nameHex: Record<string, string> = {
  Teal: "#0FB9B1",
  "Royal Blue": "#2C3E9E",
  Purple: "#6A1B9A",
  Orange: "#F57C00",
  Gold: "#D4AF37",
  Silver: "#C0C0C0",
  Emerald: "#2ECC71",
  "Bright Red": "#E53935",
  "Bright Blue": "#1976D2",
  Lavender: "#C3B1E1",
  "Navy Blue": "#1A237E",
  Burgundy: "#7B1E36",
  "Burnt Orange": "#C1521C",
  Pink: "#EC407A",
  "Dark Grey": "#616161",
  "Light Grey": "#E0E0E0",
};

export const categoryPalette: Record<string, { primary: string; secondary: string }> = {
  "Border Crosser": { primary: "#0FB9B1", secondary: "#2C3E9E" },
  Communicator: { primary: "#6A1B9A", secondary: "#C3B1E1" },
  "Growth Driver": { primary: "#2ECC71", secondary: "#0FB9B1" },
  Navigator: { primary: "#1976D2", secondary: "#2C3E9E" },
  "Pressure Player": { primary: "#F57C00", secondary: "#C1521C" },
  "Purpose Creator": { primary: "#D4AF37", secondary: "#F57C00" },
  "Results Driver": { primary: "#E53935", secondary: "#B71C1C" },
  "Self-Grower": { primary: "#2ECC71", secondary: "#1976D2" },
  "Team Builder": { primary: "#6A1B9A", secondary: "#1976D2" },
  "Trust Builder": { primary: "#2C3E9E", secondary: "#6A1B9A" },
};

export function toHex(v?: string) {
  if (!v) return "";
  return nameHex[v] || v; // passthrough if already a hex
}

export function resolveColors(category: string, color?: string, secondary?: string) {
  const p = toHex(color);
  const s = toHex(secondary);
  if (p && s) return { primary: p, secondary: s };
  const fallback = categoryPalette[category] || { primary: "#6B7280", secondary: "#9CA3AF" };
  return { primary: p || fallback.primary, secondary: s || fallback.secondary };
}

// simple “white/black” contrast helper for badges
export function readableOn(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#111111" : "#FFFFFF";
}
