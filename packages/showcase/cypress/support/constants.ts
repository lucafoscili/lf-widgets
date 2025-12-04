export const CY_CATEGORIES = {
  basic: "Basic",
  cssClasses: "CSS Classes",
  e2e: "e2e",
  events: "Events",
  methods: "Methods",
  props: "Props",
} as const;

export const CY_ALIASES = {
  eventElement: "@eventElement",
  lfComponentShowcase: "@lfComponentShowcase",
} as const;

/**
 * Effect layer selectors for testing.
 * These map to [data-lf-effect-layer="<value>"] attributes.
 */
export const CY_EFFECT_LAYERS = {
  neonGlow: "neon-glow",
  neonGlowReflection: "neon-glow-reflection",
  ripple: "ripple",
  tiltHighlight: "tilt-highlight",
} as const;
