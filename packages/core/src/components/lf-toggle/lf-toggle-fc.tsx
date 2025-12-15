import {
  CY_ATTRIBUTES,
  LF_TOGGLE_BLOCKS,
  LF_TOGGLE_PARTS,
  LfToggleFCProps,
} from "@lf-widgets/foundations";
import { FunctionalComponent, h } from "@stencil/core";

/**
 * LfToggleFC - Functional Component for Toggle
 *
 * This is a stateless functional component that renders a toggle switch.
 * All state is managed by the parent component; this FC is purely presentational.
 *
 * Usage patterns:
 * 1. Inside lf-toggle Web Component (thin wrapper)
 * 2. Inside other components like shapeeditor (composed usage)
 * 3. Via LfShape rendering (if toggle becomes a data shape)
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
export const LfToggleFC: FunctionalComponent<LfToggleFCProps> = ({
  ariaLabel,
  className,
  disabled = false,
  framework,
  id,
  inputRef,
  label = "",
  leadingLabel = false,
  onBlur,
  onChange,
  onFocus,
  onLabelClick,
  onPointerDown,
  style,
  thumbRef,
  trackRef,
  uiSize = "medium",
  uiState = "primary",
  value,
}) => {
  const { bemClass } = framework.theme;

  const blocks = LF_TOGGLE_BLOCKS;
  const parts = LF_TOGGLE_PARTS;

  const { formField, toggle } = blocks;

  // Build style object with size variable if not medium (default)
  const computedStyle =
    uiSize !== "medium"
      ? { ...style, "--lf-fc-ui-size": `var(--lf-ui-size-${uiSize})` }
      : style;

  // Compute accessible label with fallback chain
  const accessibleLabel = (ariaLabel || label || id || "toggle").trim();

  return (
    <div
      class={`${bemClass(formField._, null, { leading: leadingLabel })}${className ? ` ${className}` : ""}`}
      data-lf={uiState}
      id={id}
      part={parts.toggle}
      style={computedStyle}
    >
      <div
        class={bemClass(toggle._, null, {
          active: value,
          disabled,
        })}
      >
        <div
          class={bemClass(toggle._, toggle.track)}
          part={parts.track}
          ref={trackRef}
        ></div>
        <div class={bemClass(toggle._, toggle.thumbUnderlay)}>
          <div
            class={bemClass(toggle._, toggle.thumb)}
            part={parts.thumb}
            ref={thumbRef}
          ></div>
          <input
            aria-label={accessibleLabel}
            checked={value}
            class={bemClass(toggle._, toggle.nativeControl)}
            data-cy={CY_ATTRIBUTES.input}
            disabled={disabled}
            onBlur={(e) => onBlur?.(e)}
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              onChange?.(target.checked, e);
            }}
            onFocus={(e) => onFocus?.(e)}
            onPointerDown={(e) => onPointerDown?.(e)}
            part={parts.nativeControl}
            ref={inputRef}
            role="switch"
            type="checkbox"
            value={value ? "on" : "off"}
          ></input>
        </div>
      </div>
      <label
        class={bemClass(formField._, formField.label)}
        onClick={(e) => onLabelClick?.(e)}
        part={parts.label}
      >
        {label}
      </label>
    </div>
  );
};
