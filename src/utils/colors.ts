// Map friendly names → hex; falls back to the provided string (hex) or a gray.
export const colorMap: Record<string, string> = {
  "Bright Red": "#E53935",
  Yellow: "#FDD835",
  "Forest Green": "#2E7D32",
  White: "#ffffff",
  Teal: "#00897B",
  Bronze: "#CD7F32",
  Purple: "#6A1B9A",
  Gold: "#D4AF37",
  "Navy Blue": "#1A237E",
  Silver: "#C0C0C0",
  "Royal Blue": "#2C3E9E",
  Orange: "#F57C00",
  Lavender: "#C3B1E1",
  Black: "#111111",
  Emerald: "#2ecc71",
  "Bright Blue": "#1976D2",
  "Light Grey": "#E0E0E0",
  "Dark Grey": "#616161",
  Crimson: "#B71C1C",
  Burgundy: "#7B1E36",
  "Burnt Orange": "#C1521C",
  "Lime Green": "#8BC34A",
  Pink: "#EC407A",
};

export function toColor(v?: string) {
  if (!v) return "#9ca3af";
  return colorMap[v] || v; // if already a hex, use it
}
