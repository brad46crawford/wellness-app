// Industrial garage-gym palette: concrete greys with a Titan Green accent.
export const colors = {
  background: "#121214", // concrete floor
  surface: "#1C1C1F", // steel panel / card
  surfaceLight: "#28282C", // brushed steel, inputs & tracks
  primary: "#006747", // Titan Green — solid fills (buttons, active states)
  primaryDark: "#00432E", // pressed states / "me" chat bubble
  primaryLight: "#1F9A6C", // brighter green for small text on dark surfaces
  onPrimary: "#F5F5F5", // text/icons on top of solid Titan Green
  accent: "#006747",
  text: "#F2F2F0", // chalk white
  textMuted: "#9A9A9E", // dust grey
  border: "#3A3A3E", // steel edge
  danger: "#C0392B", // rust red
  // Secondary accent — brushed chrome, distinct from Titan Green so
  // personal (individual) goals read differently from group goals.
  steel: "#C4C9D1",
  steelDim: "#8A8F98",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48, // true section breaks (e.g. leaderboard -> tasks on Home)
};

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  pill: 999,
};

// Bebas Neue for titles/headers — bolder, more athletic edge than the
// system font. Body text stays on the system default for readability.
export const fonts = {
  heading: "BebasNeue_400Regular",
};
