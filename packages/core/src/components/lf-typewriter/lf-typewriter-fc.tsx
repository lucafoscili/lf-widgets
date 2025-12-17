import {
  LF_TYPEWRITER_BLOCKS,
  LF_TYPEWRITER_PARTS,
  LfTypewriterFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * LfTypewriterFC - Functional Component for Typewriter
 *
 * This is a stateless functional component that renders a typewriter effect.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-typewriter Web Component (thin wrapper)
 * 2. Inside other components like chat or article (composed usage)
 * 3. Via LfShape rendering (if typewriter becomes a data shape)
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
export const LfTypewriterFC: FunctionalComponent<LfTypewriterFCProps> = ({
  blocks = LF_TYPEWRITER_BLOCKS,
  className,
  cursorRef,
  displayedText = "",
  framework,
  id,
  parts = LF_TYPEWRITER_PARTS,
  shouldShowCursor = true,
  style,
  tag = "p",
  textRef,
  typewriterRef,
  uiSize = "medium",
  uiState = "primary",
}) => {
  const { bemClass } = framework.theme;

  const { typewriter } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  const TagName = tag || "p";

  return (
    <div
      class={`${bemClass(typewriter._)}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      part={parts.typewriter}
      ref={typewriterRef}
      style={computedStyle}
    >
      <TagName
        class={bemClass(typewriter._, typewriter.text)}
        part={parts.text}
        ref={textRef}
      >
        <span>{displayedText || "\u00A0"}</span>
        {shouldShowCursor && (
          <span
            class={bemClass(typewriter._, typewriter.cursor)}
            part={parts.cursor}
            ref={cursorRef}
          ></span>
        )}
      </TagName>
    </div>
  );
};
