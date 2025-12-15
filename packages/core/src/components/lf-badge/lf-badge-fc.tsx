import {
  LF_BADGE_BLOCKS,
  LF_BADGE_PARTS,
  LfBadgeFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * LfBadgeFC - Functional Component for Badge
 *
 * This is a stateless functional component that renders a badge.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-badge Web Component (thin wrapper)
 * 2. Inside other components like shapeeditor (composed usage)
 * 3. Via LfShape rendering (if badge becomes a data shape)
 *
 * Benefits over direct WC usage in compositions:
 * - No Shadow DOM overhead (single shadow root for parent)
 * - No lifecycle hooks per instance
 * - No theme registration per instance
 * - Direct callbacks instead of CustomEvent dispatch
 * - State flows unidirectionally from parent
 *
 * State/Size Props:
 * - `uiState`: Controls color scheme via `data-lf` attribute
 * - `uiSize`: Controls sizing via CSS variable `--lf-fc-ui-size`
 * These are required for composed usage where CSS cascade doesn't work
 * (e.g., portaled content outside the DOM hierarchy).
 *
 * @see Section 2 of 4_0_0_REFACTORING.md (Functional Components Architecture)
 */
export const LfBadgeFC: FunctionalComponent<LfBadgeFCProps> = ({
  badgeRef,
  className,
  framework,
  id,
  imageProps,
  label = "",
  onClick,
  position = "top-left",
  style,
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;
  const { sanitizeProps } = framework;

  const blocks = LF_BADGE_BLOCKS;
  const parts = LF_BADGE_PARTS;

  const { badge } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  return (
    <div
      class={`${bemClass(badge._, null, { [position]: true })}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      onClick={(e) => onClick?.(e)}
      part={parts.badge}
      ref={badgeRef}
      style={computedStyle}
    >
      {label ? (
        <span class={bemClass(badge._, badge.label)} part={parts.label}>
          {label}
        </span>
      ) : imageProps ? (
        <lf-image
          class={bemClass(badge._, badge.image)}
          part={parts.image}
          {...sanitizeProps(imageProps, "LfImage")}
        ></lf-image>
      ) : null}
    </div>
  );
};
