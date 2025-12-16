import { LF_BADGE_CSS_VARS, LfBadgeAdapterJsx } from "@lf-widgets/foundations";
import { LfBadge } from "./lf-badge";

/**
 * Prepares JSX factories for the badge adapter.
 * Note: The main badge rendering is now handled by BadgeFC (fc/badge-fc.tsx).
 * This function is kept for adapter interface compliance.
 */
export const prepBadgeJsx = (): LfBadgeAdapterJsx => {
  return {
    // Badge rendering is handled by BadgeFC in render()
    // This placeholder satisfies the adapter interface
    badge: () => null,
  };
};

//#region Helpers
export const computeBadgeStyles = (
  lfPosition: string,
  lfStyle: string,
  setLfStyle: (comp: LfBadge) => string,
  comp: LfBadge,
): string => {
  const styles: Record<string, string> = {};
  const { transform } = LF_BADGE_CSS_VARS;
  const isInline = lfPosition === "inline";

  if (!isInline) {
    const [ver, hor] = lfPosition.split("-");
    const y = ver === "bottom" ? "bottom" : "top";
    const x = hor === "right" ? "right" : "left";
    const translateX = hor === "right" ? "50%" : "-50%";
    const translateY = ver === "bottom" ? "50%" : "-50%";

    styles[y] = "0";
    styles[x] = "0";
    styles[transform] = `translate(${translateX}, ${translateY})`;
  } else {
    styles[transform] = "none";
  }

  const hostStyles = Object.entries(styles)
    .map(([prop, value]) => `${prop}: ${value}`)
    .join("; ");

  const customStyles = (lfStyle && setLfStyle(comp)) || "";

  return `:host { ${hostStyles} }\n${customStyles}`;
};
//#endregion
