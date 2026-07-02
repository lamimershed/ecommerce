/**
 * Design tokens extracted from the product itself (the hand-painted Khurja
 * surahi), shared by the 3D scene, canvas textures and DOM. Not generic
 * template colours — these come straight from the ceramic.
 */
export const palette = {
  cream: "#F7F1E5", // page base — the ceramic's unpainted body
  cobalt: "#1E3A8A", // primary / CTA — the lid & outlines
  terracotta: "#C0392B", // red houses & roofs — hover / warm accent
  mustard: "#E5B426", // yellow houses
  sage: "#7A9E63", // green fields & roofs
  ink: "#1A1A2E", // text
  sky: "#3F8FD0", // sky-blue roofs
  clay: "#E07B39", // orange border band
} as const;

/** The folk dot palette used for scattered polka-dot motifs. */
export const folkColors = [
  palette.terracotta,
  palette.mustard,
  palette.sky,
  palette.sage,
  palette.clay,
  palette.cobalt,
];

export const fonts = {
  display: "var(--font-display)", // Fraunces — headlines
  hand: "var(--font-hand)", // Caveat — handwritten accents
  body: "var(--font-sans)", // Inter — body / UI
} as const;

/** UI tokens reused across the purchase flow. */
export const ui = {
  radius: "0.5rem",
  cta: palette.cobalt,
  ctaHover: palette.terracotta,
  whatsapp: "#25D366",
} as const;

export type Palette = typeof palette;
